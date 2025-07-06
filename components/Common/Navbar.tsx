'use client'
import React, { useRef, useState } from 'react'
import Link from 'next/link'
import MegaManu from './MegaManu'
import SearchSide from './SearchSide'
import CartSheet from './CartSheet'
import { PiShoppingCartLight } from 'react-icons/pi'
import SideBarNew from './SideBarNew'
import { useCart } from '@/Contexts/Cart.context'
import NavUser from './NavUser'

function Navbar() {

    const { cart, addToCart, deleteFromCart, clearCart } = useCart();
    const [isOpen, setisOpen] = useState(false);
 

    return (
        <nav className='bg-white sticky  top-0  z-50'>
            <section className='  container  py-2 flex items-center justify-between gap-1 text-third   bg-white   '>
                <Link href={'/'} className='text-h1 font-semibold md:font-meidum  italic text-primary '>MARKLINE</Link>

                <ul className='hidden items-center gap-3 relative md:gap-5  xl:gap-5 lg:flex '>

                    <Link href={"/products/women"} className="bg-transparent font-semibold  text-gray-800 p-0 text-lg">Products</Link>

                    <MegaManu>
                        <Link href={"/collections"} className=" font-semibold text-gray-800 ">Collections</Link>
                    </MegaManu>

                    <Link href={"/about-us"} className="bg-transparent font-semibold  p-0 text-gray-800 text-lg">About us</Link>
                    <Link href={"/new-arrivals"} className="bg-transparent font-semibold   p-0 text-gray-800 text-lg">New Arrivals</Link>
                </ul>

                <ul className='flex items-center gap-2 sm:gap-4'>

                    <SearchSide />
                    {/* <li className=' gap-1 items-center flex  text-p18 font-semibold  cursor-pointer'><Link to={'/account'} ><IoPersonOutline className='text-[23px]' /></Link></li> */}
                    <li className='flex gap-1 items-center text-p18 font-medium cursor-pointer  '>
                        <CartSheet>
                            <section className='relative h-auto w-auto '>
                                <PiShoppingCartLight className='text-[24px]' />
                                <p className='p-1 h-fit rounded-full text-[12px] leading-[0.6] absolute -top-2 -right-1 flex items-center justify-center  w-fit  font-normal bg-gray-800 text-white'>{cart?.length}</p>
                            </section>
                        </CartSheet>

                    </li>
                    <NavUser/>

                    <SideBarNew />

                </ul>


            </section>
        </nav>
    )
}

export default Navbar