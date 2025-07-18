'use client'
import React, { useMemo } from 'react'
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { BsPlus } from "react-icons/bs";
import { HiMiniMinusSmall } from "react-icons/hi2";
import CartSheetOderDailog from './CartSheetOderDailog';
import { useCart } from '@/Contexts/Cart.context';
import { Colors, ProductsProps, Sizes, updateQuantityProps } from '@/types/interfaces';
import { IoIosClose } from 'react-icons/io';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';


function CartSheet({ children }: {
    children: React.ReactNode

}) {
    const { cart, clearCart, updateQuantity, deleteFromCart } = useCart()
    const { totalPrice, totalDiscount, beforeDiscount } = useMemo(() => {
        let total = 0
        let discountSaved = 0
        let beforeDiscount = 0

        cart.forEach((item) => {
            const itemTotal = item.price * item.quantity
            beforeDiscount += itemTotal

            if (item.discounts && item.discounts.discount_persent) {
                const discount = (itemTotal * item.discounts.discount_persent) / 100
                total += itemTotal - discount
                discountSaved += discount
            } else {
                total += itemTotal
            }
        })

        return {
            totalPrice: total,
            totalDiscount: discountSaved,
            beforeDiscount: beforeDiscount
        }
    }, [cart])

    function increaseQuentity({ productId, quantity, color, size }: updateQuantityProps) {
        if (quantity >= 1 && quantity <=5) {
            updateQuantity({ productId, quantity: quantity + 1, color, size })
        }
    }

    function decreaseQuentity({ productId, quantity, color, size }: updateQuantityProps) {
        if (quantity != 1) {
            if (quantity >= 1) {
                updateQuantity({ productId, quantity: quantity - 1, color, size })
            }
        }
    }




    return (
        <Sheet>
            <SheetTrigger className='w-fit h-fit relative '>{children}</SheetTrigger>
            <SheetContent className="py-5  px-2 max-w-[550px] md:min-w-[550px] h-full  overflow-y-auto" id="style-3">
                <SheetHeader>
                    <SheetTitle className="font-medium text-2xl border-b pb-2 text-start">Carts</SheetTitle>


                    <section className='w-full relative h-fit gap-2 grid grid-cols-1 extrasmall:grid-cols-2 md:flex flex-col max-h-[50vh] overflow-y-auto py-2' id="style-3">
                        {
                            cart.length > 0 ?

                                cart.map((item, index) => (
                                    <div className='w-full border p-2 rounded-lg relative h-auto flex flex-col   md:grid  md:grid-cols-[100px_2fr_auto_auto]  items-start md:items-center justify-between gap-1' key={index}>


                                        <Swiper
                                            pagination={{
                                                dynamicBullets: true,
                                            }}
                                            modules={[Pagination]}
                                            className="mySwiper w-full relative h-full "
                                        >
                                            {
                                                item.image_urls?.map((image: any) => JSON.parse(image))?.map((image: any, index: number) => (
                                                    <SwiperSlide className=' w-full  md:w-[100px] max-h-[150px] extrasmall:max-h-[100px] md:max-h-[100px] relative ' key={index}>
                                                        <img src={image.image_url} alt={image?.name} className='w-full relative max-h-full  aspect-square  object-contain rounded-md border' loading='lazy' height={400} width={300} />
                                                    </SwiperSlide>
                                                ))
                                            }


                                        </Swiper>

                                        <button className='w-fit absolute -top-1 right-0 bg-black text-white  h-auto p-[2px] z-10 cursor-pointer rounded-full ' onClick={() => deleteFromCart(item.productId, item.color.name, item.size.size)}><IoIosClose /></button>
                                        <span className='flex flex-col items-start  '>
                                            <p className=' text-[10px]  font-normal text-gray-400 '></p>
                                            <h2 className=' text-sm text-start lg:text-sm font-medium text-foreground line-clamp-2 '>
                                                {item.name}
                                            </h2>
                                            <div className='w-full reltive h-auto flex items-center gap-1'>
                                                <p className='text-foreground text-xs font-medium  sm:flex-row flex-col items-start sm:items-center gap-1'>
                                                    <strong className='text-foreground text-[10px]'>Size : </strong>
                                                    {item?.size?.size} {item?.size?.unit}
                                                </p>
                                                <p className='text-foreground text-xs font-medium  sm:flex-row flex-col items-start sm:items-center gap-1 capitalize'>
                                                    <strong className='text-foreground text-[10px]'>Color : </strong>
                                                    {item?.color?.name}
                                                </p>
                                            </div>
                                        </span>
                                        <div className='flex items-center  justify-between gap-1 rounded-full border border-gray-400 py-[2px] px-1 sm:w-fit w-full '>
                                            <button className='w-fit h-fit relative rounded-full p-[2px] bg-gray-200' onClick={() => decreaseQuentity({ productId: item.productId, quantity: item.quantity, color: item.color, size: item.size })} >
                                                <HiMiniMinusSmall className='text-[15px] ' />
                                            </button>
                                            <p className='text-[12px] font-normal text-foreground px-[2px]'>{item?.quantity}</p>

                                            <button className='w-fit h-fit relative rounded-full p-[2px]  bg-gray-200' onClick={() => increaseQuentity({ productId: item.productId, quantity: item.quantity, size: item.size, color: item.color })}>
                                                <BsPlus className='text-[12x]' />
                                            </button>
                                        </div>
                                        <span className='w-full item-start relative h-auto flex flex-col  px-2' >
                                            <h2 className='text-lg text-start font-medium text-foreground'>₹ {
                                                item?.price * item?.quantity
                                            }</h2>
                                            {
                                                item?.discounts?.discount_persent &&
                                                < p className='text-red-400 line-through text-sm flex items-center gap-1'>{item?.discounts?.discount_persent}%</p>
                                            }
                                        </span>
                                    </div>
                                ))

                                :
                                <div className='text-p20 font-medium py-10 px-5 bg-gray-100 flex items-center justify-center   text-primary'>
                                    Your Cart Is Empty  :)
                                </div>
                        }
                    </section>

                    <SheetFooter className='absolute bottom-5 w-full left-0 bg-white '>
                        {
                            totalPrice > 0 &&
                            <section className='w-full relative z-30 p-3 h-fit  flex flex-col gap-2 border bg-white  '>
                                <h2 className='text-base font-semibold text-primary text-start'>After Discount</h2>
                                <span className='w-full relative h-auto bg-gray-100 flex items-center  justify-center px-3 py-1'>
                                    <p className='text-base w-full font-medium text-foreground '>Total </p>
                                    <p className='text-lg font-medium text-primary w-full'>₹ {beforeDiscount}</p>
                                </span>
                                {
                                    totalDiscount<0 &&
                                    <span className='w-full relative h-auto  flex items-center  justify-center px-3 py-1 '>
                                        <p className=' text-sm w-full font-medium text-foreground '>Discount</p>
                                        <p className='text-sm text-red-400 line-through font-medium text-primary w-full '>₹ {Math.floor(totalDiscount)}</p>
                                    </span>
                                }

                                <div className='w-fulll border-t pt-2  relative h-auto px-3 flex items-center justify-between'>
                                    <p className='text-sm sm:text-base md:text-lg font-medium w-full text-primary'>Price To Pay</p>
                                    <p className='text-lg font-medium text-primary w-full'>₹ {Math.floor(totalPrice)}</p>
                                </div>
                                <div className='w-full relative h-auto flex items-start justify-end'>
                                    {/* <button className='w-fit relative h-auto flex items-center border text-sm md:text-base border-primary px-4 md:px-5 py-2 text-nowrap hover:bg-primary hover:text-white  font-medium text-primary' onClick={() => clearCart()} >Clear Orders</button> */}
                                    <CartSheetOderDailog>
                                        <button className='w-fit relative h-auto flex items-center  text-sm md:text-base border border-primary px-4 md:px-5 py-2 text-nowrap bg-primary  text-white  font-medium text-primary'>Place Order</button>
                                    </CartSheetOderDailog>
                                </div>

                            </section>
                        }
                    </SheetFooter>

                </SheetHeader>
            </SheetContent>
        </Sheet >
    )
}

export default CartSheet