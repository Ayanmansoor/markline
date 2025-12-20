import { NextRequest, NextResponse } from "next/server";
import { mysupabase } from "@/Supabase/SupabaseConfig";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const {
      name,
      state_name,
      city,
      pin_code,
      user_id,
      is_selected,
      full_address,
      id,
      recaptchaToken,
    } = await req.json();

    // 1. Verify reCAPTCHA
    const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
    const verifyResponse = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      new URLSearchParams({
        secret: recaptchaSecret!,
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
        {
          error: "reCAPTCHA verification failed",
          details: verifyResult["error-codes"],
        },
        { status: 403 }
      );
    }

    // 2. Update the address
    const { data, error } = await mysupabase
      .from("address")
      .update({
        name,
        state_name,
        city,
        pin_code,
        is_selected,
        full_address,
      })
      .eq("user_id", user_id)
      .eq("id", id)
      .select();

    if (error) {
      return NextResponse.json(
        { error: error.message || "Failed to update address" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error("Server error while updating address:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error },
      { status: 500 }
    );
  }
}
