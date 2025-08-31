'use client'
import React from 'react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import ProductFilter from './ProductFilter'
import { CollectionCardProps, ProdcutFilterProps } from '@/types/interfaces'


export default function MobFilterSheet({ collection ,productRangevalue,setPRoductRange ,children}:ProdcutFilterProps) {
    return (
        <Sheet >
            <SheetTrigger className='w-auto h-auto  block  md:hidden '>{children}</SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle className="text-lg font-medium text-foreground pb-3 border-b ">Use Filter </SheetTitle>
                    <SheetDescription className="w-full  h-auto">
                    {/* <ProductFilter collection={collection} productRangevalue={productRangevalue} setPRoductRange={setPRoductRange} /> */}
                    </SheetDescription>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    )
}
