import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { mysupabase } from "@/Supabase/SupabaseConfig";
import { BulkOrderProductProps } from "@/types/interfaces";


export async function POST(req:NextRequest,res:NextResponse) {
    try{

        const {products,recaptchaToken}:{ products: BulkOrderProductProps[]; recaptchaToken: string } =await req.json()


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
                        { error: "reCAPTCHA verification failed", details: verifyResult['error-codes'] },
                        { status: 403 }
                        );
                    }

        const {data,error}=await mysupabase.from("orders").insert([...products]).select('* , products(name)')         

        
                    
        if(error){
                return NextResponse.json(
                        { error: error.message || "Something went wrong inserting the email" },
                        { status: 403 }
                );
            }

        return NextResponse.json({ success: true , data:data }, { status: 200 });
    }
    catch(error){
            return NextResponse.json({ error: error || "server error " },{ status: 500 });
    }
}