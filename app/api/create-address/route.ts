import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { mysupabase } from "@/Supabase/SupabaseConfig";

export async function POST(req: NextRequest) {

        try {
                const { state_name, city, pin_code, full_address, is_selected, name, user_id } = await req.json()

                const { data, error } = await mysupabase.from("address").insert({
                        state_name: state_name,
                        city_name: city,
                        pincode: pin_code,
                        full_address: full_address,
                        is_selected: is_selected,
                        name: name,
                        user_id: user_id
                }).select()
                if (error) {

                        return NextResponse.json(
                                { error: error instanceof Error ? error.message : "Unknown error" },
                                { status: 400 }
                        );
                }

                return NextResponse.json({ success: true, data }, { status: 200 });
        }
        catch (error) {
                return NextResponse.json(
                        { error: error instanceof Error ? error.message : "Unknown error" },
                        { status: 400 }
                );
        }


}