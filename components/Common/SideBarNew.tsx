'use client'
import React, { useState } from 'react';
import { IoIosArrowForward } from "react-icons/io";
import Link from 'next/link';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { RiArrowRightSLine } from "react-icons/ri";
import { RxHamburgerMenu } from "react-icons/rx";

function SideBarNew() {
    const [open, setOpen] = useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <li className='h-fit w-fit relative block lg:hidden  rounded-sm p-[1px]  ' onClick={() => setOpen(true)}>
                    <RxHamburgerMenu className='text-primary text-[30px]' />
                </li>
            </SheetTrigger>

            <SheetContent className='p-0 py-5 ' >
                <SheetTitle className='text-xl font-medium text-primary italic px-2  border-b  py-2 '>Markline</SheetTitle>
                <ul className='w-full relative flex flex-col gap-2 items-start py-10 justify-start px-2 h-[100vh]'>
                    <Link href="/" onClick={handleClose} className="text-xl px-2 py-1 cursor-pointer text-primary font-medium border   flex items-center justify-between gap-0 w-full">Home
                        <RiArrowRightSLine className='text-[40px] text-primary cursor-pointer border-l  px-1 py-1' />
                    </Link>
                    <Link href="/collections" onClick={handleClose} className="text-xl px-2 py-1 cursor-pointer text-primary font-medium border   flex items-center justify-between gap-0 w-full">Collections
                        <RiArrowRightSLine className='text-[40px] text-primary cursor-pointer border-l  px-1 py-1' />
                    </Link>
                    <Link href="/products/women" onClick={handleClose} className="text-xl cursor-pointer px-2 py-1 text-primary font-medium border   flex items-center justify-between gap-0 w-full">Products
                        <RiArrowRightSLine className='text-[40px] text-primary cursor-pointer border-l  px-1 py-1' />
                    </Link>
                    <Link href="/new-arrivals" onClick={handleClose} className="text-xl cursor-pointer  px-2 py-1 text-primary font-medium border   flex items-center justify-between gap-0 w-full">New Arrivals
                        <RiArrowRightSLine className='text-[40px] text-primary cursor-pointer border-l  px-1 py-1' />
                    </Link>
                    <Link href="/trending" onClick={handleClose} className="text-xl cursor-pointer text-primary px-2 py-1 font-medium border   flex items-center justify-between gap-0 w-full">Trending
                        <RiArrowRightSLine className='text-[40px] text-primary cursor-pointer border-l  px-1 py-1' />
                    </Link>
                    <Link href="/about-us" onClick={handleClose} className="text-xl cursor-pointer text-primary font-medium border px-2 py-1   flex items-center justify-between gap-0 w-full">About us
                        <RiArrowRightSLine className='text-[40px] text-primary cursor-pointer border-l  px-1 py-1 ' />
                    </Link>
                </ul>
            </SheetContent>
        </Sheet>
    );
}

export default SideBarNew;
