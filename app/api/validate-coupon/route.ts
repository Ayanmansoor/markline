import { NextRequest, NextResponse } from "next/server";
import { mysupabase } from "@/Supabase/SupabaseConfig";

export async function POST(req: NextRequest) {
    try {
        const { code, userId, subtotal } = await req.json();

        if (!code) {
            return NextResponse.json({ valid: false, message: "Coupon code is required" }, { status: 200 });
        }

        // Fetch coupon by code (case-insensitive code matching)
        const { data: coupon, error: couponError } = await mysupabase
            .from("coupons")
            .select("*")
            .ilike("code", code.trim())
            .single();

        if (couponError || !coupon) {
            return NextResponse.json({ valid: false, message: "Invalid coupon code" }, { status: 200 });
        }

        // Check if active
        if (!coupon.is_active) {
            return NextResponse.json({ valid: false, message: "This coupon is inactive" }, { status: 200 });
        }

        // Check date validity
        const now = new Date();
        if (coupon.starts_at && new Date(coupon.starts_at) > now) {
            return NextResponse.json({ valid: false, message: "This coupon is not active yet" }, { status: 200 });
        }

        if (coupon.expires_at && new Date(coupon.expires_at) < now) {
            return NextResponse.json({ valid: false, message: "This coupon has expired" }, { status: 200 });
        }

        // Check minimum order amount
        const subtotalNum = Number(subtotal || 0);
        if (coupon.minimum_order_amount && subtotalNum < Number(coupon.minimum_order_amount)) {
            return NextResponse.json({
                valid: false,
                message: `Minimum order amount of ₹${coupon.minimum_order_amount} is required for this coupon.`
            }, { status: 200 });
        }

        // Check overall usage limit
        if (coupon.usage_limit !== null) {
            const { count, error: countError } = await mysupabase
                .from("orders")
                .select("*", { count: "exact", head: true })
                .eq("coupon_code", coupon.code)
                .neq("payment_status", "FAILED");

            if (countError) {
                console.error("Error counting overall coupon usage:", countError);
            } else if (count !== null && count >= coupon.usage_limit) {
                return NextResponse.json({ valid: false, message: "This coupon has reached its overall usage limit" }, { status: 200 });
            }
        }

        // Check per-user limit
        if (coupon.per_user_limit !== null && userId) {
            const { count: userCount, error: userCountError } = await mysupabase
                .from("orders")
                .select("*", { count: "exact", head: true })
                .eq("user_id", userId)
                .eq("coupon_code", coupon.code)
                .neq("payment_status", "FAILED");

            if (userCountError) {
                console.error("Error counting user coupon usage:", userCountError);
            } else if (userCount !== null && userCount >= coupon.per_user_limit) {
                return NextResponse.json({ valid: false, message: "You have exceeded the usage limit for this coupon" }, { status: 200 });
            }
        }

        // Calculate discount amount
        let discountAmount = 0;
        const discountVal = Number(coupon.discount_value);

        // Normalize discount_type check
        const type = coupon.discount_type ? coupon.discount_type.toUpperCase() : '';
        if (type === 'PERCENTAGE' || type === 'PERCENT') {
            discountAmount = subtotalNum * (discountVal / 100);
            if (coupon.maximum_discount_amount && discountAmount > Number(coupon.maximum_discount_amount)) {
                discountAmount = Number(coupon.maximum_discount_amount);
            }
        } else {
            // Assume fixed/flat amount
            discountAmount = discountVal;
        }

        // Discount cannot exceed subtotal
        if (discountAmount > subtotalNum) {
            discountAmount = subtotalNum;
        }

        return NextResponse.json({
            valid: true,
            discountAmount: Math.round(discountAmount),
            coupon: {
                id: coupon.id,
                coupon_id: coupon.coupon_id,
                code: coupon.code,
                title: coupon.title,
                description: coupon.description,
                discount_type: coupon.discount_type,
                discount_value: coupon.discount_value,
                maximum_discount_amount: coupon.maximum_discount_amount,
            }
        }, { status: 200 });
    } catch (error: any) {
        console.error("Error in validate-coupon API:", error);
        return NextResponse.json({ valid: false, message: "Internal server error" }, { status: 500 });
    }
}
