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
import { BuyDailogProps, newBuyDailogProps, orderData, userinterfce } from '@/types/interfaces'
import { mysupabase } from '@/Supabase/SupabaseConfig'




function BuyDailog({ children, product ,selectedVariant}: newBuyDailogProps) {
    const [currentTab, setcurrentTab] = useState('account')
    const [currentuser, setUser] = useState<userinterfce >();
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
    }
    getSupabaseUser()
  }, [])




    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    {children}
                </DialogTrigger>
                <DialogContent className=" max-w-[calc(100vw-20px)]   p-3 md:p-5  md:max-w-[825px]">
                    <DialogHeader>
                        <DialogTitle className=' text-lg border-b pb-5 lg:text-2xl xl:text-4xl font-semibold text-start'>Process Order</DialogTitle>
                    </DialogHeader>
                    <Tabs defaultValue="account" className=" w-full min-h-[200px] md:min-h-[300px]" value={currentTab} onValueChange={setcurrentTab}  >

                        
                        <TabsContent value="account" className='w-full relative h-auto rounded-md  '>
                            <BuyComponent product={product} user={currentuser} setConfirm={setcurrentTab} variant={selectedVariant} />
                        </TabsContent>
                        
                       {
                            ( !currentuser?.email) &&
                            <TabsContent value="address" className='w-full relative h-auto'>
                                <AddressForm product={product} setConfirm={setcurrentTab} setOrderID={setOrderID} variant={selectedVariant}  />
                            </TabsContent>
                        }

                        

                        
                                {
                                    ( !currentuser?.email) &&
                                    <TabsList className="w-full relative h-auto px-2 mt-4 flex items-center bg-transparent justify-end gap-2 lg:gap-10">
                                        {
                                        (currentTab !== "password" && currentTab !== "address") &&
                                        <TabsTrigger
                                            value="address"
                                            className="w-fit bg-black border text-base text-white px-5 lg:px-20 py-2 relative h-auto flex items-center justify-center"
                                        >
                                            Next
                                        </TabsTrigger>
                                        }
                                    </TabsList>
                                }

                    </Tabs>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default BuyDailog