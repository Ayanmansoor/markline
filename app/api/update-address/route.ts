import { NextRequest, NextResponse } from "next/server";
import { mysupabase } from "@/Supabase/SupabaseConfig";
import { getAuthenticatedUser } from "@/lib/authHelper";

export async function POST(req: NextRequest) {
    try {
        // 1. Authenticate user from session
        const { user, error: authError } = await getAuthenticatedUser(req);
        if (authError || !user) {
            return NextResponse.json(
                { error: "Unauthorized: Please log in to update an address" },
                { status: 401 }
            );
        }

        const { 
            id,
            state_name, 
            city, 
            pin_code, 
            full_address, 
            is_selected, 
            name, 
            landmark,
            recipientName,
            recipientPhone,
            latitude,
            longitude
        } = await req.json();

        if (!id) {
            return NextResponse.json({ error: "Address ID is required" }, { status: 400 });
        }

        // 2. Prevent IDOR: Update only if id AND user_id match authenticated user
        const { data, error } = await mysupabase
            .from("address")
            .update({
                state_name,
                city_name: city,
                pincode: pin_code,
                full_address,
                is_selected,
                name,
                user_id: user.id,
                landmark,
                recipient_name: recipientName,
                recipient_phone: recipientPhone,
                latitude,
                longitude
            })
            .eq("id", id)
            .eq("user_id", user.id)
            .select();

        if (error) {
            console.error("Supabase update error:", error);
            return NextResponse.json(
                { error: error instanceof Error ? error.message : "Database Update Error" },
                { status: 400 }
            );
        }

        if (!data || data.length === 0) {
            return NextResponse.json(
                { error: "Address not found or you do not have permission to edit it" },
                { status: 403 }
            );
        }

        return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (error) {
        console.error("Internal API update error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Internal Server Error" },
            { status: 500 }
        );
    }
}
