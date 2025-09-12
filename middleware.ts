import { NextResponse } from "next/server";
import { mysupabase } from "./Supabase/SupabaseConfig";

export async function middleware(req) {
  const {
    data: { user },
    error,
  } = await mysupabase.auth.getUser();

  if (error || !user || !user.email) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/user"],
};
