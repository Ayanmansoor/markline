'use client'
import React, { useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SheetCartForm from './SheetCartForm'
import { OrderId } from '@/types/interfaces'

import { mysupabase } from '@/Supabase/SupabaseConfig'
import { getSelectedAddress } from '@/Supabase/SupabaseApi'


interface cartsheetProps{
    children:React.ReactNode
    closeSheet:()=>void
}

function CartSheetOderDailog({ children,closeSheet }:cartsheetProps) {
    const [currentTab, setcurrentTab] = useState('orders')
    const [orderId, setOrderID] = useState<OrderId>({
        orderID: "",
        email: "",
        username: ""
    })


    
    return (
        <Dialog>
            <DialogTrigger className='w-fit h-fit relative cursor-pointer'>{children}</DialogTrigger>
            <DialogContent className=" max-w-[calc(100vw-20px)]  sm:max-w-[500px]  md:max-w-[625px] p-3 sm:p-5">
                <DialogHeader>
                </DialogHeader>

                <Tabs defaultValue="orders" className="w-full min-h-[200px] md:min-h-[300px]" value={currentTab} onValueChange={setcurrentTab}  >
                    <TabsList className="w-full relative h-auto px-2">
                        <TabsTrigger value="orders" className="w-full relative h-auto text-center">Orders</TabsTrigger>
                    </TabsList>
                    <TabsContent value="orders">
                        <SheetCartForm setConfirm={setcurrentTab} setOrderID={setOrderID} closeSheet={closeSheet} />
                    </TabsContent>
                    {/* <TabsContent value="success" >
                        <PaymentOption username={orderId.username} email={orderId.email} orderID={orderId.orderID} />
                    </TabsContent> */}
                </Tabs>


            </DialogContent>
        </Dialog>
    )
}

export default CartSheetOderDailog

