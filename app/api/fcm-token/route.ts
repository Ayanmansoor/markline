import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { mysupabase } from "@/Supabase/SupabaseConfig";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fcm_token, device_id, device_type, user_id, action = "register" } = body;

    if (!fcm_token) {
      return NextResponse.json(
        { error: "fcm_token is required" },
        { status: 400 }
      );
    }

    if (action === "unregister") {
      // Remove token registration or decouple user ID
      const { error } = await mysupabase
        .from("fcms")
        .delete()
        .eq("fcm_token", fcm_token);

      if (error) {
        console.error("[FCM API: Unregister] Supabase error:", error.message);
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json({ success: true, message: "Token unregistered successfully" });
    }

    // Attempt to resolve user_id from cookies if not provided
    let finalUserId = user_id || null;
    try {
      const cookieStore = cookies();
      const access_token = (await cookieStore).get("sb-access-token")?.value;
      if (access_token && !finalUserId) {
        const { data: authUser, error: authError } = await mysupabase.auth.getUser(access_token);
        if (!authError && authUser?.user) {
          finalUserId = authUser.user.id;
        }
      }
    } catch (cookieErr) {
      console.warn("[FCM API] Auth cookie retrieval warning:", cookieErr);
    }

    // Upsert the token record
    const payload = {
      fcm_token,
      user_id: finalUserId,
      device_id: device_id || null,
      device_type: device_type || "web",
      updated_at: new Date().toISOString()
    };

    console.log("[FCM API: Register] Upserting payload:", payload);

    const { data, error } = await mysupabase
      .from("fcms")
      .upsert(payload, { onConflict: "fcm_token" })
      .select();

    if (error) {
      console.error("[FCM API: Register] Supabase error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "Token registered/updated successfully",
      data
    });
  } catch (err: any) {
    console.error("[FCM API] Server error:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
