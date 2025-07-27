import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { mysupabase } from "@/Supabase/SupabaseConfig";

export async function POST(req:NextRequest,res:NextResponse){
    try{
        // const {order_id,customer_id}=await req.json()

    return NextResponse.json(
      {
        promotions: [],
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        promotions: [],
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}