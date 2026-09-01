import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const { data: addresses, error } = await supabase
      .from("address")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching user addresses:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ addresses: addresses || [] });
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
