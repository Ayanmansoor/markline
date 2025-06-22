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
import PaymentOption from './PaymentOption'

import BuyComponent from './BuyComponent'
import { BuyDailogProps, orderData } from '@/types/interfaces'




function BuyDailog({ children, product }: BuyDailogProps) {


    const [currentTab, setcurrentTab] = useState('account')
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




    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    {children}
                </DialogTrigger>
                <DialogContent className=" max-w-[calc(100vw-20px)]  sm:max-w-[500px ] p-3 md:p-5  md:max-w-[625px]">
                    <DialogHeader>
                        <DialogTitle className=' text-lg border-b pb-5 lg:text-2xl xl:text-4xl font-semibold text-start'>Process Order</DialogTitle>
                    </DialogHeader>
                    <Tabs defaultValue="account" className=" w-full min-h-[200px] md:min-h-[300px]" value={currentTab} onValueChange={setcurrentTab}  >

                        <TabsContent value="account" className='w-full relative h-auto rounded-md  '>
                            <BuyComponent product={product} />
                        </TabsContent>
                        <TabsContent value="address" className='w-full relative h-auto  '>
                            <AddressForm product={product} setConfirm={setcurrentTab} setOrderID={setOrderID} />
                        </TabsContent>
                        
                      

                        <TabsList className="w-full relative h-auto px-2 mt-4 flex items-center bg-transparent justify-end gap-2 lg:gap-10">
                                    {
                                        (currentTab !== "password" && currentTab !== "address") &&
                                        <>
                                            <TabsTrigger value="account" className='w-fit bg-black py-2 border px-5 lg:px-20 text-white text-base relative h-auto flex items-center justify-center '>Back</TabsTrigger>
                                            <TabsTrigger value="address" className="w-fit bg-black border text-base  text-white px-5 lg:px-20 py-2 relative h-auto flex items-center justify-center">Next</TabsTrigger>
                                        </>

                                    }
                        </TabsList>

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