import { NextRequest, NextResponse } from "next/server";
import { mysupabase } from "@/Supabase/SupabaseConfig";
import { OrderProps } from "@/types/interfaces";

interface ApiOrderProps {
  SavedOrders: OrderProps,
  user_id?: string;
  razorpay_order_id: string;
  razorpay_signature: string;
  razorpay_payment_id: string;
}

export async function POST(req: NextRequest) {
  try {
    const {
      SavedOrders,
      user_id,
      razorpay_order_id,
      razorpay_signature,
      razorpay_payment_id,
    }: ApiOrderProps = await req.json();

    // console.log(SavedOrders,user_id,razorpay_order_id,razorpay_signature,razorpay_payment_id,"this is update orders")

    const query = mysupabase
      .from("orders")
      .update({
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
      })
      .eq("id", SavedOrders.id);

    if (user_id) {
      query.eq("user_id", user_id);
    }

    const { data, error } = await query.select(`
          *,
          product_key (
            name
          )
        `).single();


    if (error) {
      console.log(error, "this is product data")

      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, updated: data }, { status: 200 });
  } catch (error) {
    console.log(error, "this is product data")
    return NextResponse.json(
      { success: false, error: "Server error", details: String(error) },
      { status: 500 }
    );
  }
}
