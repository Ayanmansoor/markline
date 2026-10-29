import { NextRequest, NextResponse } from "next/server";
import { mysupabase } from "@/Supabase/SupabaseConfig";
import { getAuthenticatedUser } from "@/lib/authHelper";
import axios from "axios";

export async function POST(req: Request) {
  try {
    // 1. Authenticate user from session
    const { user, error: authError } = await getAuthenticatedUser(req);
    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized: Please log in to delete an address" },
        { status: 401 }
      );
    }

    const {
      id,
      recaptchaToken,
    } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Address ID is required" }, { status: 400 });
    }

    // 2. Verify reCAPTCHA if secret & token are configured
    const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
    if (recaptchaSecret && recaptchaToken) {
      try {
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
            {
              error: "reCAPTCHA verification failed",
              details: verifyResult["error-codes"],
            },
            { status: 403 }
          );
        }
      } catch (captchaErr) {
        console.warn("reCAPTCHA validation error in delete-address:", captchaErr);
      }
    }

    // 3. Prevent IDOR: Delete only if address belongs to authenticated user
    const { data, error } = await mysupabase
      .from("address")
      .delete()
      .eq("user_id", user.id)
      .eq("id", id)
      .select();

    if (error) {
      return NextResponse.json(
        { error: error.message || "Failed to delete address" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error("Server error while deleting address:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error instanceof Error ? error.message : error },
      { status: 500 }
    );
  }
}
