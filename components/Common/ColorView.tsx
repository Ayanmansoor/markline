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
                    <SheetTitle className="text-base font-bold text-zinc-900">Available Colors</SheetTitle>
                    <SheetDescription className="text-xs text-zinc-500">
                        Explore available colorways and variants.
                    </SheetDescription>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    )
}

export default ColorView