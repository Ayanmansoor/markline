import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { mysupabase } from "@/Supabase/SupabaseConfig";


export async function POST(req:NextRequest){
    try{
        const {message,token,point}=await req.json()

        if(!token&&!message){
            return NextResponse.json(
        { error: "Token and message are required" },
        { status: 400 }
      );
        }
        else {
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
                { error: "reCAPTCHA verification failed" },
                { status: 403 }
                );
            }

            const {data,error}=await mysupabase.from("feedback").insert({
                message:message,
                point:point,
            })



            if (error) {
                return NextResponse.json(
                { error: "Somthing wrong to insert" },
                { status: 403 }
                 );
                 }
            return NextResponse.json({ success: true }, { status: 200 }); 
        }
    }
    catch(error){
        console.log('error occur while saving')
    }

}