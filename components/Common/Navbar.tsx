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
            <section className={`  py-3 flex items-center justify-between gap-1 text-third px-3 md:px-5 bg-white`}>

                <ul className={` items-center gap-3 relative md:gap-5 xl:gap-5 flex  text-primary `}>
                    {/* <Link href={"/products/women"} className="bg-transparent font-medium  p-0 text-base xl:text-base">WOMEN</Link>
                    <Link href={"/products/men"} className="bg-transparent font-medium  p-0 text-base xl:text-base">MEN</Link> */}
                    <SideBarNew />
                    <span className='lg:block hidden'>
                        <MegaManu>
                            <Link href={"/collections"} className={`font-semibold  text-base xl:text-lg flex items-center gap-2   text-primary `}>COLLECTIONS <MdKeyboardArrowDown className={`text-[20px] text-primary `} /></Link>
                        </MegaManu>
                    </span>

                    {/* <Link href={"/about-us"} className="bg-transparent font-medium p-0  text-base xl:text-base">ABOUT US</Link>
                    <Link href={"/new-arrivals"} className="bg-transparent font-medium p-0     text-base xl:text-base px-3">NEW ARRIVALS</Link> */}
                </ul>
                <Link href={'/'} className={` text-3xl md:text-4xl lg:text-5xl font-semibold md:font-semibold   text-primary  `}>MARKLINE</Link>

                <ul className='flex items-center gap-2 sm:gap-4'>
                    {
                        path != 'search' &&
                        <CiSearch className='text-[30px] cursor-pointer' onClick={(es) => route.push("/search")} />
                    }

                    <li className='flex gap-1 items-center text-p18 font-medium cursor-pointer'>
                        <CartSheet>
                            <section className='relative h-auto w-auto'>
                                <PiShoppingCartLight className='text-[30px] text-primary' />
                                {
                                    cart.length > 0 &&
                                    <p className='p-1 h-fit rounded-full text-[12px] leading-[0.6] absolute -top-2 -right-1 flex items-center justify-center w-fit font-normal bg-gray-800 text-white'>{cart?.length}</p>
                                }
                            </section>
                        </CartSheet>
                    </li>

                    <NavUser />
                </ul>
            </section>
        </nav>
    )
}

export default Navbar
