'use client'
import React, { useRef, useState } from 'react'
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

function Navbar() {

    const { cart } = useCartContext();
    const [isOpen, setisOpen] = useState(false);
    const route = useRouter()
    const path = usePathname()

    return (
        <nav className='bg-white sticky  top-0  z-50'>
            <section className='  container  py-2 flex items-center justify-between gap-1 text-third   bg-white px-3 md:px-5    '>
                <Link href={'/'} className='text-h1 font-semibold md:font-meidum  italic text-primary '>MARKLINE</Link>

                <ul className='hidden items-center gap-3 relative md:gap-5  xl:gap-5 lg:flex '>

                    <Link href={"/products/women"} className="bg-transparent font-semibold  text-gray-800 p-0 text-base xl:text-lg">WOMEN</Link>
                    <Link href={"/products/men"} className="bg-transparent font-semibold  text-gray-800 p-0 text-base xl:text-lg">MEN</Link>
                    <MegaManu>
                        <Link href={"/collections"} className=" font-semibold text-gray-800 text-base xl:text-lg ">COLLECTIONS</Link>
                    </MegaManu>

                    <Link href={"/about-us"} className="bg-transparent font-semibold  p-0 text-gray-800 text-base xl:text-lg">ABOUT US</Link>
                    <Link href={"/new-arrivals"} className="bg-transparent font-semibold   p-0 text-primary text-base xl:text-lg  px-3">NEW ARRIVALS</Link>
                </ul>

                <ul className='flex items-center gap-2 sm:gap-4'>

                    {/* <SearchSide /> */}
                    {
                        path != 'search' &&
                        <CiSearch className='text-[25px] cursor-pointer' onClick={(es) => route.push("/search")} />
                    }
                    {/* <li className=' gap-1 items-center flex  text-p18 font-semibold  cursor-pointer'><Link to={'/account'} ><IoPersonOutline className='text-[23px]' /></Link></li> */}
                    <li className='flex gap-1 items-center text-p18 font-medium cursor-pointer  '>
                        <CartSheet>
                            <section className='relative h-auto w-auto '>
                                <PiShoppingCartLight className='text-[24px] text-primary' />
                                {
                                    cart.length > 0 &&
                                    <p className='p-1 h-fit rounded-full text-[12px] leading-[0.6] absolute -top-2 -right-1 flex items-center justify-center  w-fit  font-normal bg-gray-800 text-white'>{cart?.length}</p>

                                }
                            </section>
                        </CartSheet>

                    </li>
                    <NavUser />

                    <SideBarNew />

                </ul>


            </section>
        </nav>
    )
}

export default Navbar