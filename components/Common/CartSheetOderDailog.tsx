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
            <DialogContent className="max-w-[calc(100vw-24px)] sm:max-w-[500px] md:max-w-[625px] p-4 sm:p-6 rounded-2xl border border-zinc-200/80 shadow-2xl bg-white">
                <DialogHeader className="text-left pb-2">
                    <DialogTitle className="text-lg font-bold tracking-tight text-zinc-900">
                        Complete Order
                    </DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="orders" className="w-full min-h-[200px] md:min-h-[300px]" value={currentTab} onValueChange={setcurrentTab}>
                    <TabsList className="w-full relative h-auto p-1 bg-zinc-100 rounded-xl mb-3">
                        <TabsTrigger value="orders" className="w-full text-xs font-semibold uppercase tracking-wider py-2 data-[state=active]:bg-white data-[state=active]:text-zinc-900 data-[state=active]:shadow-sm rounded-lg">
                            Delivery & Payment
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="orders">
                        <SheetCartForm setConfirm={setcurrentTab} setOrderID={setOrderID} closeSheet={closeSheet} />
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}

export default CartSheetOderDailog

