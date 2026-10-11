'use client'
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import { addressDailogprops } from '@/types/interfaces'
import AddUserAddressForm from './AddUserAddressform'

function AddAdressSheet({ children, handleperform }: addressDailogprops) {
    const [open, setOpen] = useState(false)

    const onFormSuccess = (data: any) => {
        setOpen(false)
        handleperform && handleperform(data)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen} >
            <DialogTrigger className='w-fit justify-self-end' asChild>{children}</DialogTrigger>
            <DialogContent className='w-full max-w-[600px] max-h-[85vh] overflow-y-auto bg-white rounded-2xl p-4 md:p-6'>
                <AddUserAddressForm handleperform={onFormSuccess} hideHeader={true} className="border-none shadow-none p-0" />
            </DialogContent>
        </Dialog>
    )
}

export default AddAdressSheet
