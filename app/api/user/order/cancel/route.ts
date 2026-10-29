import { NextRequest, NextResponse } from "next/server";
import { after } from "next/server";
import axios from "axios";
import { mysupabase } from "@/Supabase/SupabaseConfig";
import { sendCancellationEmails } from "@/lib/email";
import { getAuthenticatedUser } from "@/lib/authHelper";

const CMS_API_BASE_URL = process.env.CMS_API_BASE_URL || process.env.NEXT_PUBLIC_CMS_API_BASE_URL || 'http://192.168.0.107:3000';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { orderId, reason, userEmail: bodyEmail, userName: bodyName, userPhone: bodyPhone, grandTotal: bodyTotal } = body;

        if (!orderId) {
            return NextResponse.json(
                { success: false, error: "Order ID is required" },
                { status: 400 }
            );
        }

        // 1. Authenticate user from session cookie or Authorization header
        const { user, error: authError } = await getAuthenticatedUser(req);
        if (authError || !user) {
            return NextResponse.json(
                { success: false, error: "Unauthorized: Please log in to cancel an order" },
                { status: 401 }
            );
        }

        // 2. Prevent IDOR: Verify that the caller actually owns this order
        const { data: orderRecord, error: orderCheckErr } = await mysupabase
            .from("orders")
            .select("id, user_id, fulfillment_status")
            .eq("id", orderId)
            .maybeSingle();

        if (orderCheckErr || !orderRecord) {
            return NextResponse.json(
                { success: false, error: "Order not found" },
                { status: 404 }
            );
        }

        if (orderRecord.user_id && orderRecord.user_id !== user.id) {
            return NextResponse.json(
                { success: false, error: "Forbidden: You do not have permission to cancel this order" },
                { status: 403 }
            );
        }

        if (orderRecord.fulfillment_status === "CANCELLED") {
            return NextResponse.json(
                { success: true, message: "Order is already cancelled" },
                { status: 200 }
            );
        }

        const authHeader = req.headers.get("authorization");
        const cancelReasonText = reason || body.cancel_reason || body.cancellation_reason || body.cancelReason || "Cancelled by customer";
        const targetUrl = `${CMS_API_BASE_URL}/api/orders/${orderId}/cancel`;

        console.log(`[Cancel Order Proxy] Forwarding reason "${cancelReasonText}" to CMS API: ${targetUrl}`);

        const payload = {
            orderId,
            reason: cancelReasonText,
            cancel_reason: cancelReasonText,
            cancellation_reason: cancelReasonText,
            cancelReason: cancelReasonText,
            cancellationReason: cancelReasonText,
            remarks: cancelReasonText,
            note: cancelReasonText,
            customer_note: cancelReasonText,
        };

        let cmsResponse: any = null;
        try {
            cmsResponse = await axios.post(
                targetUrl,
                payload,
                {
                    headers: {
                        "Content-Type": "application/json",
                        ...(authHeader ? { Authorization: authHeader } : {}),
                    },
                    timeout: 8000,
                }
            );
        } catch (postErr: any) {
            if (postErr?.response?.status === 405) {
                console.log(`[Cancel Order Proxy] POST returned 405, retrying with PUT to ${targetUrl}`);
                cmsResponse = await axios.put(
                    targetUrl,
                    payload,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            ...(authHeader ? { Authorization: authHeader } : {}),
                        },
                        timeout: 8000,
                    }
                );
            } else {
                throw postErr;
            }
        }

        const responseData = cmsResponse.data || {};
        const successMessage = responseData.message || responseData.msg || responseData.status || "Order cancelled successfully";

        // Direct update to Supabase orders table to persist exact customer cancellation reason
        try {
            await mysupabase
                .from("orders")
                .update({
                    cancel_reason: cancelReasonText,
                    cancellation_reason: cancelReasonText,
                    customer_note: cancelReasonText,
                    fulfillment_status: "CANCELLED"
                })
                .eq("id", orderId);
        } catch (dbUpdateErr) {
            console.warn("[Cancel Order Proxy] Error updating order cancel_reason in Supabase:", dbUpdateErr);
        }

        // Dispatch email notifications in background using Next.js after()
        after(async () => {
            try {
                // Extract user email & details passed directly from the client form
                let email = bodyEmail || responseData.email || responseData.order?.email || responseData.order?.customer_email;
                let name = bodyName || responseData.userName || responseData.name || responseData.order?.customer_name;
                let phone = bodyPhone || responseData.phone || responseData.order?.phone;
                let grandTotal = bodyTotal || responseData.grandTotal || responseData.order?.grand_total;

                // Fallback query to Supabase if email is missing or name is an address label ("Home"/"Office")
                if ((!email || !name || name === "Home" || name === "Office" || name === "Work") && orderId) {
                    try {
                        const { data: fullOrder } = await mysupabase
                            .from("orders")
                            .select("*, address:address_id(*)")
                            .eq("id", orderId)
                            .maybeSingle();

                        if (fullOrder) {
                            const addr = fullOrder.address;
                            email = email || addr?.email || fullOrder.email || fullOrder.customer_email || fullOrder.user_email;
                            const realName = addr?.full_name || addr?.recipientName || addr?.recipient_name || fullOrder.customer_name;
                            if (!name || name === "Home" || name === "Office" || name === "Work") {
                                name = realName || "Valued Customer";
                            }
                            phone = phone || addr?.phone_number || addr?.phone || addr?.recipientPhone;
                            grandTotal = grandTotal || fullOrder.grand_total || fullOrder.total_amount;
                        }
                    } catch (dbErr) {
                        console.warn("[Background Email Fallback Error]:", dbErr);
                    }
                }

                name = name || "Valued Customer";

                if (email) {
                    console.log(`[Background Email] Sending cancellation emails for order #${orderId} to user: ${email}, admin: ${process.env.ADMIN_EMAIL || 'N/A'}`);
                } else {
                    console.warn(`[Background Email] No user email found for order #${orderId}. Skipping customer cancellation email.`);
                }

                await sendCancellationEmails({
                    orderId,
                    reason: cancelReasonText,
                    userEmail: email || undefined,
                    userName: name,
                    userPhone: phone || "N/A",
                    grandTotal,
                });
            } catch (bgEmailErr: any) {
                console.error("[Background Email Task Error]:", bgEmailErr?.message || bgEmailErr);
            }
        });

        return NextResponse.json({
            success: true,
            message: successMessage,
            data: responseData,
            orderId,
        });

    } catch (error: any) {
        console.error("[Cancel Order Proxy Error]:", error?.response?.data || error?.message || error);

        const status = error?.response?.status || 500;
        const errData = error?.response?.data;
        const errorMessage = errData?.error || errData?.message || errData?.msg || error?.message || "Failed to cancel order via CMS API";

        return NextResponse.json(
            { success: false, error: errorMessage },
            { status }
        );
    }
}

export async function PUT(req: NextRequest) {
    return POST(req);
}
