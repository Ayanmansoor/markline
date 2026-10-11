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
import { AddressProps, newBuyDailogProps, orderData, userinterfce } from '@/types/interfaces'
import { mysupabase } from '@/Supabase/SupabaseConfig'
import SelectOrder from '../Common/SelectAddress'
import LoginForm from '../Common/FlowLoginForm'
import AddUserAddressForm from '../users/AddUserAddressform'

function BuyDailog({ children, product, selectedVariant }: newBuyDailogProps) {
    const [currentTab, setcurrentTab] = useState('account')
    const [currentuser, setUser] = useState<userinterfce>();
    const [Useraddress, setUserAddress] = useState<AddressProps[]>([]);
    const [isAddressLoading, setIsAddressLoading] = useState(false);

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

    useEffect(() => {
        async function getSupabaseUser() {
            const {
                data: { user },
                error,
            } = await mysupabase.auth.getUser();

            if (user) {
                setUser(user);
                // Also close login modal if it's open and user becomes authenticated
                setLoginOpen(false);
            }
        }

        getSupabaseUser();

        // Listen to auth changes — only open buy dialog if user just logged in via the login modal
        const { data: authListener } = mysupabase.auth.onAuthStateChange((event, session) => {
            if (session?.user) {
                setUser(session.user);
                // Only open buy dialog on an actual sign-in action (not on initial page load session restore)
                if (event === 'SIGNED_IN') {
                    setLoginOpen(prev => {
                        if (prev) setOpen(true); // open buy dialog only if login modal was open
                        return false;
                    });
                } else {
                    setLoginOpen(false);
                }
            } else {
                setUser(undefined);
            }
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [])

    useEffect(() => {
        async function getSupabaseUser() {
            if (!currentuser?.id) return;
            setIsAddressLoading(true);
            try {
                const { data: addresses } = await mysupabase
                    .from("address")
                    .select("*")
                    .eq("user_id", currentuser?.id);

                setUserAddress(addresses ?? []);
            } catch (err) {
                console.error("Error fetching user addresses:", err);
            } finally {
                setIsAddressLoading(false);
            }
        }

        if (currentuser?.id) {
            getSupabaseUser();
        }
    }, [currentuser, currentTab])

    function handleAddressCreated(newAddr: any) {
        const createdRecord = Array.isArray(newAddr?.data)
            ? newAddr.data[0]
            : (newAddr?.data || newAddr);
        if (createdRecord) {
            setUserAddress((prev) => [createdRecord, ...(prev || []).filter((a: any) => a.id !== createdRecord.id)]);
        }
    }

    const handleTriggerClick = (e: React.MouseEvent) => {
        // Prevent default form submission or navigation if children is a link/button
        e.preventDefault();

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
            <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
                <DialogContent className="max-w-md p-0 overflow-hidden bg-white">
                    <LoginForm />
                </DialogContent>
            </Dialog>

            {/* Buy Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-[calc(100vw-20px)] p-3 md:p-5 md:max-w-[825px] h-auto max-h-[90vh] md:max-h-[600px] flex flex-col overflow-hidden z-[50] rounded-lg bg-white">
                    <DialogHeader>
                        <DialogTitle className=' text-lg border-b pb-5 lg:text-2xl xl:text-4xl font-semibold text-start'>Selected Items</DialogTitle>
                    </DialogHeader>
                    <Tabs defaultValue="account" className="w-full flex-1 min-h-0 flex flex-col overflow-hidden" value={currentTab} onValueChange={setcurrentTab}>

                        {/* 1. BUY DETAILS TAB */}
                        <TabsContent value="account" className="w-full flex-1 min-h-0 flex flex-col overflow-y-auto pr-1 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 outline-none">
                            <BuyComponent
                                product={product}
                                user={currentuser}
                                setConfirm={setcurrentTab}
                                variant={selectedVariant}
                            />
                        </TabsContent>

                        {/* 2. ADDRESS TAB */}
                        <TabsContent value="address" className="w-full flex-1 flex flex-col min-h-0 overflow-hidden focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 outline-none">
                            <div className="w-full flex-1 min-h-0 overflow-y-auto pr-1">
                                {isAddressLoading ? (
                                    <div className="w-full h-[220px] flex flex-col items-center justify-center gap-3 text-gray-400">
                                        <Loader2 size={32} className="animate-spin text-black" />
                                        <span className="text-xs font-semibold text-gray-500">Loading saved addresses...</span>
                                    </div>
                                ) : currentuser?.email && Useraddress?.length === 0 ? (
                                    <AddUserAddressForm handleperform={handleAddressCreated} hideHeader={true} className="border-none shadow-none p-1 md:p-3" />
                                ) : currentuser?.email && Useraddress?.length > 0 ? (
                                    <SelectOrder
                                        product={product}
                                        user={currentuser}
                                        userAddress={Useraddress}
                                        setConfirm={setcurrentTab}
                                        variant={selectedVariant}
                                        closeDialog={() => setOpen(false)}
                                    />
                                ) : null}
                            </div>
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

export default BuyDailog