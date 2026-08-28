import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { mysupabase } from "@/Supabase/SupabaseConfig";
import { calculateVariantPrice } from "@/lib/pricing";

export async function POST(req: NextRequest) {
    try {
        const { orderdata, recaptchaToken } = await req.json();

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

        // 2. Parse Order Header and Items
        let orderHeader: any;
        let itemsToInsert: any[] = [];

        if (orderdata.order_header && Array.isArray(orderdata.order_items)) {
            // New explicit schema structure
            orderHeader = {
                user_id: orderdata.order_header.user_id,
                address_id: orderdata.order_header.address_id,
                payment_status: orderdata.order_header.payment_status || 'PENDING',
                payment_method: orderdata.order_header.payment_method || 'Razorpay',
                subtotal: orderdata.order_header.subtotal || 0,
                discount_amount: orderdata.order_header.discount_amount || 0,
                shipping_charge: orderdata.order_header.shipping_charge || 0,
                tax_amount: orderdata.order_header.tax_amount || 0,
                grand_total: orderdata.order_header.grand_total || 0,
                coupon_code: orderdata.order_header.coupon_code || null,
                fulfillment_status: 'Pending',
                return_status: 'None',
                customer_note: orderdata.order_header.customer_note || null,
            };
            itemsToInsert = orderdata.order_items;
        } else {
            // Flattened / Single product payload (Legacy adapter)
            orderHeader = {
                user_id: orderdata.user_id,
                address_id: orderdata.address_id,
                payment_status: 'PENDING',
                payment_method: 'Razorpay',
                subtotal: Number(orderdata.total_amount || orderdata.final_price || 0),
                discount_amount: Number(orderdata.discount_amount || 0),
                shipping_charge: 0,
                tax_amount: 0,
                grand_total: Number(orderdata.final_price || orderdata.total_amount || 0),
                coupon_code: orderdata.coupon_code || null,
                fulfillment_status: 'Pending',
                return_status: 'None',
            };

            itemsToInsert = [{
                product_id: orderdata.product_key || orderdata.product_id,
                variant_id: orderdata.variant_id || null,
                quantity: orderdata.quantity || 1,
                unit_price: Number(orderdata.unit_price || orderdata.final_price || 0),
                discount_amount: Number(orderdata.discount_amount || 0),
                final_price: Number(orderdata.final_price || 0),
                color: typeof orderdata.color === 'object' ? JSON.stringify(orderdata.color) : orderdata.color,
                size: typeof orderdata.size === 'object' ? JSON.stringify(orderdata.size) : orderdata.size,
                discount_id: orderdata.discount_id || null,
            }];
        }

        // 3. Server-side Recalculation & Verification
        const variantIds = itemsToInsert.map(item => item.variant_id).filter(Boolean);
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
        if (orderHeader.coupon_code) {
            const { data } = await mysupabase
                .from("coupons")
                .select("*")
                .ilike("code", orderHeader.coupon_code.trim())
                .eq("is_active", true)
                .single();
            dbCoupon = data;
        }

        let serverSubtotal = 0;
        let serverDiscountAmount = 0;
        const validatedItems = itemsToInsert.map(item => {
            const dbVariant = dbVariants.find(v => v.id === item.variant_id);
            if (!dbVariant) {
                throw new Error(`Variant with ID ${item.variant_id} not found in database.`);
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
                color: typeof item.color === 'object' ? JSON.stringify(item.color) : item.color,
                size: typeof item.size === 'object' ? JSON.stringify(item.size) : item.size,
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

        orderHeader.subtotal = serverSubtotal;
        orderHeader.discount_amount = serverDiscountAmount + couponDiscount;
        orderHeader.grand_total = serverGrandTotal;

        // 4. Insert Header into `orders` Table
        const { data: createdOrder, error: orderError } = await mysupabase
            .from("orders")
            .insert(orderHeader)
            .select()
            .single();

        if (orderError || !createdOrder) {
            console.error("Error inserting order header:", orderError);
            return NextResponse.json(
                { error: orderError?.message || "Failed to create order record" },
                { status: 400 }
            );
        }

        // 5. Attach `order_id` to items and insert into `order_items` Table
        const formattedItems = validatedItems.map(item => ({
            ...item,
            order_id: createdOrder.id
        }));

        const { data: insertedItems, error: itemsError } = await mysupabase
            .from("order_items")
            .insert(formattedItems)
            .select();

        if (itemsError) {
            console.error("Error inserting order items:", itemsError);
            // Delete header if items insert fails
            await mysupabase.from("orders").delete().eq("id", createdOrder.id);
            return NextResponse.json(
                { error: itemsError.message || "Failed to insert order items" },
                { status: 400 }
            );
        }

        const fullOrder = {
            ...createdOrder,
            order_items: insertedItems
        };

        return NextResponse.json({ success: true, data: fullOrder }, { status: 200 });

    } catch (error: any) {
        console.error("Server error placing order:", error);
        return NextResponse.json(
            { error: error?.message || "Server error placing order" },
            { status: 500 }
        );
    }
}