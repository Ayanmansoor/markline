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
            <DialogContent className='w-full max-w-[560px] max-h-[85vh] overflow-y-auto bg-white rounded-2xl border border-zinc-200/80 shadow-2xl p-5 md:p-6'>
                <AddUserAddressForm handleperform={onFormSuccess} hideHeader={false} className="border-none shadow-none p-0" />
            </DialogContent>
        </Dialog>
    )
}

export default AddAdressSheet
