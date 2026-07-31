import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { mysupabase } from "@/Supabase/SupabaseConfig";

export async function POST(req: NextRequest) {
    try {
        const { products, order_header, recaptchaToken } = await req.json();

        // 1. Verify reCAPTCHA
        const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
        if (recaptchaSecret && recaptchaToken) {
            const verifyResponse = await axios.post(
                "https://www.google.com/recaptcha/api/siteverify",
                new URLSearchParams({
                    secret: recaptchaSecret,
                    response: recaptchaToken,
                }),
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                }
            );

            const verifyResult = verifyResponse.data;
            if (!verifyResult.success) {
                return NextResponse.json(
                    { error: "reCAPTCHA verification failed", details: verifyResult['error-codes'] },
                    { status: 403 }
                );
            }
        }

        const itemsList = Array.isArray(products) ? products : [];
        if (itemsList.length === 0) {
            return NextResponse.json({ error: "No products in checkout payload" }, { status: 400 });
        }

        // Calculate totals if order_header is not explicitly passed
        const firstItem = itemsList[0];
        const subtotal = order_header?.subtotal || itemsList.reduce((acc, curr) => acc + (Number(curr.final_price || curr.unit_price || 0) * (curr.quantity || 1)), 0);
        const discountAmount = order_header?.discount_amount || itemsList.reduce((acc, curr) => acc + (Number(curr.discount_amount || 0)), 0);
        const grandTotal = order_header?.grand_total || subtotal;

        const headerPayload = {
            user_id: order_header?.user_id || firstItem.user_id,
            address_id: order_header?.address_id || firstItem.address_id,
            payment_status: 'PENDING',
            payment_method: 'Razorpay',
            subtotal: subtotal,
            discount_amount: discountAmount,
            shipping_charge: order_header?.shipping_charge || 0,
            tax_amount: order_header?.tax_amount || 0,
            grand_total: grandTotal,
            fulfillment_status: 'Pending',
            return_status: 'None',
            coupon_code: order_header?.coupon_code || null,
        };

        // 2. Insert into `orders`
        const { data: createdOrder, error: orderError } = await mysupabase
            .from("orders")
            .insert(headerPayload)
            .select()
            .single();

        if (orderError || !createdOrder) {
            console.error("Error creating bulk order header:", orderError);
            return NextResponse.json(
                { error: orderError?.message || "Failed to create order header" },
                { status: 400 }
            );
        }

        // 3. Format items and insert into `order_items`
        const formattedItems = itemsList.map(item => ({
            order_id: createdOrder.id,
            product_id: item.product_id || item.product_key || item.productId,
            variant_id: item.variant_id || item.variant?.id || null,
            quantity: item.quantity || 1,
            unit_price: Number(item.unit_price || item.final_price || 0),
            discount_amount: Number(item.discount_amount || item.discountAmt || 0),
            final_price: Number(item.final_price || item.finalPrice || 0),
            color: typeof item.color === 'object' ? JSON.stringify(item.color) : (item.color || JSON.stringify(item.variant?.selectedColor)),
            size: typeof item.size === 'object' ? JSON.stringify(item.size) : (item.size || JSON.stringify(item.variant?.selectedSize)),
            discount_id: item.discount_id || null,
        }));

        const { data: insertedItems, error: itemsError } = await mysupabase
            .from("order_items")
            .insert(formattedItems)
            .select();

        if (itemsError) {
            console.error("Error inserting bulk order items:", itemsError);
            await mysupabase.from("orders").delete().eq("id", createdOrder.id);
            return NextResponse.json(
                { error: itemsError.message || "Failed to insert bulk order items" },
                { status: 400 }
            );
        }

        const fullOrder = {
            ...createdOrder,
            order_items: insertedItems
        };

        return NextResponse.json({ success: true, data: fullOrder }, { status: 200 });

    } catch (error: any) {
        console.error("Server error placing bulk order:", error);
        return NextResponse.json(
            { error: error?.message || "Server error placing order" },
            { status: 500 }
        );
    }
}