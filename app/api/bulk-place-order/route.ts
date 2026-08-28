import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { mysupabase } from "@/Supabase/SupabaseConfig";
import { calculateVariantPrice } from "@/lib/pricing";

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

        const firstItem = itemsList[0];

        // 2. Server-side Recalculation & Verification
        const variantIds = itemsList.map(item => item.variant_id || item.variant?.id).filter(Boolean);
        let dbVariants: any[] = [];
        if (variantIds.length > 0) {
            const { data, error } = await mysupabase
                .from("product_variants")
                .select("*, discounts:discount_key(*)")
                .in("id", variantIds);
            if (error) {
                console.error("Error fetching db variants:", error);
                return NextResponse.json({ error: "Failed to verify product variant pricing" }, { status: 400 });
            }
            dbVariants = data || [];
        }

        let dbCoupon = null;
        const couponCode = order_header?.coupon_code;
        if (couponCode) {
            const { data } = await mysupabase
                .from("coupons")
                .select("*")
                .ilike("code", couponCode.trim())
                .eq("is_active", true)
                .single();
            dbCoupon = data;
        }

        let serverSubtotal = 0;
        let serverDiscountAmount = 0;
        const validatedItems = itemsList.map(item => {
            const variantId = item.variant_id || item.variant?.id;
            const dbVariant = dbVariants.find(v => v.id === variantId);
            if (!dbVariant) {
                throw new Error(`Variant with ID ${variantId} not found in database.`);
            }

            const priceDetails = calculateVariantPrice(dbVariant, dbVariant.discounts);
            const qty = Number(item.quantity || 1);

            serverSubtotal += priceDetails.finalPrice * qty;
            serverDiscountAmount += priceDetails.promoDiscount * qty;

            return {
                product_id: dbVariant.products_id,
                variant_id: dbVariant.id,
                quantity: qty,
                mrp: priceDetails.mrp,
                retail_price: priceDetails.retailPrice,
                discount_amount: priceDetails.promoDiscount,
                unit_price: priceDetails.finalPrice,
                final_price: priceDetails.finalPrice * qty,
                color: typeof item.color === 'object' ? JSON.stringify(item.color) : (item.color || JSON.stringify(item.variant?.selectedColor || dbVariant.colors)),
                size: typeof item.size === 'object' ? JSON.stringify(item.size) : (item.size || JSON.stringify(item.variant?.selectedSize || dbVariant.sizes)),
                discount_id: dbVariant.discounts?.discount_id || dbVariant.discount_key || null,
            };
        });

        let couponDiscount = 0;
        if (dbCoupon) {
            const couponVal = Number((dbCoupon as any).discount_value || 0);
            const type = String((dbCoupon as any).discount_type || '').toUpperCase();
            const isPercent = type === 'PERCENTAGE' || type === 'PERCENT';

            if (isPercent) {
                couponDiscount = serverSubtotal * (couponVal / 100);
                const maxDiscount = Number((dbCoupon as any).maximum_discount_amount || 0);
                if (maxDiscount > 0 && couponDiscount > maxDiscount) {
                    couponDiscount = maxDiscount;
                }
            } else {
                couponDiscount = couponVal;
            }
            couponDiscount = Math.min(couponDiscount, serverSubtotal);
        }

        const serverGrandTotal = Math.max(0, serverSubtotal - couponDiscount);

        const headerPayload = {
            user_id: order_header?.user_id || firstItem.user_id,
            address_id: order_header?.address_id || firstItem.address_id,
            payment_status: 'PENDING',
            payment_method: 'Razorpay',
            subtotal: serverSubtotal,
            discount_amount: serverDiscountAmount + couponDiscount,
            shipping_charge: order_header?.shipping_charge || 0,
            tax_amount: order_header?.tax_amount || 0,
            grand_total: serverGrandTotal,
            fulfillment_status: 'Pending',
            return_status: 'None',
            coupon_code: couponCode || null,
        };

        // 3. Insert into `orders`
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

        // 4. Format items and insert into `order_items`
        const formattedItems = validatedItems.map(item => ({
            ...item,
            order_id: createdOrder.id
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
            { error: error?.message || "Server error placing bulk order" },
            { status: 500 }
        );
    }
}