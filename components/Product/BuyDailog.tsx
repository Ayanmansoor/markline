import React, { useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from 'lucide-react';

import BuyComponent from './BuyComponent'
import { AddressProps, newBuyDailogProps, orderData } from '@/types/interfaces'
import { mysupabase } from '@/Supabase/SupabaseConfig'
import SelectOrder from '../Common/SelectAddress'
import LoginModal from '../Common/LoginModal'
import AddUserAddressForm from '../users/AddUserAddressform'
import { useAuth } from '@/Contexts/Auth.context'
import { useUserAddress } from '@/Contexts/UserAddressProvider'

function BuyDailog({ children, product, selectedVariant }: newBuyDailogProps) {
    const [currentTab, setcurrentTab] = useState('account')
    const { user: currentuser, loading: isAuthLoading } = useAuth()
    const { addresses: Useraddress, loading: isAddressLoading, addAddress, isLoaded } = useUserAddress()

    const [orderId, setOrderID] = useState<orderData>({
        orderID: "",
        email: "",
        username: ""
    })
    const [open, setOpen] = useState(false);
    const [loginOpen, setLoginOpen] = useState(false);

    useEffect(() => {
        if (currentTab === "password") {
            setOpen(false);
        }
    }, [currentTab]);

    // When user logs in via the login modal, automatically open the Buy Dialog
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
    }

    return (
        <>
            <div onClick={handleTriggerClick} className="w-full h-full">
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

            {/* Buy Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-[calc(100vw-24px)] p-4 sm:p-6 md:max-w-[800px] h-auto max-h-[90vh] md:max-h-[620px] flex flex-col overflow-hidden z-[50] rounded-2xl border border-zinc-200/80 bg-white shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className='text-lg font-bold text-zinc-900 border-b border-zinc-100 pb-3 text-start'>
                            Order Summary
                        </DialogTitle>
                    </DialogHeader>
                    <Tabs defaultValue="account" className="w-full flex-1 min-h-0 flex flex-col overflow-hidden" value={currentTab} onValueChange={setcurrentTab}>

                        {/* 1. BUY DETAILS TAB */}
                        <TabsContent value="account" className="w-full flex-1 min-h-0 flex flex-col overflow-y-auto pr-1 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 outline-none">
                            <BuyComponent
                                product={product}
                                user={(currentuser as any) || undefined}
                                setConfirm={setcurrentTab}
                                variant={selectedVariant}
                            />
                        </TabsContent>

                        {/* 2. ADDRESS TAB */}
                        <TabsContent value="address" className="w-full flex-1 flex flex-col min-h-0 overflow-hidden focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 outline-none">
                            <div className="w-full flex-1 min-h-0 overflow-y-auto pr-1">
                                {isAddressLoading ? (
                                    <div className="w-full h-[220px] flex flex-col items-center justify-center gap-2.5 text-zinc-400">
                                        <Loader2 size={22} className="animate-spin text-zinc-900" />
                                        <span className="text-xs font-medium text-zinc-500">Loading saved addresses...</span>
                                    </div>
                                ) : currentuser?.email && Useraddress?.length === 0 ? (
                                    <AddUserAddressForm handleperform={handleAddressCreated} hideHeader={true} className="border-none shadow-none p-1 md:p-3" />
                                ) : currentuser?.email && Useraddress?.length > 0 ? (
                                    <SelectOrder
                                        product={product}
                                        user={(currentuser as any) || undefined}
                                        userAddress={Useraddress}
                                        setConfirm={setcurrentTab}
                                        variant={selectedVariant}
                                        closeDialog={() => setOpen(false)}
                                    />
                                ) : null}
                            </div>
                        </TabsContent>

                        {/* Next Button */}
                        <TabsList className="w-full mt-4 flex justify-end gap-3 bg-transparent">
                            {currentTab === "account" && (
                                <TabsTrigger
                                    value="address"
                                    className="bg-zinc-900 text-white px-6 h-11 rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-zinc-800 transition"
                                >
                                    Proceed to Address
                                </TabsTrigger>
                            )}
                        </TabsList>

                    </Tabs>
                </DialogContent>
            </Dialog >
        </>
    )
}

export default BuyDailog