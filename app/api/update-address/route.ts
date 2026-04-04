import { NextRequest, NextResponse } from "next/server";
import { mysupabase } from "@/Supabase/SupabaseConfig";

export async function POST(req: NextRequest) {
    try {
        const { 
            id,
            state_name, 
            city, 
            pin_code, 
            full_address, 
            is_selected, 
            name, 
            user_id, 
            landmark,
            recipientName,
            recipientPhone,
            latitude,
            longitude
        } = await req.json();

        if (!id) {
            return NextResponse.json({ error: "Address ID is required" }, { status: 400 });
        }

        const { data, error } = await mysupabase.from("address").update({
            state_name,
            city_name: city,
            pincode: pin_code,
            full_address,
            is_selected,
            name,
            user_id,
            landmark,
            recipient_name: recipientName,
            recipient_phone: recipientPhone,
            latitude,
            longitude
        }).eq("id", id).select();

        if (error) {
            console.error("Supabase update error:", error);
            return NextResponse.json(
                { error: error instanceof Error ? error.message : "Database Update Error" },
                { status: 400 }
            );
        }

        return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (error) {
        console.error("Internal API update error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Internal Server Error" },
            { status: 400 }
        );
    }
}
