'use client'
import React, { useEffect, useState } from "react"
import { useParams, redirect } from "next/navigation"
import { useQuery } from "react-query"
import { mysupabase } from "@/Supabase/SupabaseConfig"
import { getAllTrendingProducts, getCurrentUserSingleOrder } from "@/Supabase/SupabaseApi"
import { OrderStatus } from "@/components/Order/OrderStatus"
import { OrderProductRow } from "@/components/Order/OrderProductRow"
import OrderDetails from "@/components/Common/OrderDetailsinvioce"
import CategoriesSection from "@/components/Common/CategoriesSection"
import ProductCard from "@/components/Common/ProductCard"
import { MapPin, CreditCard, Calendar, Hash } from "lucide-react"

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

export default function OrderPage() {
    const { id } = useParams()
    const orderid = Array.isArray(id) ? id[0] : id

    const [orders, setOrders] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchOrder() {
            setLoading(true)
            try {
                const { data: { user } } = await mysupabase.auth.getUser()
                if (user) {
                    const { orders }: any = await getCurrentUserSingleOrder(user.id, orderid || "")
                    setOrders(orders || [])
                }
            } catch (err) {
                console.error("Error fetching order:", err)
                setError("Failed to load order")
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
                <div className='flex flex-col items-center animate-pulse'>
                    <h2 className='text-4xl text-black font-black italic uppercase tracking-tighter'>Markline</h2>
                    <p className='text-xs font-bold text-gray-400 uppercase tracking-widest mt-2'>Verifying Manifest...</p>
                </div>
            </section>
        )
    }

    if (error || !orders.length) {
        redirect('/user')
    }

    const firstItem = orders[0]
    const address = firstItem?.address_id

    // Trending Section
    const trendingList = Array.isArray(trending) ? trending : []

    return (
        <div className="bg-white min-h-screen">
            {/* Header Area */}
            <div className="border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 flex flex-col md:flex-row md:items-end justify-between gap-8">

                    <div className="flex flex-wrap items-center gap-6 pt-4">
                        <div className="flex items-center gap-2">
                            <Hash size={14} className="text-gray-300" />
                            <span className="text-xs font-bold text-black uppercase tracking-widest">{orderid}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-gray-300" />
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                {formatDate(firstItem?.created_at)}
                            </span>
                        </div>
                    </div>
                    <OrderDetails order={firstItem} />
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

                    {/* Left Column: Status & Items */}
                    <div className="lg:col-span-8 space-y-16">
                        {/* Status Section */}
                        <section className="space-y-8">
                            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-black border-l-4 border-black pl-4">
                                Transit Log
                            </h2>
                            <div className="bg-gray-50/50 rounded-2xl p-4 md:p-8 border border-gray-300">
                                <OrderStatus status={firstItem?.isDelivered || 'PENDING'} />
                            </div>
                        </section>

                        {/* Items Section */}
                        <section className="space-y-8">
                            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-black border-l-4 border-black pl-4">
                                Items in Parcel
                            </h2>
                            <div className="divide-y divide-gray-100 border border-gray-300 px-5 rounded-2xl">
                                {Array.isArray(orders) && orders.map((item, idx) => (
                                    <OrderProductRow key={item.id || idx} item={item} />
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Address & Summary */}
                    <div className="lg:col-span-4 space-y-12">
                        {/* Delivery Section */}
                        <section className="space-y-6">
                            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-black border-l-4 border-black pl-4">
                                Courier Destination
                            </h2>
                            <div className="bg-black text-white p-8 rounded-2xl shadow-xl shadow-black/10 transition-all hover:-translate-y-1 hover:shadow-black/20">
                                <div className="flex gap-4 items-start">
                                    <MapPin size={20} className="text-yellow-500 flex-shrink-0 mt-1" />
                                    <div className="space-y-4">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Recipient</span>
                                            <span className="text-sm font-bold uppercase">{address?.name}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Address</span>
                                            <p className="text-xs font-medium leading-relaxed opacity-80 uppercase">
                                                {address?.full_address}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Payment Summary */}
                        <section className="space-y-6">
                            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-black border-l-4 border-black pl-4">
                                Financial Summary
                            </h2>
                            <div className="border border-gray-300 rounded-2xl p-8 space-y-6 flex flex-col">
                                <div className="flex items-center gap-3 text-gray-400">
                                    <CreditCard size={14} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Online Payment</span>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-gray-50">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Base Amount</span>
                                        <span className="text-xs font-black text-black">₹{Array.isArray(orders) ? orders.reduce((acc, curr) => acc + (curr.final_price || 0), 0) : 0}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Courier</span>
                                        <span className="text-xs font-black text-green-500 uppercase tracking-widest">Complimentary</span>
                                    </div>
                                    {firstItem?.discount_amount > 0 && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Discount</span>
                                            <span className="text-xs font-black text-green-500 tracking-widest">-₹{firstItem.discount_amount}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                        <span className="text-xs font-black text-black uppercase tracking-[0.2em]">Final Total</span>
                                        <span className="text-xl font-black text-black">₹{firstItem?.final_price}</span>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>

            {/* Trending Section */}
            {trendingList.length > 0 && (
                <div className="max-w-7xl mx-auto px-6 py-20 md:py-32">
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
