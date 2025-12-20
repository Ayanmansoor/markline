import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { mysupabase } from "@/Supabase/SupabaseConfig";


export async function GET(req: Request) {
    try {
        const cookieStore = cookies();
        const access_token = (await cookieStore).get("sb-access-token")?.value;

        if (!access_token) {
            return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
        }

        // Get user from Supabase using the access token
        const { data: user, error: userError } = await mysupabase.auth.getUser(access_token);
        const userenw = user?.user;
        if (userError || !userenw) {
            return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
        }

        // Fetch user addresses
        const { data: addresses, error } = await mysupabase
            .from("address")
            .select("*")
            .eq("user_id", userenw?.id);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json(addresses);
    } catch (err) {
        console.error("API Error:", err);

        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
