
'use client'
import React, { useEffect, useState } from 'react'
import OrderplacedSection from './OrderplacedSection'
import AddressSection from './AddressSection'
import { getCurrentUserOrders } from '@/Supabase/SupabaseApi'
import { mysupabase } from '@/Supabase/SupabaseConfig'
import { UserAddressProvider } from '@/Contexts/UserAddressProvider'

function OrderandAddressSection() {

    const [whatSelected, setWhatSelectd] = useState({
        isOrder: true,
        isAddress: false
    })
    const [perform, setPerfom] = useState(false)
    const [orders, setOrders] = useState<any[]>([])
    const [address, setAddress] = useState<any[]>([])


    function handleaddressbtn() {
        setWhatSelectd(prev => ({ ...prev, isAddress: true, isOrder: false }))
    }
    function handleOrder() {
        setWhatSelectd(prev => ({ ...prev, isOrder: true, isAddress: false }))
    }

    function handleperform() {
        setPerfom((prev) => !prev)
    }

    useEffect(() => {
        async function getSupabaseUser() {
            const {
                data: { user },
                error,
            } = await mysupabase.auth.getUser();

            if (user) {
                const { orders, address }: any = await getCurrentUserOrders(user.id)
                setOrders(orders)
                setAddress(address)
            }
        }
        getSupabaseUser()

    }, [perform])


    return (
        <UserAddressProvider>
            <section className='flex flex-col gap-0 rounded-lg overflow-hidden bg-white'>

                <div className='w-full relative flex items-start justify-start  '>
                    <span className={`text-base  px-10 py-2  ${whatSelected.isOrder ? 'bg-primary text-white' : 'bg-gray-200 text-primary'} `} onClick={handleOrder}>
                        Orders
                    </span>
                    <span className={`text-base  px-10 py-2  ${whatSelected.isAddress ? 'bg-primary text-white' : 'bg-gray-200 text-primary'} `} onClick={handleaddressbtn}>
                        Address
                    </span>
                </div>
                <div className='w-full border border-gray-200 min-h-[600px] '>
                    {
                        whatSelected.isAddress &&
                        <AddressSection address={address} handleperform={handleperform} />

                    }
                    {
                        whatSelected.isOrder &&
                        <OrderplacedSection orders={orders} handleperform={handleperform} />
                    }
                </div>
            </section>
        </UserAddressProvider>
    )
}

export default OrderandAddressSection