import { cookies } from "next/headers";
import { mysupabase } from "@/Supabase/SupabaseConfig";
import { AddressProps } from "@/types/interfaces";

/**
 * Server-side prefetch for user addresses.
 * Reads the `sb-access-token` auth cookie on the server, verifies the user,
 * and fetches saved addresses directly from Supabase with 0ms client latency.
 */
export async function getServerUserAddresses(): Promise<AddressProps[]> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("sb-access-token")?.value;

    if (!token) {
      return [];
    }

    // Authenticate user on server using token
    const { data, error: userError } = await mysupabase.auth.getUser(token);
    if (userError || !data?.user?.id) {
      return [];
    }

    // Fetch user addresses server-side
    const { data: addresses, error: addressError } = await mysupabase
      .from("address")
      .select("*")
      .eq("user_id", data.user.id)
      .order("created_at", { ascending: false });

    if (addressError) {
      console.error("[getServerUserAddresses] Error querying addresses:", addressError.message);
      return [];
    }

    return (addresses as AddressProps[]) || [];
  } catch (err: any) {
    if (err?.digest === "DYNAMIC_SERVER_USAGE" || err?.message?.includes("Dynamic server usage")) {
      throw err;
    }
    console.error("[getServerUserAddresses] Unexpected error during server fetch:", err);
    return [];
  }
}
