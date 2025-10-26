
import { NextRequest, NextResponse } from 'next/server';
import { mysupabase } from '@/Supabase/SupabaseConfig';

const SHIPROCKET_LOGIN_URL = "https://apiv2.shiprocket.in/v1/external/auth/login";
export async function generateShiprocketToken(): Promise<string> {
    const email = process.env.SHIPROCKET_API_EMAIL;
    const password = process.env.SHIPROCKET_API_PASSWORD;

    if (!email || !password) {
        throw new Error("Shiprocket credentials are not set in environment variables.");
    }

    // 1. Make POST request to Shiprocket Login API
    const response = await fetch(SHIPROCKET_LOGIN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok || !data.token || !data.expires_in) {
        console.error("Shiprocket Auth Error:", data);
        throw new Error("Failed to authenticate with Shiprocket.");
    }

    const tokenValue: string = data.token;
    const expiresInHours: number = data.expires_in / 3600;

    const expirationTime = new Date();
    expirationTime.setHours(expirationTime.getHours() + expiresInHours);

    const { error } = await mysupabase.from('shiprocket').upsert({
        token_value: tokenValue,
        expires_at: expirationTime.toISOString(),
    });

    if (error) {
        console.error("Supabase upsert error:", error);
        throw new Error("Failed to save new Shiprocket token to database.");
    }

    return tokenValue;
}

async function getValidToken(): Promise<string> {
    const { data, error } = await mysupabase
        .from('shiprocket')
        .select(`token_value, expires_at`)
        .maybeSingle();

    if (error) {
        console.error("Supabase read error:", error);
        throw new Error("Database error while reading token.");
    }

    if (data && data.token_value && data.expires_at) {
        const currentTime = new Date();
        const expirationTime = new Date(data.expires_at);

        if (currentTime < expirationTime) {
            console.log("Using cached Shiprocket token.");
            return data.token_value;
        }
    }

    console.log("Token expired or missing. Generating new Shiprocket token...");
    return await generateShiprocketToken();
}


export async function GET(req: NextRequest) {
    const order_Id = req.nextUrl.searchParams.get("order_id");

    if (!order_Id) {
        return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    try {
        const token = await getValidToken();
        const trackingUrl = `${'https://apiv2.shiprocket.in/v1/external/courier/track?order_id='}${order_Id}`;
        const shiprocketResponse = await fetch(trackingUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        const data = await shiprocketResponse.json();
        if (data.status === 401 || data.message === "Unauthenticated.") {
            return NextResponse.json({ error: 'Shiprocket authentication failed during tracking.', shiprocketError: data }, { status: 401 });
        }
        return NextResponse.json(data);
    } catch (error) {
        console.error('Shiprocket API Error:', error);
        return NextResponse.json({ error: 'Unable to fetch tracking data due to a server error.' }, { status: 500 });
    }
}