import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const { userId, productId, selectedColorName, selectedSize, clearAll } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    // Initialize Supabase Client with Service Role Key to bypass RLS policies
    const adminSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_KEY!
    );

    if (clearAll) {
      console.log(`[Cart Delete API] Clearing entire cart for user: ${userId}`);
      const { error } = await adminSupabase
        .from("cart")
        .delete()
        .eq("user_id", userId);

      if (error) {
        console.error("[Cart Delete API] Error clearing cart:", error);
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
    } else {
      if (!productId) {
        return NextResponse.json({ error: "productId is required for item deletion" }, { status: 400 });
      }

      console.log(`[Cart Delete API] Deleting cart item for user ${userId}, product ${productId}, color ${selectedColorName}, size ${selectedSize}`);
      
      const { error } = await adminSupabase
        .from("cart")
        .delete()
        .eq("user_id", userId)
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
