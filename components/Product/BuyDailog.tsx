import React, { useState } from 'react'
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
import PaymentOption from './PaymentOption'

import BuyComponent from './BuyComponent'
import { BuyDailogProps, orderData } from '@/types/interfaces'




function BuyDailog({ children, product }:BuyDailogProps) {


    const [currentTab,setcurrentTab]=useState('account')
    const [orderId,setOrderID]=useState<orderData>({
        orderID:"",
        email:"",
        username:""
    })

    




    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    {children}
                </DialogTrigger>
                <DialogContent className=" sm:max-w-[500px ]  md:max-w-[625px]">
                    <DialogHeader>
                        {/* <DialogTitle >Edit profile</DialogTitle>
                        <DialogDescription>
                            Make changes to your profile here. Click save when you're done.
                        </DialogDescription> */}
                    </DialogHeader>
                    <Tabs defaultValue="account" className="w-full min-h-[200px] md:min-h-[300px]"  value={currentTab} onValueChange={setcurrentTab}  >
                        <TabsList className="w-full relative h-auto px-2">
                            <TabsTrigger value="account" className='w-full relative h-auto flex items-center justify-center ' >Product</TabsTrigger>
                            <TabsTrigger value="address" className="w-full relative h-auto flex items-center justify-center"   >Address</TabsTrigger>
                            <TabsTrigger  value="password" className="w-full relative h-auto flex items-center justify-center" >Purchase</TabsTrigger>
                        </TabsList>
                        <TabsContent value="account" className='w-full relative h-auto pt-5 '>
                            <BuyComponent product={product}  />
                        </TabsContent>
                        <TabsContent value="address" className='w-full relative h-auto pt-5 '>
                            <AddressForm product={product} setConfirm={setcurrentTab} setOrderID={setOrderID} />
                        </TabsContent>
                        <TabsContent value="password" className='w-full relative h-auto pt-5'>
                            <PaymentOption orderID={orderId.orderID} email={orderId.email} username={orderId.username} />
                        </TabsContent>
                    </Tabs>

                    {/* <DialogFooter className='w-full relative h-auto border-t border-gray-200 pt-3 flex items-center justify-end gap-3 px-5'>
                            <button className='w-fit  relative h-auto bg-black text-white px-6 py-1'>Close</button>
                            <button className='w-fit bg-black text-white cursor-pointer  relative h-auto px-6 py-1'>Next</button>
                    </DialogFooter> */}
                </DialogContent>
            </Dialog>
        </>
    )
}

export default BuyDailog