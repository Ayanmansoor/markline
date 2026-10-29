import { NextRequest, NextResponse } from "next/server";
import { mysupabase } from "@/Supabase/SupabaseConfig";
import { getAuthenticatedUser } from "@/lib/authHelper";

export async function POST(req: NextRequest) {
    try {
        // 1. Authenticate user from session
        const { user, error: authError } = await getAuthenticatedUser(req);
        if (authError || !user) {
            return NextResponse.json(
                { error: "Unauthorized: Please log in to save an address" },
                { status: 401 }
            );
        }

        const {
            state_name,
            city,
            pin_code,
            full_address,
            isdefault,
            name,
            landmark,
            recipientName,
            recipientPhone,
            latitude,
            longitude
        } = await req.json();

        // 2. Insert address scoped to verified user.id
        const { data, error } = await mysupabase.from("address").insert({
            state_name,
            city: city,
            pin_code: pin_code,
            full_address,
            is_selected: isdefault,
            name,
            user_id: user.id,
            landmark,
            recipientName: recipientName,
            recipientPhone: recipientPhone,
            latitude,
            longitude
        }).select();

        if (error) {
            console.error("Supabase error inserting address:", error);
            return NextResponse.json(
                { error: error instanceof Error ? error.message : "Database Error" },
                { status: 400 }
            );
        }

        return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (error) {
        console.error("Internal API error in create-address:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Internal Server Error" },
            { status: 500 }
        );
    }
}