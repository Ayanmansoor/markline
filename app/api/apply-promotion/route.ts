import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { mysupabase } from "@/Supabase/SupabaseConfig";

export async function POST(req: NextRequest) {
  try {
    // const { promo_code, order_id, customer_id } = await req.json();

    return NextResponse.json(
      {
        valid: false,
        message: "Promotions are not available on this store.",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        valid: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}