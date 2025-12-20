
'use client'
import React, { useEffect, useMemo, useState } from 'react'
import CartCard from './CartCard'
import Link from 'next/link'
import { ArrowLeft, MessageSquare, Truck } from 'lucide-react'
import { Lock } from 'lucide-react'
// import { useCartContext } from '@/context/ProductContext'
import { toast } from 'sonner'
// import CheckoutButton from '../Razorpays/CommonRazorpay'
import CartSkeleton from '../Skeleton/CartSkeleton'
import { useCartContext } from '@/Contexts/Cart.context'
import Checkout from './Checkout'

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
};

const calculateDiscountedPrice = (price: number, discountPercent: number) => {
    if (discountPercent > 0) {
        const discountAmount = price * (discountPercent / 100);
        return price - discountAmount;
    }
    return price;
};

function CartSection() {
    const { cart, clearCart } = useCartContext()

    const [loading, setLoading] = useState(true)

    const { totalOriginalPrice, totalDiscountAmount, finalCartTotal } = useMemo(() => {
        let totalOriginalPrice = 0; // Sum of (unit price * quantity)
        let totalDiscountAmount = 0; // Sum of (discount amount * quantity)
        let finalCartTotal = 0; // Sum of (discounted unit price * quantity)

        cart.forEach((item) => {
            const unitPrice = item.variant.price;
            const quantity = item.quantity;
            const discountPercent = item.variant.discounts?.discount_persent || 0;

            // 1. Calculate Original Price for this item
            const originalItemTotal = unitPrice * quantity;
            totalOriginalPrice += originalItemTotal;

            // 2. Calculate Discounted Price for this item
            const discountedUnitPrice = calculateDiscountedPrice(unitPrice, discountPercent);
            const discountedItemTotal = discountedUnitPrice * quantity;
            finalCartTotal += discountedItemTotal;

            // 3. Calculate Total Discount Amount
            const discountPerUnit = unitPrice - discountedUnitPrice;
            const itemDiscountTotal = discountPerUnit * quantity;
            totalDiscountAmount += itemDiscountTotal;
        });

        return {
            totalOriginalPrice: Math.round(totalOriginalPrice),
            totalDiscountAmount: Math.round(totalDiscountAmount),
            finalCartTotal: Math.round(finalCartTotal),
        };
    }, [cart]);



    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false)
        }, 1500) // simulate loading
        return () => clearTimeout(timer)
    }, [])

    function clearCard() {
        clearCart()
        toast("All Cart Has been delete")
    }


    return (
        <section className='grid grid-cols-1 lg:grid-cols-[2fr_.7fr] gap-5 items-start justify-between px-5 xl:px-10 2xl:px-40 py-10'>

            <section className=' flex flex-col gap-10 lg:gap-20 '>


                <section className='flex flex-col gap-4 md:border border-gray-200  bg-white rounded-2xl p-4 md:p-4 '>
                    <div className='w-full relative h-auto flex items-center justify-between gap-1'>
                        <h2 className='text-xl font-semibold text-primary '> Carts Items </h2>

                        {
                            cart.length > 0 &&
                            <button onClick={clearCard} className='w-fit px-5 text-primary py-1 rounded-full justify-self-end   self-end   text-sm  cursor-pointer '>Clear Cart</button>
                        }
                    </div>


                    <div className='w-full relative grid grid-cols-2 sm:flex sm:flex-col gap-2.5 sm:gap-3 max-h-[700px] min-h-[500px] h-full overflow-y-auto  '>
                        {loading ? (
                            Array.from({ length: 4 }).map((_, index) => (
                                <CartSkeleton key={index} />
                            ))
                        ) : cart.length > 0 ? (
                            cart.map((item, index) => (
                                <CartCard key={index} data={item} />
                            ))
                        ) : (
                            <div className='text-base  border border-gray-300   font-medium text-primary text-center py-5 rounded-lg px-2'>
                                Cart is empty
                            </div>
                        )}

                        <Link href={'/products'} className="text-base font-medium absolute bottom-0 text-text-primary sm:flex hidden cursor-pointer bg-gray-200 px-3 py-2 rounded-lg items-center gap-2 mt-2 w-fit">
                            <ArrowLeft height={20} className='text-text-primary' />
                            Back to shop
                        </Link>
                    </div>

                </section>
                <div className='w-full  items-center  grid grid-cols-2 lg:grid-cols-3 relative    justify-between gap-2.5'>

                    <span className='flex items-center gap-2'>
                        <span className='bg-gray-200 rounded-full p-2.5 border border-gray-50'>
                            <Lock className='text-text-primary ' height={20} width={20} />
                        </span>
                        <span className='flex flex-col '>
                            <p className=' text-sm md:text-base lg:text-lg font-semibold text-text-primary'>
                                Secure payment
                            </p>
                            <p className='text-text-primary font-medium text-xs md:text-sm  '>Have you ever finally just </p>
                        </span>
                    </span>

                    <span className='flex items-center gap-2'>
                        <span className='bg-gray-200 rounded-full p-2.5 border border-gray-50'>
                            <MessageSquare className='text-text-primary ' height={20} width={20} />
                        </span>
                        <span className='flex flex-col '>
                            <p className='text-sm md:text-base lg:text-lg font-semibold text-text-primary'>
                                Secure payment
                            </p>
                            <p className='text-text-primary font-medium  text-xs md:text-sm '>Have you ever finally just </p>
                        </span>
                    </span>

                    <span className='flex items-center gap-2 col-span-2 sm:col-span-1'>
                        <span className='bg-gray-200 rounded-full p-2.5 border border-gray-50'>
                            <Truck className='text-text-primary ' height={20} width={20} />
                        </span>
                        <span className='flex flex-col '>
                            <p className='text-sm md:text-base lg:text-lg font-semibold text-text-primary'>
                                Secure payment
                            </p>
                            <p className='text-text-primary font-medium  text-xs md:text-sm  '>Have you ever finally just </p>
                        </span>
                    </span>



                </div>

            </section>

            <div className='w-full sticky top-20 h-fit  flex flex-col gap-5 bg-white '>
                {/* <Applycoupon setCouponValue={setCoupon} /> */}
                <Checkout
                    totalMrp={totalOriginalPrice}
                    totaldiscount={totalDiscountAmount}
                    totalPrice={finalCartTotal} coupondiscount={0} />

            </div>



        </section>
    )
}

export default CartSection