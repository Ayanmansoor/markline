import React, { useState } from 'react'
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
import PaymentOption from './PaymentOption'
import { OrderId } from '@/types/interfaces'



function CartSheetOderDailog({ children }: { children: React.ReactNode }) {
    const [currentTab, setcurrentTab] = useState('orders')

    const [orderId, setOrderID] = useState<OrderId>({
        orderID: "",
        email: "",
        username: ""
    })

    return (
        <Dialog>
            <DialogTrigger className='w-fit h-fit relative cursor-pointer'>{children}</DialogTrigger>
            <DialogContent className=" sm:max-w-[500px]  md:max-w-[625px]">
                <DialogHeader>
                </DialogHeader>

                <Tabs defaultValue="orders" className="w-full min-h-[200px] md:min-h-[300px]" value={currentTab} onValueChange={setcurrentTab}  >
                    <TabsList className="w-full relative h-auto px-2">
                        <TabsTrigger value="orders" className="w-full relative h-auto text-center">Orders</TabsTrigger>
                        {
                            currentTab == "success" &&
                            <TabsTrigger value="success" className="w-full relative h-auto text-center">Success</TabsTrigger>
                        }
                    </TabsList>
                    <TabsContent value="orders">
                        <SheetCartForm setConfirm={setcurrentTab} setOrderID={setOrderID} />
                    </TabsContent>
                    <TabsContent value="success" >
                        <PaymentOption username={orderId.username} email={orderId.email} orderID={orderId.orderID} />
                    </TabsContent>
                </Tabs>


            </DialogContent>
        </Dialog>
    )
}

export default CartSheetOderDailog