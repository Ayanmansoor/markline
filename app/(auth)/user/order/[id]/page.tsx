'use client'
import React, { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useQuery } from "react-query"
import { mysupabase } from "@/Supabase/SupabaseConfig"
import { getAllTrendingProducts, getCurrentUserSingleOrder } from "@/Supabase/SupabaseApi"
import { OrderStatus } from "@/components/Order/OrderStatus"
import { ShipmentTrackingCard } from "@/components/Order/ShipmentTrackingCard"
import { OrderProductRow } from "@/components/Order/OrderProductRow"
import { CancelOrderModal } from "@/components/Order/CancelOrderModal"
import OrderDetails from "@/components/Common/OrderDetailsinvioce"
import CategoriesSection from "@/components/Common/CategoriesSection"
import ProductCard from "@/components/Common/ProductCard"
import { MapPin, CreditCard, Calendar, Hash, Tag, FileText, ArrowLeft, ShieldCheck, Phone, PackageCheck, Truck, XCircle } from "lucide-react"
import Link from "next/link"

function formatDate(isoString: string) {
    if (!isoString) return ""
    return new Date(isoString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    })
}

function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount || 0);
}

export default function OrderPage() {
    const { id } = useParams()
    const router = useRouter()
    const orderid = Array.isArray(id) ? id[0] : id

    const [orderRecord, setOrderRecord] = useState<any>(null)
    const [legacyOrders, setLegacyOrders] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
    const [refetchIndex, setRefetchIndex] = useState(0)

    useEffect(() => {
        async function fetchOrder() {
            setLoading(true)
            try {
                const { data: { user } } = await mysupabase.auth.getUser()
                if (user && orderid) {
                    const result: any = await getCurrentUserSingleOrder(user.id, orderid)
                    if (result?.order) {
                        setOrderRecord(result.order)
                    } else if (result?.orders && result.orders.length > 0) {
                        setOrderRecord(result.orders[0])
                        setLegacyOrders(result.orders)
                    } else {
                        setError("Order details not found")
                    }
                }
            } catch (err) {
                console.error("Error fetching order:", err)
                setError("Failed to load order details")
            } finally {
                setLoading(false)
            }
        }
        fetchOrder()
    }, [orderid, refetchIndex])

    const { data: trending = [] } = useQuery({
        queryKey: ["trendingproducts"],
        queryFn: getAllTrendingProducts,
        staleTime: Infinity,
    })

    if (loading) {
        return (
            <section className='w-full bg-white flex items-center justify-center h-[80vh]'>
                <div className='flex flex-col items-center animate-pulse gap-3'>
                    <h2 className='text-5xl italic text-black font-extrabold tracking-tight uppercase'>Markline</h2>
                    <p className='text-xs font-semibold text-gray-400 tracking-wider'>Loading order details...</p>
                </div>
            </section>
        )
    }

    if (error || !orderRecord) {
        return (
            <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-5 px-6">
                <h3 className="text-xl font-bold text-gray-900">Order Not Found</h3>
                <p className="text-xs text-gray-500 font-medium">{error || "The requested order ID does not exist in your account history."}</p>
                <Link href="/user">
                    <button className="px-6 py-2.5 bg-black text-white rounded-xl text-xs font-bold hover:bg-gray-800 transition-colors shadow-sm">
                        Back to My Orders
                    </button>
                </Link>
            </div>
        )
    }

    // Determine list of order items
    const itemsList: any[] = orderRecord.order_items && orderRecord.order_items.length > 0
        ? orderRecord.order_items
        : (legacyOrders.length > 0 ? legacyOrders : [orderRecord]);

    const address = orderRecord.address || orderRecord.address_id;
    const shortId = orderid ? (orderid.length > 8 ? orderid.slice(0, 8).toUpperCase() : orderid.toUpperCase()) : '';

    // Calculate financial figures
    const subtotal = orderRecord.subtotal
        ? Number(orderRecord.subtotal)
        : itemsList.reduce((acc: number, item: any) => acc + (Number(item.unit_price || item.final_price || 0) * (item.quantity || 1)), 0);

    const discountAmount = Number(orderRecord.discount_amount || 0);
    const shippingCharge = Number(orderRecord.shipping_charge || 0);
    const taxAmount = Number(orderRecord.tax_amount || 0);
    const grandTotal = orderRecord.grand_total
        ? Number(orderRecord.grand_total)
        : (subtotal - discountAmount + shippingCharge + taxAmount);

    const paymentStatus = (orderRecord.payment_status || 'PAID').toString();
    const fulfillmentStatus = (orderRecord.fulfillment_status || orderRecord.isDelivered || 'Pending').toString();
    const paymentMethod = orderRecord.payment_method || 'Online Payment';

    const shipmentStatus = (orderRecord.shipments?.[0]?.shipment_status || fulfillmentStatus).toString();
    const isPickedUpOrLater = [
        'picked up',
        'in transit',
        'reached destination hub',
        'out for delivery',
        'delivered',
        'returned to warehouse',
        'rto',
        'cancelled',
        'lost',
        'damaged'
    ].includes(shipmentStatus.toLowerCase());

    const isCancelled = fulfillmentStatus.toUpperCase() === 'CANCELLED' || shipmentStatus.toLowerCase() === 'cancelled';
    const canCancel = !isPickedUpOrLater && !isCancelled;

    const trendingList = Array.isArray(trending) ? trending : []

    return (
        <div className="bg-white min-h-screen">
            {/* Top Navigation Bar */}
            <div className="border-b border-gray-100 bg-gray-50/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
                    <Link href="/user" className="inline-flex items-center gap-2 text-xs font-bold text-gray-700 hover:text-black transition-colors">
                        <ArrowLeft size={16} />
                        <span>Back to My Orders</span>
                    </Link>
                </div>
            </div>

            {/* Header Area */}
            <div className="border-b border-gray-100 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8  flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3 flex-wrap">
                            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
                                Order Details
                            </h1>
                            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${fulfillmentStatus.toUpperCase() === 'DELIVERED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                fulfillmentStatus.toUpperCase() === 'SHIPPED' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                    fulfillmentStatus.toUpperCase() === 'CANCELLED' ? 'bg-red-50 text-red-700 border-red-200' :
                                        'bg-amber-50 text-amber-700 border-amber-200'
                                }`}>
                                Status: {fulfillmentStatus}
                            </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-5 text-xs text-gray-500 font-medium pt-1">
                            <div className="flex items-center gap-1.5">
                                <Tag size={14} className="text-gray-400" />
                                <span className="font-semibold text-gray-900">#Ord-{shortId}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Calendar size={14} className="text-gray-400" />
                                <span>{formatDate(orderRecord.created_at)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                        {canCancel && (
                            <button
                                onClick={() => setIsCancelModalOpen(true)}
                                className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 active:scale-95"
                            >
                                <XCircle size={15} />
                                <span>Cancel Order</span>
                            </button>
                        )}

                        <OrderDetails order={{
                            ...orderRecord,
                            order_items: itemsList,
                            grand_total: grandTotal,
                            subtotal: subtotal,
                            discount_amount: discountAmount
                        }} />
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 ">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10">

                    {/* Left Column: Tracking & Products */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Live Courier Tracking & AWB Card */}
                        <ShipmentTrackingCard shipments={orderRecord.shipments} />

                        {/* Order Stepper Progress */}
                        <section className="bg-white border border-gray-200 rounded-2xl p-5 md:p-7 shadow-xs">
                            <OrderStatus
                                status={orderRecord.isDelivered}
                                fulfillment_status={orderRecord.shipments?.[0]?.shipment_status || orderRecord.fulfillment_status}
                                payment_status={orderRecord.payment_status}
                                return_status={orderRecord.return_status}
                                cancel_reason={orderRecord.cancel_reason && orderRecord.cancel_reason !== "Customer / Admin Cancelled" ? orderRecord.cancel_reason : (orderRecord.customer_note || orderRecord.cancellation_reason || orderRecord.cancel_reason)}
                                created_at={orderRecord.created_at}
                                updated_at={orderRecord.updated_at}
                            />
                        </section>

                        {/* Order Items Section */}
                        <section className="bg-white border border-gray-200 rounded-2xl p-5 md:p-7 shadow-xs space-y-4">
                            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                                <h3 className="text-base font-bold text-gray-900 tracking-tight flex items-center gap-2">
                                    <PackageCheck size={18} className="text-black" />
                                    Order Items ({itemsList.length})
                                </h3>
                            </div>

                            <div className="divide-y divide-gray-100">
                                {itemsList.map((item: any, idx: number) => (
                                    <OrderProductRow key={item.id || idx} item={item} />
                                ))}
                            </div>
                        </section>

                        {/* Order Notes (if present) */}
                        {(orderRecord.customer_note || orderRecord.admin_note) && (
                            <section className="bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-3">
                                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                                    Order Notes
                                </h3>
                                {orderRecord.customer_note && (
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-[11px] font-bold text-gray-500">Customer Request:</span>
                                        <p className="text-xs text-gray-800 font-medium leading-relaxed">{orderRecord.customer_note}</p>
                                    </div>
                                )}
                                {orderRecord.admin_note && (
                                    <div className="flex flex-col gap-0.5 border-t border-gray-200 pt-2">
                                        <span className="text-[11px] font-bold text-gray-500">Store Note:</span>
                                        <p className="text-xs text-gray-800 font-medium leading-relaxed">{orderRecord.admin_note}</p>
                                    </div>
                                )}
                            </section>
                        )}
                    </div>

                    {/* Right Column: Address & Payment Summary */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Delivery Address Card */}
                        <section className="bg-slate-900 text-white p-6 rounded-2xl shadow-md border border-slate-800 space-y-4">
                            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                                <MapPin size={18} className="text-amber-400 shrink-0" />
                                <h3 className="text-sm font-bold tracking-tight text-white">
                                    Shipping Address
                                </h3>
                            </div>

                            <div className="space-y-3 text-xs">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Recipient</span>
                                    <span className="text-sm font-bold text-white mt-0.5">
                                        {address?.name || address?.full_name || address?.recipientName || 'Valued Customer'}
                                    </span>
                                </div>

                                {(address?.phone_number || address?.phone || address?.recipientPhone) && (
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Phone Number</span>
                                        <span className="font-semibold text-slate-200 mt-0.5">
                                            {address.phone_number || address.phone || address.recipientPhone}
                                        </span>
                                    </div>
                                )}

                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Full Address</span>
                                    <p className="font-medium text-slate-300 leading-relaxed mt-0.5">
                                        {address?.full_address || address?.address || [address?.street, address?.landmark, address?.city, address?.state_name || address?.state, address?.pin_code || address?.pincode].filter(Boolean).join(', ') || 'Saved Delivery Address'}
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Payment & Financial Summary Card */}
                        <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-4">
                            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                                <div className="flex items-center gap-2">
                                    <CreditCard size={18} className="text-black" />
                                    <h3 className="text-sm font-bold text-gray-900 tracking-tight">
                                        Payment Details
                                    </h3>
                                </div>
                                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${paymentStatus.toUpperCase() === 'PAID' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                                    }`}>
                                    {paymentStatus}
                                </span>
                            </div>

                            <div className="space-y-3 pt-1 text-xs">
                                <div className="flex justify-between items-center text-gray-600">
                                    <span className="font-medium">Payment Method</span>
                                    <span className="font-bold text-gray-900">{paymentMethod}</span>
                                </div>

                                <div className="flex justify-between items-center text-gray-600">
                                    <span className="font-medium">Items Subtotal</span>
                                    <span className="font-bold text-gray-900">{formatCurrency(subtotal)}</span>
                                </div>

                                {discountAmount > 0 && (
                                    <div className="flex justify-between items-center text-emerald-700 font-medium">
                                        <span>Discount {orderRecord.coupon_code ? `(${orderRecord.coupon_code})` : ''}</span>
                                        <span className="font-bold">-{formatCurrency(discountAmount)}</span>
                                    </div>
                                )}

                                <div className="flex justify-between items-center text-gray-600">
                                    <span className="font-medium">Delivery Charge</span>
                                    <span className="font-bold text-emerald-700">
                                        {shippingCharge > 0 ? formatCurrency(shippingCharge) : 'Free Delivery'}
                                    </span>
                                </div>

                                {taxAmount > 0 && (
                                    <div className="flex justify-between items-center text-gray-600">
                                        <span className="font-medium">Estimated Tax</span>
                                        <span className="font-bold text-gray-900">{formatCurrency(taxAmount)}</span>
                                    </div>
                                )}

                                <div className="flex justify-between items-center pt-3 border-t border-gray-100 text-sm">
                                    <span className="font-bold text-gray-900">Grand Total</span>
                                    <span className="text-lg font-black text-gray-900">{formatCurrency(grandTotal)}</span>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>

            {/* Trending Products Carousel Section */}
            {trendingList.length > 0 && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 border-t border-gray-100">
                    <CategoriesSection title={"You May Also Like"} url='' >
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-6">
                            {trendingList.slice(0, 4).map((product: any, index: number) => (
                                <ProductCard
                                    url='product'
                                    key={index}
                                    product={product.product}
                                    className="h-[300px] md:h-[400px] border border-gray-100 rounded-xl overflow-hidden"
                                />
                            ))}
                        </div>
                    </CategoriesSection>
                </div>
            )}

            {/* Cancel Order Modal */}
            {canCancel && (
                <CancelOrderModal
                    isOpen={isCancelModalOpen}
                    onClose={() => setIsCancelModalOpen(false)}
                    orderId={orderRecord.id || orderid}
                    userEmail={address?.email || orderRecord?.email || orderRecord?.customer_email || orderRecord?.user_email}
                    userName={address?.full_name || address?.recipientName || address?.recipient_name || (address?.name && !['Home', 'Office', 'Work'].includes(address.name) ? address.name : undefined) || orderRecord?.customer_name}
                    onSuccess={() => setRefetchIndex(prev => prev + 1)}
                />
            )}
        </div>
    )
}

