import { NextRequest, NextResponse } from "next/server";
import { mysupabase } from "@/Supabase/SupabaseConfig";


export async function GET(req: NextRequest) {
    try {

        const { data, error } = await mysupabase.from("product").select(`
                    *,
                    product_variants(*)
                `);


        if (error) {
            console.error("Supabase error:", error);
            return NextResponse.json(
                { valid: false, message: "Error fetching data", error: error.message },
                { status: 500 }
            );
        }



        return NextResponse.json(
            {
                valid: true,
                message: "Fetched  products successfully",
                data: data
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Unexpected error:", error);
        return NextResponse.json(
            { valid: false, message: "Internal server error", error },
            { status: 500 }
        );
    }
}

