import { NextRequest, NextResponse } from 'next/server';
import { mysupabase } from '@/Supabase/SupabaseConfig';

const SHIPROCKET_SERVICEABILITY_URL = "https://apiv2.shiprocket.in/v1/external/courier/serviceability/";
const DEFAULT_PICKUP_PINCODE = process.env.SHIPROCKET_PICKUP_PINCODE || "110001";

// 1. In-Memory Server Cache (Optimized for Vercel warm serverless executions)
let cachedTokenInMemory: { value: string; expiresAt: number } | null = null;

/**
 * Fetches an active (non-expired) Shiprocket Bearer Token.
 * - Checks warm Serverless RAM first (0ms, 0 Database queries).
 * - Checks Supabase 'shiprocket_token' table if RAM is empty.
 * - Fallback to 'shiprocket' table.
 */
async function getValidShiprocketToken(): Promise<string | null> {
  // Check warm Serverless RAM cache first
  if (cachedTokenInMemory && Date.now() < cachedTokenInMemory.expiresAt) {
    return cachedTokenInMemory.value;
  }

  try {
    const now = new Date().toISOString();

    // 1. Check shiprocket_token table in Supabase
    const { data: tokenData, error: tokenError } = await mysupabase
      .from('shiprocket_token')
      .select('token_value, expires_at')
      .gte('expires_at', now)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!tokenError && tokenData?.token_value) {
      const expMs = tokenData.expires_at ? new Date(tokenData.expires_at).getTime() - 60000 : Date.now() + 3600000;
      cachedTokenInMemory = {
        value: tokenData.token_value,
        expiresAt: expMs,
      };
      return tokenData.token_value;
    }

    // 2. Fallback to legacy shiprocket table if shiprocket_token is unpopulated
    const { data: legacyData, error: legacyError } = await mysupabase
      .from('shiprocket')
      .select('token_value, expires_at')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!legacyError && legacyData?.token_value) {
      const expDate = legacyData.expires_at ? new Date(legacyData.expires_at) : null;
      if (!expDate || expDate > new Date()) {
        cachedTokenInMemory = {
          value: legacyData.token_value,
          expiresAt: expDate ? expDate.getTime() - 60000 : Date.now() + 3600000,
        };
        return legacyData.token_value;
      }
    }

    return null;
  } catch (err) {
    console.error("Error reading Shiprocket token from database:", err);
    return null;
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const delivery_postcode = searchParams.get("delivery_postcode") || searchParams.get("pincode");
  const pickup_postcode = searchParams.get("pickup_postcode") || DEFAULT_PICKUP_PINCODE;
  const weight = searchParams.get("weight") || "0.5";
  const cod = searchParams.get("cod") || "1";

  if (!delivery_postcode || delivery_postcode.trim().length !== 6) {
    return NextResponse.json(
      { success: false, error: 'A valid 6-digit delivery pincode is required.' },
      { status: 400 }
    );
  }

  try {
    const token = await getValidShiprocketToken();

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No active Shiprocket token found.' },
        { status: 401 }
      );
    }

    const apiUrl = `${SHIPROCKET_SERVICEABILITY_URL}?pickup_postcode=${pickup_postcode}&delivery_postcode=${delivery_postcode.trim()}&weight=${weight}&cod=${cod}`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });

    const data = await response.json();

    if (!response.ok || data.status !== 200 || !data.data) {
      return NextResponse.json({
        success: false,
        message: data.message || 'Location not serviceable via Shiprocket.',
        raw: data
      }, { status: 200 });
    }

    const couriers: any[] = data.data.available_courier_companies || [];
    const isServiceable = couriers.length > 0;

    if (!isServiceable) {
      return NextResponse.json({
        success: false,
        message: 'No available couriers for this pincode.',
        raw: data
      });
    }

    // Find courier with earliest estimated delivery (etd or min estimated_delivery_days)
    const validCouriers = couriers.filter((c: any) => c.etd || c.estimated_delivery_days);
    const primaryCourier = validCouriers.length > 0 ? validCouriers[0] : couriers[0];

    const city = primaryCourier.city || '';
    const state = primaryCourier.state || '';
    const codAvailable = couriers.some((c: any) => Number(c.cod) === 1);
    const minDays = Math.min(...couriers.map((c: any) => Number(c.estimated_delivery_days) || 5));
    const etd = primaryCourier.etd || null;

    return NextResponse.json({
      success: true,
      serviceable: true,
      city,
      state,
      pincode: delivery_postcode.trim(),
      estimated_delivery_days: minDays !== Infinity ? minDays : 4,
      etd: etd,
      cod_available: codAvailable,
      couriers_count: couriers.length,
      raw: data
    });

  } catch (error: any) {
    console.error('Shiprocket Serviceability Error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error while checking serviceability.' },
      { status: 500 }
    );
  }
}
