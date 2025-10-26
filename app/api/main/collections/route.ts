import { NextRequest, NextResponse } from "next/server";
import { mysupabase } from "@/Supabase/SupabaseConfig";

const allowedTypes = ["ALL", "NEW", "LIMITED"];

export async function GET(req: NextRequest) {
    try {
        const searchparam = req.nextUrl.searchParams.get("type")
        console.log({ searchparam });

        if (!searchparam) {
            return NextResponse.json(
                {
                    valid: false,
                    message: "Invalid or missing 'type' parameter. Allowed values: ALL, NEW, LIMITED"
                },
                { status: 400 }
            );
        }




        const { data: collections, error } = await mysupabase
            .from("collection")
            .select("*")
            .eq("type", searchparam );

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
                data: collections
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

