import { NextRequest, NextResponse } from "next/server";
import { mysupabase } from "@/Supabase/SupabaseConfig";
import { getAuthenticatedUser } from "@/lib/authHelper";

export async function POST(req: NextRequest) {
    try {
        // 1. Authenticate user from session
        const { user, error: authError } = await getAuthenticatedUser(req);
        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized: Please log in" }, { status: 401 });
        }

        const {
            userId,
            variantId,
            productId,
            selectedColorName,
            selectedSize,
            quantity
        } = await req.json();

        if (!productId || quantity === undefined) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // 2. Prevent IDOR: Ensure caller only modifies their own cart
        if (userId && userId !== user.id) {
            return NextResponse.json({ error: "Forbidden: You cannot modify another user's cart" }, { status: 403 });
        }

        const targetUserId = user.id;

        // Prepare the query building scoped to authenticated user
        let query = mysupabase
            .from("cart")
            .update({
                quantity,
                updated_at: new Date().toISOString()
            })
            .eq("user_id", targetUserId)
            .eq("product_id", productId);

        if (variantId) {
            query = query.eq("variant_id", variantId);
        }
        if (selectedColorName) {
            query = query.eq("selected_color_name", selectedColorName);
        }
        if (selectedSize) {
            query = query.eq("selected_size", selectedSize);
        }

        const { data, error } = await query.select();

        if (error) {
            console.error("Supabase cart update error:", error);
            return NextResponse.json(
                { error: error.message || "Failed to update quantity in database" },
                { status: 400 }
            );
        }

        return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (error: any) {
        console.error("Internal API error in update-cart-quantity:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Internal Server Error" },
            { status: 500 }
        );
    }
}
