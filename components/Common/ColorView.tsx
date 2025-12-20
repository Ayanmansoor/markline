import React from 'react'

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

import { ColorViewProps } from '@/types/interfaces'

function ColorView({children,colors,images}:ColorViewProps) {
    return (
        <Sheet>
            <SheetTrigger>{children}</SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Available colors</SheetTitle>
                    <SheetDescription>

                        This action cannot be undone. This will permanently delete your account
                        and remove your data from our servers.

                    </SheetDescription>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    )
}

export default ColorView