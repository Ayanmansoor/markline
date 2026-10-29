import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getAuthenticatedUser } from "@/lib/authHelper";

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate user from session
    const { user, error: authError } = await getAuthenticatedUser(req);
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized: Please log in" }, { status: 401 });
    }

    const { userId, productId, selectedColorName, selectedSize, clearAll } = await req.json();

    // 2. Prevent IDOR: Ensure caller can only manipulate their own cart
    if (userId && userId !== user.id) {
      return NextResponse.json({ error: "Forbidden: You cannot modify another user's cart" }, { status: 403 });
    }

    const targetUserId = user.id;

    // Initialize Supabase Client
    const adminSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_KEY!
    );

    if (clearAll) {
      console.log(`[Cart Delete API] Clearing entire cart for user: ${targetUserId}`);
      const { error } = await adminSupabase
        .from("cart")
        .delete()
        .eq("user_id", targetUserId);

      if (error) {
        console.error("[Cart Delete API] Error clearing cart:", error);
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
    } else {
      if (!productId) {
        return NextResponse.json({ error: "productId is required for item deletion" }, { status: 400 });
      }

      console.log(`[Cart Delete API] Deleting cart item for user ${targetUserId}, product ${productId}, color ${selectedColorName}, size ${selectedSize}`);
      
      const { error } = await adminSupabase
        .from("cart")
        .delete()
        .eq("user_id", targetUserId)
        .eq("product_id", productId)
        .eq("selected_color_name", selectedColorName || "")
        .eq("selected_size", selectedSize || "");

      if (error) {
        console.error("[Cart Delete API] Error deleting cart item:", error);
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
    }

    return NextResponse.json({ success: true, message: "Cart updated successfully in database" }, { status: 200 });
  } catch (error: any) {
    console.error("[Cart Delete API] Internal server error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
