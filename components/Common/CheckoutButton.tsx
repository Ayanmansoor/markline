import React, { useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from 'lucide-react'

import { AddressProps } from '@/types/interfaces'
import { mysupabase } from '@/Supabase/SupabaseConfig'
import LoginForm from '../Common/FlowLoginForm'
import { useCartContext } from '@/Contexts/Cart.context'
import { useAuth } from '@/Contexts/Auth.context'
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
    const [Useraddress, setUserAddress] = useState<AddressProps[]>([])
    const [isAddressLoading, setIsAddressLoading] = useState(false)

    const { cart } = useCartContext()
    const [open, setOpen] = useState(false)

    useEffect(() => {
        if (currentTab === "password") {
            setOpen(false);
        }
    }, [currentTab]);

    // Lazy load addresses only when the checkout modal is opened
    useEffect(() => {
        let isMounted = true;

        async function fetchAddresses() {
            if (!open || !currentuser?.id) return;
            setIsAddressLoading(true);
            try {
                const { data: addresses, error } = await mysupabase
                    .from("address")
                    .select("*")
                    .eq("user_id", currentuser.id);

                if (isMounted) {
                    setUserAddress(addresses ?? []);
                }
            } catch (err) {
                console.error("Error fetching addresses:", err);
            } finally {
                if (isMounted) {
                    setIsAddressLoading(false);
                }
            }
        }

        fetchAddresses();
        return () => { isMounted = false; };
    }, [open, currentuser?.id, currentTab]);

    function handleAddressCreated(newAddr: any) {
        const createdRecord = Array.isArray(newAddr?.data)
            ? newAddr.data[0]
            : (newAddr?.data || newAddr);
        if (createdRecord) {
            setUserAddress((prev) => [createdRecord, ...(prev || []).filter((a: any) => a.id !== createdRecord.id)]);
        }
    }

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    {children}
                </DialogTrigger>
                <DialogContent className="max-w-[calc(100vw-20px)] p-3 md:p-5 md:max-w-[825px] h-auto max-h-[90vh] md:max-h-[600px] flex flex-col overflow-hidden bg-white">
                    <DialogHeader>
                        <DialogTitle className=' text-lg border-b pb-5 lg:text-2xl xl:text-4xl font-semibold text-start'>Select Address</DialogTitle>
                    </DialogHeader>
                    <Tabs defaultValue="address" className="w-full flex-1 flex flex-col min-h-0 overflow-hidden" value={currentTab} onValueChange={setcurrentTab}>

                        {/* ADDRESS TAB */}
                        <TabsContent value="address" className="w-full flex-1 flex flex-col min-h-0 overflow-hidden focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 outline-none">

                            {/* 1. Auth is resolving */}
                            {isAuthLoading && (
                                <div className="w-full h-[260px] flex flex-col items-center justify-center gap-3 text-gray-400">
                                    <Loader2 size={32} className="animate-spin text-black" />
                                    <span className="text-xs font-semibold text-gray-500">Checking your account...</span>
                                </div>
                            )}

                            {/* 2. User is definitely NOT logged in → Show LoginForm */}
                            {!isAuthLoading && !currentuser?.email && (
                                <div className="w-full flex-1 overflow-y-auto">
                                    <LoginForm />
                                </div>
                            )}

                            {/* 3. User is logged in, but addresses are loading */}
                            {!isAuthLoading && currentuser?.email && isAddressLoading && (
                                <div className="w-full h-[260px] flex flex-col items-center justify-center gap-3 text-gray-400">
                                    <Loader2 size={32} className="animate-spin text-black" />
                                    <span className="text-xs font-semibold text-gray-500">Loading saved addresses...</span>
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
                                    className="bg-black text-white px-6 py-2"
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