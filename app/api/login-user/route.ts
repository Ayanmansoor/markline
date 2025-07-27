import { mysupabase } from "@/Supabase/SupabaseConfig";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'



export async function POST(req: NextRequest) {
  const { email, token } = await req.json();

  if (!email || !token) {
    return NextResponse.json({ error: "Email or Token is missing" }, { status: 400 });
  }

  const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
  const verifyResponse = await axios.post(
    "https://www.google.com/recaptcha/api/siteverify",
    new URLSearchParams({
      secret: recaptchaSecret!,
      response: token,
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

    const { error } = await mysupabase.auth.signInWithOtp({
            email,
            options: {
               emailRedirectTo: `${req.headers.get("origin")}/auth/callback`
            }
    })

   if (error) {
    return NextResponse.json(
      { error: error.message || "Something went wrong to send link" },
      { status: error.status }
    );
  } else {
    return NextResponse.json({ success: true }, { status: 200 });
  }
}
