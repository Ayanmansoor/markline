import React, { useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


import { AddressProps, BuyDailogProps, newBuyDailogProps, orderData, userinterfce } from '@/types/interfaces'
import { mysupabase } from '@/Supabase/SupabaseConfig'
import { getSelectedAddress } from '@/Supabase/SupabaseApi'
import SelectOrder from '../Common/SelectAddress'
import { UserAddressProvider } from '@/Contexts/UserAddressProvider'
import LoginForm from '../Common/FlowLoginForm'
import BuyComponent from '../Product/BuyComponent'
import { useCartContext } from '@/Contexts/Cart.context'
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
    const [currentuser, setUser] = useState<userinterfce>();
    const [Useraddress, setUserAddress] = useState<AddressProps[]>([]);

    const { cart } = useCartContext()

    const [open, setOpen] = useState(false);



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
            }
            // else{}
        }
        getSupabaseUser()
    }, [])


    useEffect(() => {
        async function getSupabaseUser() {
            const { data: addresses } = await mysupabase
                .from("address")
                .select("*")
                .eq("user_id", currentuser?.id);

            // Ensure addresses is always an array
            setUserAddress(addresses ?? []);

            console.log(addresses, "this is user address");
        }

        if (currentuser?.id) {
            getSupabaseUser();
        }
    }, [currentuser, currentTab])

    function handleAddressCreated(address: any) {
        setUserAddress([address])
    }

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    {children}
                </DialogTrigger>
                <DialogContent className="max-w-[calc(100vw-20px)] p-3 md:p-5 md:max-w-[825px] h-[85vh] max-h-[600px] flex flex-col overflow-hidden">
                    <DialogHeader>
                        <DialogTitle className=' text-lg border-b pb-5 lg:text-2xl xl:text-4xl font-semibold text-start'>Select Address</DialogTitle>
                    </DialogHeader>
                    <Tabs defaultValue="address" className="w-full flex-1 flex flex-col min-h-0 overflow-hidden" value={currentTab} onValueChange={setcurrentTab}>





                        {/* 2. ADDRESS TAB */}
                        <TabsContent value="address" className="w-full flex-1 flex flex-col min-h-0 overflow-hidden focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 outline-none">

                            {/* If NOT Logged In → Show LoginForm */}
                            {!currentuser?.email && (
                                <div className="w-full flex-1 overflow-y-auto">
                                    <LoginForm />
                                </div>
                            )}

                            {currentuser?.email && Useraddress?.length === 0 && (
                                <div className="w-full flex-1 overflow-y-auto">
                                    <AddUserAddressForm handleperform={handleAddressCreated} />
                                </div>
                            )}
                            {currentuser?.email && Useraddress?.length > 0 && (
                                <CheckoutAddressSelect cartItems={cart} setConfirm={setcurrentTab} userAddress={Useraddress} appliedCoupon={appliedCoupon} currentUser={currentuser} />
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