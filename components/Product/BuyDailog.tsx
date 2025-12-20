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
import AddressForm from './AddressForm'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


import BuyComponent from './BuyComponent'
import { AddressProps, BuyDailogProps, newBuyDailogProps, orderData, userinterfce } from '@/types/interfaces'
import { mysupabase } from '@/Supabase/SupabaseConfig'
import { getSelectedAddress } from '@/Supabase/SupabaseApi'
import SelectOrder from '../Common/SelectAddress'
import { UserAddressProvider } from '@/Contexts/UserAddressProvider'
import LoginForm from '../Common/FlowLoginForm'
import AddUserAddressForm from '../users/AddUserAddressform'




function BuyDailog({ children, product, selectedVariant }: newBuyDailogProps) {
    const [currentTab, setcurrentTab] = useState('account')
    const [currentuser, setUser] = useState<userinterfce>();
    const [Useraddress, setUserAddress] = useState<AddressProps[]>([]);

    const [orderId, setOrderID] = useState<orderData>({
        orderID: "",
        email: "",
        username: ""
    })
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

    // useEffect(() => {
    //     if (currentuser?.id) {
    //         const fetchAddress = async () => {
    //             const address = await getSelectedAddress(currentuser?.id);
    //             setUserAddress(address);

    //         };
    //         fetchAddress();
    //     }
    // }, [currentuser]);

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
                <DialogContent className=" max-w-[calc(100vw-20px)]   p-3 md:p-5  md:max-w-[825px]">
                    <DialogHeader>
                        <DialogTitle className=' text-lg border-b pb-5 lg:text-2xl xl:text-4xl font-semibold text-start'>Seleted Items</DialogTitle>
                    </DialogHeader>
                    <Tabs defaultValue="account" className="w-full h-full" value={currentTab} onValueChange={setcurrentTab}>


                        {/* 1. BUY DETAILS TAB */}
                        <TabsContent value="account" className="w-full min-h-[400px]">
                            <BuyComponent
                                product={product}
                                user={currentuser}
                                setConfirm={setcurrentTab}
                                variant={selectedVariant}
                            />
                        </TabsContent>


                        {/* 2. ADDRESS TAB */}
                        <TabsContent value="address" className="w-full min-h-[400px]">

                            {/* If NOT Logged In → Show LoginForm */}
                            {!currentuser?.email && (
                                <LoginForm />
                            )}

                            {/* If Logged In → Show AddUserAddressForm if no address */}
                            {currentuser?.email && Useraddress?.length === 0 && (
                                <AddUserAddressForm handleperform={handleAddressCreated} />
                            )}

                            {/* If Logged In → Show SelectOrder if user has addresses */}
                            {currentuser?.email && Useraddress?.length > 0 && (
                                <SelectOrder
                                    product={product}
                                    user={currentuser}
                                    userAddress={Useraddress}
                                    setConfirm={setcurrentTab}
                                    variant={selectedVariant}
                                />
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

export default BuyDailog