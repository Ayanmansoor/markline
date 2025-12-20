import React from 'react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

import ProductFilter from '../Common/ProductFilter'
import { ProdcutFilterProps } from '@/types/interfaces'

export default function MobFilterSheet({ collection, productRangevalue, setPRoductRange, children }: ProdcutFilterProps) {
    return (
        <Sheet >
            <SheetTrigger className='w-auto h-auto   '>{children}</SheetTrigger>
            <SheetContent className='px-2'>
                <SheetHeader>
                    <SheetTitle className="text-lg font-medium text-start text-foreground pb-3 border-b ">Use Filter </SheetTitle>
                    <SheetDescription className="w-full  h-auto px-0">
                        {/* <ProductFilter collection={collection} productRangevalue={productRangevalue} setPRoductRange={setPRoductRange} colors={[]} sizes={[]} /> */}
                    </SheetDescription>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    )
}
