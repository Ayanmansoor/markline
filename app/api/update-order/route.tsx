import { NextRequest, NextResponse } from "next/server";
import { mysupabase } from "@/Supabase/SupabaseConfig";

interface ApiOrderProps {
  SavedOrders: any;
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

    const targetOrderId = SavedOrders?.id || SavedOrders;

    const query = mysupabase
      .from("orders")
      .update({
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
        payment_status: "PAID",
      })
      .eq("id", targetOrderId);

    if (user_id) {
      query.eq("user_id", user_id);
    }

    const { data, error } = await query
      .select(`
        *,
        address:address_id(*),
        order_items(
          *,
          product:product_id(*),
          variant:variant_id(*)
        )
      `)
      .single();

    if (error) {
      console.error("Error updating order payment status:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, updated: data }, { status: 200 });
  } catch (error) {
    console.error("Server error updating order:", error);
    return NextResponse.json(
      { success: false, error: "Server error", details: String(error) },
      { status: 500 }
    );
  }
}
