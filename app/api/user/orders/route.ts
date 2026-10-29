import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getAuthenticatedUser } from "@/lib/authHelper";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    // 1. Authenticate user from session cookie or Bearer token
    const { user, error: authError } = await getAuthenticatedUser(req);
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized: Please log in to view your orders" }, { status: 401 });
    }

    const requestedUserId = req.nextUrl.searchParams.get("userId");

    // 2. Prevent IDOR: Ensure caller can only access their own orders
    if (requestedUserId && requestedUserId !== user.id) {
      return NextResponse.json({ error: "Forbidden: You can only view your own orders" }, { status: 403 });
    }

    const targetUserId = user.id;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: "Supabase credentials missing" }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: orders, error } = await supabase
      .from("orders")
      .select(`
        *,
        address:address_id(*),
        order_items(
          *,
          product:product_id(id, name, slug),
          variant:variant_id(id, image_url)
        )
      `)
      .eq("user_id", targetUserId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching user orders:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ orders: orders || [] });
  } catch (err) {
    console.error("API Error in /api/user/orders:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
