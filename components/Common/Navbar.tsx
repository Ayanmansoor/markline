'use client'
import React, { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import MegaManu from './MegaManu'
import SearchSide from './SearchSide'
import CartSheet from './CartSheet'
import { PiShoppingCartLight } from 'react-icons/pi'
import SideBarNew from './SideBarNew'
// import { useCart } from '@/Contexts/Cart.context'
import { useCartContext } from '@/Contexts/Cart.context'
import NavUser from './NavUser'
import { CiSearch } from 'react-icons/ci'
import { MdKeyboardArrowDown } from 'react-icons/md'
import CummonMegaManu from './CummonMegaManu'
import { Search, ShoppingBag } from 'lucide-react'

function Navbar() {

    const { cart } = useCartContext();
    const [isOpen, setisOpen] = useState(false);
    const [isScrolled, setScrolled] = useState<boolean>(false)
    const route = useRouter()
    const path = usePathname()

    const listenScrollEvent = () => {
        if (window.scrollY > 10) {
            setScrolled(true);
        } else {
            setScrolled(false);
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", listenScrollEvent);
        return () => {
            window.removeEventListener("scroll", listenScrollEvent);
        };
    }, []);

    return (
        <nav className='sticky  w-full h-fit bg-transparent top-0 z-50 bg-white'>
            <section className={`  py-3 flex items-center justify-between gap-1 text-third  bg-white px-5 lg:px-10 xl:px-20 2xl:px-40`}>


                <div className='flex items-center gap-5'>
                    <Link href={'/'} className={`  lg:block hidden text-3xl md:text-3xl lg:text-4xl font-semibold md:font-semibold italic  text-primary  text-center `}>MARKLINE</Link>
                    <ul className={`  2xl:hidden items-center gap-2 relative md:gap-3    text-primary flex  `}>



                        <span className='lg:block hidden  ml-2'>
                            <MegaManu>
                                <Link href={"/collections"} className={`font-semibold  text-sm xl:text-sm flex items-center gap-2   text-primary `}>COLLECTIONS <MdKeyboardArrowDown className={`text-[20px] text-primary `} /></Link>
                            </MegaManu>
                        </span>
                        <CummonMegaManu urlProps='women'>
                            <Link href={"/products/women"} className={`font-semibold  text-sm xl:text-sm flex items-center gap-2   text-primary `}>WOMEN</Link>
                        </CummonMegaManu>
                        <CummonMegaManu urlProps='men'>
                            <Link href={"/products/men"} className={`font-semibold  text-sm xl:text-sm flex items-center gap-2   text-primary `}>MEN</Link>
                        </CummonMegaManu >

                        <Link href={"/new-arrivals"} className={`font-semibold   lg:flex hidden text-sm xl:text-sm  items-center gap-2   text-primary `}>NEW</Link>



                    </ul>

                </div>
                <ul className={`  2xl:flex hidden items-center gap-2 relative md:gap-3    text-primary  `}>



                    <span className='lg:block hidden  ml-2'>
                        <MegaManu>
                            <Link href={"/collections"} className={`font-semibold  text-sm xl:text-sm flex items-center gap-2   text-primary `}>COLLECTIONS <MdKeyboardArrowDown className={`text-[20px] text-primary `} /></Link>
                        </MegaManu>
                    </span>
                    <CummonMegaManu urlProps='women'>
                        <Link href={"/products/women"} className={`font-semibold  text-sm xl:text-sm flex items-center gap-2   text-primary `}>WOMEN</Link>
                    </CummonMegaManu>
                    <CummonMegaManu urlProps='men'>
                        <Link href={"/products/men"} className={`font-semibold  text-sm xl:text-sm flex items-center gap-2   text-primary `}>MEN</Link>
                    </CummonMegaManu >

                    <Link href={"/new-arrivals"} className={`font-semibold   lg:flex hidden text-sm xl:text-sm  items-center gap-2   text-primary `}>NEW</Link>



                </ul>

                <ul className='flex w-full lg:w-fit justify-between  lg:justify-end items-center gap-2 sm:gap-4 '>
                    <SideBarNew />
                    <Link href={'/'} className={` text-3xl md:text-3xl block lg:hidden italic lg:text-4xl font-semibold md:font-semibold   text-primary  text-center `}>MARKLINE</Link>

                    <div className='flex w-fit justify-end items-center gap-2 sm:gap-4'>

                        {
                            path != 'search' &&
                            <Search height={23} className='  cursor-pointer' onClick={(es) => route.push("/search")} />
                        }

                        <li className='flex gap-1 items-center text-p18 font-medium cursor-pointer'>
                            <Link href={"/carts"} className='relative h-auto w-auto'>
                                <ShoppingBag height={23} className='  text-primary' />
                                {
                                    cart.length > 0 &&
                                    <p className='p-1 h-fit rounded-full text-[12px] leading-[0.6] absolute -top-2 -right-1 flex items-center justify-center w-fit font-normal bg-gray-800 text-white'>{cart?.length}</p>
                                }
                            </Link>
                        </li>

                        <NavUser />

                    </div>
                </ul>
            </section>
        </nav>
    )
}

export default Navbar
