
'use client'
import React, { useEffect, useState } from 'react'
import OrderplacedSection from './OrderplacedSection'
import AddressSection from './AddressSection'
import { getCurrentUserOrders } from '@/Supabase/SupabaseApi'
import { mysupabase } from '@/Supabase/SupabaseConfig'
import { UserAddressProvider } from '@/Contexts/UserAddressProvider'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, MapPin, Receipt, Navigation, Package } from 'lucide-react'
import AddAdressSheet from './AddAdressSheet'

function OrderandAddressSection() {
    const [activeTab, setActiveTab] = useState<'orders' | 'address'>('orders')
    const [perform, setPerfom] = useState(false)
    const [orders, setOrders] = useState<any[]>([])
    const [address, setAddress] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    function handleperform() {
        setPerfom((prev) => !prev)
    }

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            const { data: { user } } = await mysupabase.auth.getUser();

            if (user) {
                const { orders, address }: any = await getCurrentUserOrders(user.id)
                setOrders(orders || [])
                setAddress(address || [])
            }
            setLoading(false)
        }
        fetchData()
    }, [perform])

    return (
        <UserAddressProvider>
            <section className='flex flex-col gap-1 md:gap-12 bg-white border border-gray-300 rounded-2xl overflow-hidden'>

                {/* Elite Tabs Navigation */}
                <div className='flex items-center border-b border-gray-100 bg-white overflow-x-auto no-scrollbar'>
                    <button
                        onClick={() => setActiveTab('orders')}
                        className='flex-1 relative py-6 px-4 group'
                    >
                        <div className='flex items-center justify-center gap-3'>
                            <div className={`p-2 rounded-xl transition-all duration-300 ${activeTab === 'orders' ? 'bg-black text-white shadow-lg' : 'bg-gray-50 text-gray-400'}`}>
                                <Receipt size={16} />
                            </div>
                            <span className={` text-[8px] sm:text-[10px] md:text-xs font-black uppercase tracking-[0.2em] transition-colors ${activeTab === 'orders' ? 'text-black' : 'text-gray-400'}`}>
                                Purchase Manifest
                            </span>
                        </div>
                        {activeTab === 'orders' && (
                            <motion.div layoutId="tab-underline" className='absolute bottom-0 left-0 right-0 h-[3px] bg-black rounded-t-full' />
                        )}
                    </button>

                    <button
                        onClick={() => setActiveTab('address')}
                        className='flex-1 relative py-6 px-4 group'
                    >
                        <div className='flex items-center justify-center gap-3'>
                            <div className={`p-2 rounded-xl transition-all duration-300 ${activeTab === 'address' ? 'bg-black text-white shadow-lg' : 'bg-gray-50 text-gray-400'}`}>
                                <Navigation size={16} />
                            </div>
                            <span className={` text-[8px] sm:text-[10px] md:text-xs font-black uppercase tracking-[0.2em] transition-colors ${activeTab === 'address' ? 'text-black' : 'text-gray-400'}`}>
                                Postal Registry
                            </span>
                        </div>
                        {activeTab === 'address' && (
                            <motion.div layoutId="tab-underline" className='absolute bottom-0 left-0 right-0 h-[3px] bg-black rounded-t-full' />
                        )}
                    </button>
                </div>

                {/* Content Area */}
                <div className='relative min-h-[500px] px-2 md:px-6  py-5 md:py-10'>
                    <AnimatePresence mode='wait'>
                        {activeTab === 'address' ? (
                            <motion.div
                                key='address'
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className='w-full'
                            >
                                <div className='flex flex-col md:flex-row md:items-end justify-between w-full relative gap-8 mb-12'>


                                    <AddAdressSheet handleperform={handleperform}>
                                        <button className='w-full md:w-auto px-8 py-4 bg-black text-white rounded-xl text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-black/10 hover:-translate-y-1 transition-all active:scale-95'>
                                            Register New Address
                                        </button>
                                    </AddAdressSheet>
                                </div>
                                {address?.length > 0 ? (
                                    <AddressSection address={address} />
                                ) : (
                                    <div className='flex flex-col items-center justify-center py-24 gap-8 border border-gray-100 rounded-3xl bg-gray-50/30'>
                                        <div className='w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl shadow-gray-200/50 text-gray-200'>
                                            <MapPin size={32} />
                                        </div>
                                        <div className='flex flex-col items-center gap-2 text-center px-6'>
                                            <h3 className='text-xl font-black text-black uppercase tracking-tight'>No Address Registered</h3>
                                            <p className='text-xs text-gray-400 font-bold uppercase tracking-widest max-w-[280px] leading-relaxed'>
                                                Your jurisdiction registry is currently empty.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            <motion.div
                                key='orders'
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className='w-full'
                            >
                                <OrderplacedSection orders={orders} handleperform={handleperform} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>
        </UserAddressProvider>
    )
}

export default OrderandAddressSection

