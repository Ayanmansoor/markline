import React from 'react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { CiSearch } from "react-icons/ci";

function SearchSide() {
    return (
        <Sheet>
            <SheetTrigger className='w-fit h-auto relative'>
                <li className=' '>
                    <CiSearch className='text-[25px] cursor-pointer' onClick={(es) => (console.log("will open search page "))} />
                </li>
            </SheetTrigger>
            <SheetContent   className=" min-w-[80%] lg:min-w-[50%]">
                <SheetHeader>
                    <SheetTitle className='text-lg font-medium text-primary border-b pb-2 '>Search Products</SheetTitle>
                </SheetHeader>
                <section className='w-ful mt-3 relative h-auto  flex items-center justify-center flex-col '>
                    <form action='' className='w-full relative h-auto flex items-center rounded-full   border '>
                        <input type="text" className='w-full relative rounded-l-full h-auto border-none py-1  px-3 text-base placeholder:text-sm' placeholder='Search.... ' />
                        <button className='w-fit relative rounded-r-full h-full py-[5px] px-3 bg-primary text-white text-sm '>Search</button>
                    </form>

                </section>
            </SheetContent>
        </Sheet>
    )
}

export default SearchSide