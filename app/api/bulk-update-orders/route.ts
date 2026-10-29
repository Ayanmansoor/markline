import { NextRequest, NextResponse } from "next/server";
import { mysupabase } from "@/Supabase/SupabaseConfig";
import { verifyPaymentSignature, deductOrderStock } from "@/lib/razorpay";

export async function POST(req: NextRequest) {
    try {
        const { OrderedProducts, razorpay_payment_id, razorpay_order_id, razorpay_signature, user_id } = await req.json();

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return NextResponse.json(
                { error: "Missing required payment verification details" },
                { status: 400 }
            );
        }

        // 1. Verify Razorpay HMAC-SHA256 signature
        const isValidSignature = verifyPaymentSignature({
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id,
            signature: razorpay_signature,
        });

        if (!isValidSignature) {
            console.error("Invalid signature in bulk-update-orders. Possible tampering.");
            return NextResponse.json(
                { error: "Payment verification failed. Invalid signature." },
                { status: 400 }
            );
        }

        const ordersList = Array.isArray(OrderedProducts) ? OrderedProducts : [OrderedProducts];
        
        const updatePromises = ordersList.map(async (order: any) => {
            const orderId = order.id || order;

            // Check if already paid
            const { data: existing } = await mysupabase
                .from("orders")
                .select("id, payment_status")
                .eq("id", orderId)
                .single();

            if (existing?.payment_status === "PAID") {
                return mysupabase
                    .from("orders")
                    .select(`
                        *,
                        address:address_id(*),
                        order_items(
                            *,
                            product:product_id(*),
                            variant:variant_id(*)
                        )
                    `)
                    .eq("id", orderId)
                    .single();
            }

            let query = mysupabase
                .from("orders")
                .update({
                    razorpay_payment_id,
                    razorpay_order_id,
                    razorpay_signature,
                    payment_status: "PAID",
                })
                .eq("id", orderId);

            if (user_id) {
                query = query.eq("user_id", user_id);
            }

            const updateRes = await query.select(`
                *,
                address:address_id(*),
                order_items(
                    *,
                    product:product_id(*),
                    variant:variant_id(*)
                )
            `).single();

            // Deduct stock for this order
            await deductOrderStock(orderId);

            return updateRes;
        });

        const results = await Promise.all(updatePromises);
        const updatedData = results.flatMap((r) => r.data ? [r.data] : []);
        const updateErrors = results.filter((r) => r.error);

        if (updateErrors.length > 0 && updatedData.length === 0) {
            console.error("Errors updating bulk orders:", updateErrors);
            return NextResponse.json(
                { error: "Failed updating payment details for orders" },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, updated: updatedData[0] || updatedData, data: updatedData }, { status: 200 });
    }
    catch (error: any) {
        console.error("Server error in bulk-update-orders:", error);
        return NextResponse.json({ error: error?.message || "Server error" }, { status: 500 });
    }
}