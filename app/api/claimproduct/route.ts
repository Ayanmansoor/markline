import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { mysupabase } from "@/Supabase/SupabaseConfig";

export async function POST(req:NextRequest) {
    try{

        const {token,name,email,orderID,productname,discription}=await req.json()

        if(!token){
            return NextResponse.json(   
                 { error: "reCAPTCHA verification failed" },
                { status: 403 }
                )
        }


        else{

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

            const {data,error}=await mysupabase.from("claim-products").insert({
                name:name,
                email:email,
                orderID:orderID,
                productname:productname,
                discription:discription
            })
            if(error){
                return NextResponse.json({
                    error:"something went wrong"
                },{
                    status:400
                })
            }
            
            return NextResponse.json({ success: true, data }, { status: 200 });
            
        }



    }
    catch(error){
        console.log("error occurr saving")
    }
}