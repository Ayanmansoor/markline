import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { mysupabase } from "@/Supabase/SupabaseConfig";
import { BulkOrderProductProps } from "@/types/interfaces";


export async function POST(req:NextRequest,res:NextResponse) {
    try{
         
        const {OrderedProducts,razorpay_payment_id,razorpay_order_id,razorpay_signature,user_id}=await req.json()

            const updatePromises = OrderedProducts.map((order) => {
            let query = mysupabase
                .from("orders")
                .update({
                razorpay_payment_id,
                razorpay_order_id,
                razorpay_signature,
                })
                .eq("id", order.id);

            if (order.user_id) {
                query = query.eq("user_id", order.user_id);
            }

            return query.select(`
                *,
                product_key (
                name
                )
            `);
            });

            const results = await Promise.all(updatePromises);

            const updatedData = results.flatMap((r) => r.data || []);
            const updateErrors = results.filter((r) => r.error);


            if(updateErrors.length){
                  return NextResponse.json(
                        { error:  "Something went wrong inserting the email" },
                        { status: 403 }
                );
            }

        
    return NextResponse.json({ success: true , data:updatedData }, { status: 200 });
    }
    catch(error){
            return NextResponse.json({ error: error || "server error " },{ status: 500 });
    }
}