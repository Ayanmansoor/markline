'use client'
import React, { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useQuery } from "react-query"
import { mysupabase } from "@/Supabase/SupabaseConfig"
import { getAllTrendingProducts, getCurrentUserSingleOrder } from "@/Supabase/SupabaseApi"
import { OrderStatus } from "@/components/Order/OrderStatus"
import { OrderProductRow } from "@/components/Order/OrderProductRow"
import OrderDetails from "@/components/Common/OrderDetailsinvioce"
import CategoriesSection from "@/components/Common/CategoriesSection"
import ProductCard from "@/components/Common/ProductCard"
import { MapPin, CreditCard, Calendar, Hash, Tag, FileText, ArrowLeft, ShieldCheck, Phone } from "lucide-react"
import Link from "next/link"

function formatDate(isoString: string) {
    if (!isoString) return ""
    return new Date(isoString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
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
                        setError("Order manifest not found")
                    }
                }
            } catch (err) {
                console.error("Error fetching order:", err)
                setError("Failed to load order manifest")
            } finally {
                setLoading(false)
            }
        }
        fetchOrder()
    }, [orderid])

    const { data: trending = [] } = useQuery({
        queryKey: ["trendingproducts"],
        queryFn: getAllTrendingProducts,
        staleTime: Infinity,
    })

    if (loading) {
        return (
            <section className='w-full bg-white flex items-center justify-center h-[80vh]'>
                <div className='flex flex-col items-center animate-pulse gap-3'>
                    <h2 className='text-4xl text-black font-black italic uppercase tracking-tighter'>Markline</h2>
                    <p className='text-xs font-bold text-gray-400  tracking-widest'>Verifying Manifest Registry...</p>
                </div>
            </section>
        )
    }

    if (error || !orderRecord) {
        return (
            <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-6 px-6">
                <h3 className="text-xl font-black  text-black">Order Manifest Not Found</h3>
                <p className="text-xs text-gray-400 font-bold  tracking-widest">{error || "The requested order ID does not exist in your acquisition history."}</p>
                <Link href="/user">
                    <button className="px-6 py-3 bg-black text-white rounded-xl text-[10px] font-black  tracking-widest">
                        Return to Profile
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
    const shortId = orderid ? orderid.slice(0, 8).toUpperCase() : '';

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

    const trendingList = Array.isArray(trending) ? trending : []

    return (
        <div className="bg-white min-h-screen">
            {/* Top Navigation Bar */}
            <div className="border-b border-gray-100 bg-gray-50/50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/user" className="inline-flex items-center gap-2 text-xs font-black  tracking-widest text-black hover:text-gray-600 transition-colors">
                        <ArrowLeft size={16} />
                        <span>Return to Manifests</span>
                    </Link>
                </div>
            </div>

            {/* Header Area */}
            <div className="border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 py-10 md:py-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl md:text-3xl font-black italic  tracking-tight text-black">
                                Manifest Details
                            </span>
                            <span className={`text-[9px] font-black  tracking-[0.2em] px-3 py-1 rounded-md border ${fulfillmentStatus === 'DELIVERED' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                                fulfillmentStatus === 'SHIPPED' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                                    fulfillmentStatus === 'CANCELLED' ? 'bg-red-50 text-red-600 border-red-200' :
                                        'bg-amber-50 text-amber-600 border-amber-200'
                                }`}>
                                {fulfillmentStatus}
                            </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-6 pt-2">
                            <div className="flex items-center gap-2">
                                <Hash size={14} className="text-gray-300" />
                                <span className="text-xs font-bold text-black  tracking-widest">{orderid}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar size={14} className="text-gray-300" />
                                <span className="text-xs font-bold text-gray-400  tracking-widest">
                                    {formatDate(orderRecord.created_at)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <OrderDetails order={{
                        ...orderRecord,
                        order_items: itemsList,
                        grand_total: grandTotal,
                        subtotal: subtotal,
                        discount_amount: discountAmount
                    }} />
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

                    {/* Left Column: Transit Log & Parcel Items */}
                    <div className="lg:col-span-8 space-y-12">
                        {/* Transit Status Section */}
                        <section className="space-y-6">
                            <h2 className="text-sm font-black  text-black border-l-4 border-black pl-4">
                                Transit Log & Status
                            </h2>
                            <div className="bg-gray-50/50 rounded-2xl p-6 md:p-8 border border-gray-300">
                                <OrderStatus
                                    status={orderRecord.isDelivered}
                                    fulfillment_status={orderRecord.fulfillment_status}
                                    payment_status={orderRecord.payment_status}
                                    return_status={orderRecord.return_status}
                                    cancel_reason={orderRecord.cancel_reason}
                                    created_at={orderRecord.created_at}
                                    updated_at={orderRecord.updated_at}
                                />
                            </div>
                        </section>

                        {/* Parcel Items Section */}
                        <section className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-sm font-black  text-black border-l-4 border-black pl-4">
                                    Items in Parcel ({itemsList.length})
                                </h2>
                            </div>

                            <div className="divide-y divide-gray-100 border border-gray-300 px-6 rounded-2xl bg-white">
                                {itemsList.map((item: any, idx: number) => (
                                    <OrderProductRow key={item.id || idx} item={item} />
                                ))}
                            </div>
                        </section>

                        {/* Customer / Admin Notes */}
                        {(orderRecord.customer_note || orderRecord.admin_note) && (
                            <section className="space-y-6">
                                <h2 className="text-sm font-black  text-black border-l-4 border-black pl-4">
                                    Manifest Notes
                                </h2>
                                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 flex flex-col gap-4">
                                    {orderRecord.customer_note && (
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] font-black  tracking-widest text-gray-400">Customer Note</span>
                                            <p className="text-sm font-medium text-black leading-relaxed">{orderRecord.customer_note}</p>
                                        </div>
                                    )}
                                    {orderRecord.admin_note && (
                                        <div className="flex flex-col gap-1 border-t border-gray-200 pt-3">
                                            <span className="text-[10px] font-black  tracking-widest text-gray-400">Dispatch Note</span>
                                            <p className="text-sm font-medium text-black leading-relaxed">{orderRecord.admin_note}</p>
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Right Column: Destination & Financial Summary */}
                    <div className="lg:col-span-4 space-y-10">
                        {/* Delivery Destination Section */}
                        <section className="space-y-6">
                            <h2 className="text-sm font-black  text-black border-l-4 border-black pl-4">
                                Courier Destination
                            </h2>
                            <div className="bg-black text-white p-8 rounded-2xl shadow-xl shadow-black/10 transition-all hover:-translate-y-1 hover:shadow-black/20">
                                <div className="flex gap-4 items-start">
                                    <MapPin size={20} className="text-yellow-500 flex-shrink-0 mt-1" />
                                    <div className="space-y-4 flex-1">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-black  tracking-widest text-gray-500">Recipient</span>
                                            <span className="text-sm font-bold ">{address?.name || address?.full_name || 'Valued Customer'}</span>
                                        </div>

                                        {(address?.phone_number || address?.phone) && (
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black  tracking-widest text-gray-500">Contact</span>
                                                <span className="text-sm font-medium opacity-80">{address.phone_number || address.phone}</span>
                                            </div>
                                        )}

                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black  tracking-widest text-gray-500">Address</span>
                                            <p className="text-sm font-medium leading-relaxed opacity-80 ">
                                                {address?.full_address || address?.address || [address?.street, address?.city, address?.state, address?.pincode].filter(Boolean).join(', ') || 'Registered Address'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Financial Summary */}
                        <section className="space-y-6">
                            <h2 className="text-xs font-black  text-black border-l-4 border-black pl-4">
                                Financial Summary
                            </h2>
                            <div className="border border-gray-300 rounded-2xl p-8 space-y-6 flex flex-col bg-white">
                                <div className="flex items-center justify-between text-gray-400">
                                    <div className="flex items-center gap-2">
                                        <CreditCard size={14} />
                                        <span className="text-sm  font-black  tracking-widest">{paymentMethod}</span>
                                    </div>
                                    <span className={`text-xs font-black  tracking-widest px-2 py-0.5 rounded ${paymentStatus === 'PAID' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                        }`}>
                                        {paymentStatus}
                                    </span>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-gray-100">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-gray-600  tracking-widest">Items Subtotal</span>
                                        <span className="text-xs font-black text-black">{formatCurrency(subtotal)}</span>
                                    </div>

                                    {discountAmount > 0 && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-bold text-gray-600  tracking-widest">
                                                Discount {orderRecord.coupon_code ? `(${orderRecord.coupon_code})` : ''}
                                            </span>
                                            <span className="text-xs font-black text-emerald-600">-{formatCurrency(discountAmount)}</span>
                                        </div>
                                    )}

                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-gray-600 tracking-widest">Courier & Logistics</span>
                                        <span className="text-xs font-black text-emerald-600  tracking-widest">
                                            {shippingCharge > 0 ? formatCurrency(shippingCharge) : 'Complimentary'}
                                        </span>
                                    </div>

                                    {taxAmount > 0 && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-bold text-gray-400  tracking-widest">Estimated Tax</span>
                                            <span className="text-xs font-black text-black">{formatCurrency(taxAmount)}</span>
                                        </div>
                                    )}

                                    <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                                        <span className="text-xs font-black text-black  tracking-[0.2em]">Grand Total</span>
                                        <span className="text-xl font-black text-black">{formatCurrency(grandTotal)}</span>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>

            {/* Trending Section */}
            {trendingList.length > 0 && (
                <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 border-t border-gray-100">
                    <CategoriesSection title={"Discover Trending Selections"} url='' >
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-1 pt-8 bg-gray-50 rounded-3xl overflow-hidden border border-gray-100">
                            {trendingList.slice(0, 4).map((product: any, index: number) => (
                                <ProductCard
                                    url='product'
                                    key={index}
                                    product={product.product}
                                    className="h-[300px] md:h-[400px] border-none"
                                />
                            ))}
                        </div>
                    </CategoriesSection>
                </div>
            )}
        </div>
    )
}
