import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { mysupabase } from "@/Supabase/SupabaseConfig";
import { User } from "@supabase/supabase-js";

/**
 * Extracts and verifies the authenticated Supabase user from the request.
 * Checks both the `sb-access-token` cookie and the `Authorization: Bearer <token>` header.
 * 
 * Ensures 100% backward compatibility for legitimate user sessions
 * while blocking unauthorized access or IDOR/BOLA attacks.
 */
export async function getAuthenticatedUser(req?: Request | NextRequest): Promise<{ user: User | null; error: string | null }> {
  try {
    let token: string | undefined;

    // 1. Check Authorization header first if request is provided
    if (req) {
      const authHeader = req.headers.get("authorization") || req.headers.get("Authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7).trim();
      }
    }

    // 2. Fall back to cookie
    if (!token) {
      try {
        const cookieStore = await cookies();
        token = cookieStore.get("sb-access-token")?.value;
      } catch {
        // cookies() may throw if called outside request context
      }
    }

    if (!token) {
      return { user: null, error: "No authentication token provided" };
    }

    // 3. Verify token with Supabase Auth
    const { data, error } = await mysupabase.auth.getUser(token);
    if (error || !data?.user) {
      return { user: null, error: error?.message || "Invalid or expired authentication token" };
    }

    return { user: data.user, error: null };
  } catch (err: any) {
    return { user: null, error: err?.message || "Authentication error" };
  }
}
