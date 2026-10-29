import React, { useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from 'lucide-react'

import { AddressProps } from '@/types/interfaces'
import { mysupabase } from '@/Supabase/SupabaseConfig'
import LoginModal from './LoginModal'
import { useCartContext } from '@/Contexts/Cart.context'
import { useAuth } from '@/Contexts/Auth.context'
import { useUserAddress } from '@/Contexts/UserAddressProvider'
import CheckoutAddressSelect from './CheckoutAddressSelect'
import AddUserAddressForm from '../users/AddUserAddressform'

interface CheckOutButtonProps {
    children: React.ReactNode;
    appliedCoupon?: {
        code: string;
        coupon_id: string;
        discountAmount: number;
        title: string;
    } | null;
}

function CheckOutButton({ children, appliedCoupon }: CheckOutButtonProps) {
    const [currentTab, setcurrentTab] = useState('address')
    const { user: currentuser, loading: isAuthLoading } = useAuth()
    const { addresses: Useraddress, loading: isAddressLoading, addAddress } = useUserAddress()

    const { cart } = useCartContext()
    const [open, setOpen] = useState(false)
    const [loginOpen, setLoginOpen] = useState(false)

    useEffect(() => {
        if (currentTab === "password") {
            setOpen(false);
        }
    }, [currentTab]);

    // When user logs in via the login modal, automatically open the checkout modal
    useEffect(() => {
        if (currentuser?.id && loginOpen) {
            setLoginOpen(false);
            setOpen(true);
        }
    }, [currentuser?.id, loginOpen]);

    function handleAddressCreated(newAddr: any) {
        const createdRecord = Array.isArray(newAddr?.data)
            ? newAddr.data[0]
            : (newAddr?.data || newAddr);
        if (createdRecord) {
            addAddress(createdRecord);
        }
    }

    const handleTriggerClick = (e: React.MouseEvent) => {
        e.preventDefault();

        if (isAuthLoading) {
            return;
        }

        if (currentuser?.id) {
            setOpen(true);
        } else {
            setLoginOpen(true);
        }
    };

    return (
        <>
            <div onClick={handleTriggerClick} className="w-full">
                {children}
            </div>

            {/* Login Modal */}
            <LoginModal
                isOpen={loginOpen}
                setIsOpen={setLoginOpen}
                onSuccess={() => {
                    setLoginOpen(false);
                    setOpen(true);
                }}
            />

            {/* Checkout Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-[calc(100vw-24px)] p-4 sm:p-6 md:max-w-[825px] h-auto max-h-[90vh] md:max-h-[620px] flex flex-col overflow-hidden bg-white rounded-2xl border border-zinc-200/80 shadow-2xl z-[50]">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold tracking-tight text-zinc-900 border-b border-zinc-100 pb-3 text-start">
                            Select Delivery Address
                        </DialogTitle>
                    </DialogHeader>
                    <Tabs defaultValue="address" className="w-full flex-1 flex flex-col min-h-0 overflow-hidden" value={currentTab} onValueChange={setcurrentTab}>

                        {/* ADDRESS TAB */}
                        <TabsContent value="address" className="w-full flex-1 flex flex-col min-h-0 overflow-hidden focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 outline-none">

                            {/* 1. Auth is resolving */}
                            {isAuthLoading && (
                                <div className="w-full h-[260px] flex flex-col items-center justify-center gap-3 text-zinc-400">
                                    <Loader2 size={22} className="animate-spin text-zinc-900" />
                                    <span className="text-xs font-medium text-zinc-500">Checking your account...</span>
                                </div>
                            )}

                            {/* 2. User is not logged in */}
                            {!isAuthLoading && !currentuser?.email && (
                                <div className="w-full flex-1 flex flex-col items-center justify-center gap-4 py-8">
                                    <p className="text-xs text-zinc-500">Please sign in to view and select your delivery address.</p>
                                    <button
                                        onClick={() => {
                                            setOpen(false);
                                            setLoginOpen(true);
                                        }}
                                        className="h-11 px-6 bg-zinc-900 text-white text-xs font-semibold rounded-xl uppercase tracking-wider hover:bg-zinc-800 transition"
                                    >
                                        Sign In
                                    </button>
                                </div>
                            )}

                            {/* 3. User is logged in, but addresses are loading */}
                            {!isAuthLoading && currentuser?.email && isAddressLoading && (
                                <div className="w-full h-[260px] flex flex-col items-center justify-center gap-3 text-zinc-400">
                                    <Loader2 size={22} className="animate-spin text-zinc-900" />
                                    <span className="text-xs font-medium text-zinc-500">Loading saved addresses...</span>
                                </div>
                            )}

                            {/* 4. Logged in, addresses loaded, has 0 addresses → Show Add Address Form */}
                            {!isAuthLoading && currentuser?.email && !isAddressLoading && Useraddress.length === 0 && (
                                <div className="w-full flex-1 overflow-y-auto">
                                    <AddUserAddressForm handleperform={handleAddressCreated} hideHeader={true} className="border-none shadow-none p-1 md:p-3" />
                                </div>
                            )}

                            {/* 5. Logged in, addresses loaded, has addresses → Show Select Address */}
                            {!isAuthLoading && currentuser?.email && !isAddressLoading && Useraddress.length > 0 && (
                                <CheckoutAddressSelect cartItems={cart} setConfirm={setcurrentTab} userAddress={Useraddress} appliedCoupon={appliedCoupon} currentUser={currentuser as any} closeDialog={() => setOpen(false)} />
                            )}

                        </TabsContent>

                        {/* Next Button */}
                        <TabsList className="w-full mt-4 flex justify-end gap-4 bg-transparent">
                            {currentTab === "account" && (
                                <TabsTrigger
                                    value="address"
                                    className="h-11 bg-zinc-900 text-white px-6 rounded-xl font-semibold text-xs tracking-wider uppercase hover:bg-zinc-800 transition"
                                >
                                    Next
                                </TabsTrigger>
                            )}
                        </TabsList>

                    </Tabs>
                </DialogContent>
            </Dialog >
        </>
    )
}

export default CheckOutButton