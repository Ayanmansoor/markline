import { NextRequest, NextResponse } from "next/server";
import { mysupabase } from "@/Supabase/SupabaseConfig";

export async function POST(req: NextRequest) {
    try {
        const { OrderedProducts, razorpay_payment_id, razorpay_order_id, razorpay_signature, user_id } = await req.json();

        const ordersList = Array.isArray(OrderedProducts) ? OrderedProducts : [OrderedProducts];
        
        const updatePromises = ordersList.map((order: any) => {
            const orderId = order.id || order;
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

            return query.select(`
                *,
                address:address_id(*),
                order_items(
                    *,
                    product:product_id(*),
                    variant:variant_id(*)
                )
            `);
        });

        const results = await Promise.all(updatePromises);
        const updatedData = results.flatMap((r) => r.data || []);
        const updateErrors = results.filter((r) => r.error);

        if (updateErrors.length > 0) {
            console.error("Errors updating bulk orders:", updateErrors);
            return NextResponse.json(
                { error: "Failed updating payment details for some orders" },
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