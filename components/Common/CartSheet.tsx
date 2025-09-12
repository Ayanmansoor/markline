'use client'
import React, { useEffect, useMemo, useState } from 'react'
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { mysupabase } from '@/Supabase/SupabaseConfig';
import { BsPlus } from "react-icons/bs";
import { HiMiniMinusSmall } from "react-icons/hi2";
import CartSheetOderDailog from './CartSheetOderDailog';
import { useCartContext } from '@/Contexts/Cart.context';

import { AddressProps, CartItem, Colors, newCartItem, OrderProps, ProductsProps, Sizes, updateQuantityProps, userinterfce } from '@/types/interfaces';
import { IoIosClose } from 'react-icons/io';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import { getCurrentUserOrders, getSelectedAddress } from '@/Supabase/SupabaseApi';
import axios from 'axios';
import LoadRazorpay from '@/utils/loadrazorpay';
import UpdateLocalstorageForOrder from '@/lib/UpdateLocalStorageForOrder';
import SendMail from '@/lib/SendMailHelper';
import { ShoppingBag } from 'lucide-react';


function CartSheet({ children }: {
    children: React.ReactNode

}) {
    const { cart, clearCart, updateQuantity, removeFromCart } = useCartContext()
    const [open, setOpen] = useState(false)
    const [User, setUser] = useState<userinterfce | null>()
    const [isOrderSub, setOrderSub] = useState<boolean>(false)
    const { executeRecaptcha } = useGoogleReCaptcha()
    const [UserAddress, setUserAddress] = useState<AddressProps | undefined>()

    const [side, setSide] = useState<"right" | "bottom">("right")

    useEffect(() => {
        async function getSupabaseUser() {
            const {
                data: { user },
                error,
            } = await mysupabase.auth.getUser();

            if (user) {
                const { address }: any = await getSelectedAddress(user.id)
                console.log(address, 'this this address data')
                setUserAddress(address)
            }
        }
        getSupabaseUser()


    }, [])


    const { totalPrice, totalDiscount, beforeDiscount, total_final_amount } = useMemo(() => {
        let total = 0;
        let discountSaved = 0;
        let beforeDiscount = 0;
        let finalAmount = 0;




        cart.forEach((item: any) => {
            const itemTotal = item?.variant?.price * item.quantity;
            beforeDiscount += itemTotal;

            if (item?.variant?.discounts?.discount_persent) {
                const discountAmount = (itemTotal * item.variant?.discounts.discount_persent) / 100;
                total += itemTotal - discountAmount;
                discountSaved += discountAmount;

                const discountedPrice = Math.floor(item?.variant.price - (item.variant.price * item.variant.discounts.discount_persent) / 100);
                finalAmount += discountedPrice * item.quantity;
            } else {
                total += itemTotal;
                finalAmount += item?.variant?.price * item.quantity;
            }
        });

        return {
            totalPrice: total,
            totalDiscount: discountSaved,
            beforeDiscount,
            total_final_amount: finalAmount,
        };
    }, [cart]);



    function increaseQuantity(item: newCartItem) {
        if (!item) return;
        if (item.quantity >= 1 && item.quantity < 5) {
            updateQuantity({
                productId: item.productId,
                colorName: item.variant.selectedColor,
                size: item.variant.selectedSize,
                quantity: item.quantity + 1,
            });
        }
    }

    function decreaseQuantity(item: newCartItem) {
        if (!item) return;
        if (item.quantity > 1) {
            updateQuantity({
                productId: item.productId,
                colorName: item.variant.selectedColor,
                size: item.variant.selectedSize,
                quantity: item.quantity - 1,
            });
        }
    }

    async function OrdersBeforePayment() {
        try {
            setOrderSub(true)
            if (!executeRecaptcha) {
                console.log("token is not generated");
                setOrderSub(false)
                return;
            }

            const recaptchaToken = await executeRecaptcha()

            const orders = cart?.map((product: any) => {
                const final_price = Math.floor(product?.variant.price - (product?.variant.price * (product?.variant?.discounts?.discount_persent / 100)));
                const discountPrice = product?.variant?.price * (product?.variant?.discounts?.discount_persent / 100);
                return {
                    name: UserAddress?.name,
                    pin_code: UserAddress?.pin_code,
                    state_name: UserAddress?.state_name,
                    city: UserAddress?.city,
                    full_address: UserAddress?.full_address,
                    email: User?.email,
                    phone: User?.phone || User?.user_metadata.phone || "",
                    final_price: final_price || product.variant.price,
                    quantity: product?.quantity,
                    discount_amount: discountPrice || 0,
                    product_key: product?.productId,
                    variant_id: product?.variant?.id
                };
            });


            const { data } = await axios.post("/api/bulk-place-order", {
                products: orders,
                recaptchaToken
            })

            console.log(data, "to create bulk orders")
            setOpen(false)
            await Razorpayment(data.data, UserAddress)

        }
        catch (error) {
            console.error("Bulk order submission failed:",);
            setOrderSub(false)

        }
    }
    async function Razorpayment(orderedData: OrderProps[], UserAddress: AddressProps | undefined) {



        const response = await axios.post('/api/create-order', {
            amount: total_final_amount * 100,
        });
        const res = await LoadRazorpay();
        if (!res) {
            alert('Failed to load Razorpay SDK');
            return;
        }
        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: response.data.amount,
            currency: response.data.currency,
            name: "Markline",
            description: "Order description",
            order_id: response.data.id,
            image: "https://res.cloudinary.com/demhgityh/image/upload/v1750353291/markline-checkout-logo_ukrvoi.png",
            handler: (response) => orderSubmition(response, UserAddress, orderedData),
            prefill: {
                name: UserAddress?.name,
                email: User?.email,
                contact: User?.phone,
            },
            theme: {
                color: "#084E10",
            },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    }
    async function orderSubmition(razorpayresponse, UserAddress: AddressProps | undefined, orderedData: OrderProps[]) {

        try {
            const { data } = await axios.post('/api/bulk-update-orders', {
                OrderedProducts: orderedData,
                user_id: User?.id,
                razorpay_payment_id: razorpayresponse.razorpay_payment_id,
                razorpay_order_id: razorpayresponse.razorpay_order_id,
                razorpay_signature: razorpayresponse.razorpay_signature,
            })
            setOrderSub(false)
            await UpdateLocalstorageForOrder()
            clearCart()
            await SendMail({ data: data.data });


        }
        catch (error) {
            console.error("Bulk order submission failed:",);
        }
    }

    useEffect(() => {
        function handleResize() {
            if (window.innerWidth <= 600) {
                setSide("bottom")
            } else {
                setSide("right")
            }
        }
        handleResize() // run on mount
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    return (
        <Sheet >
            <SheetTrigger className='w-fit h-fit relative '>{children}</SheetTrigger>
            <SheetContent side={side} className="py-5  h-[700px]  px-2 max-w-[550px] md:min-w-[550px] sm:h-full  overflow-y-auto" id="style-3">
                <SheetHeader>
                    <SheetTitle className="font-medium text-2xl border-b pb-2 text-start">Carts</SheetTitle>

                    <section className='w-full relative max-h-[calc(100vh-500px)]    md:max-h-[calc(100vh-270px)]   overflow-y-auto grid grid-cols-2 md:grid-cols-1 gap-1  '>
                        {
                            cart.length > 0 ? cart.map((item, index) => (
                                <div key={index} className='w-full border p-2 rounded-lg relative h-auto flex flex-col md:grid md:grid-cols-[100px_2fr_auto_auto] items-start md:items-center justify-between gap-1'>

                                    <Swiper pagination={{ dynamicBullets: true }} modules={[Pagination]} className="mySwiper w-full relative h-full">
                                        {item?.variant?.image_url.map((image, index: number) => (
                                            <SwiperSlide key={index} className='w-full  max-h-[180px] md:max-h-full relative'>
                                                <img src={image.image_url} alt={image?.name} className='  aspect-square w-full md:w-full h-full md:max-h-full  object-contain rounded-md border' loading='lazy' />
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>

                                    <button
                                        className='w-fit absolute -top-1 right-0 bg-black text-white h-auto p-[2px] z-10 cursor-pointer rounded-full'
                                        onClick={() => removeFromCart({ productId: item.productId, colorName: item?.variant?.selectedColor, size: item?.variant?.selectedSize })}
                                    >
                                        <IoIosClose />
                                    </button>

                                    <div className='flex flex-col items-start'>
                                        <h2 className='text-sm text-start font-medium text-foreground line-clamp-2'>{item.productName}</h2>
                                        <div className='flex items-center gap-2 text-xs text-foreground'>
                                            <p><strong>Size:</strong> {item.variant?.selectedSize.size} {item.variant?.selectedSize.unit}</p>
                                            <p><strong>Color:</strong> {item.variant?.selectedColor.name}</p>
                                        </div>
                                    </div>

                                    <div className='flex items-center gap-1 justify-between border w-full mt-1 border-gray-400 py-[2px] px-1 rounded-full'>
                                        <button className='p-[2px] bg-gray-200 rounded-full' onClick={() => {
                                            if (item) {
                                                decreaseQuantity(item as newCartItem);
                                            }
                                        }}><HiMiniMinusSmall /></button>
                                        <p className='text-[12px] font-normal'>{item.quantity}</p>
                                        <button className='p-[2px] bg-gray-200 rounded-full' onClick={() => {
                                            if (item) {
                                                increaseQuantity(item as newCartItem);
                                            }
                                        }}><BsPlus /></button>
                                    </div>

                                    <div className='flex flex-col items-start px-2'>
                                        <h2 className='text-lg font-medium text-foreground'>₹ {item.variant && item?.variant?.price * item.quantity}</h2>
                                        {item.variant?.discounts?.discount_persent && (
                                            <p className='text-red-400 line-through text-sm'>{item.variant?.discounts.discount_persent}%</p>
                                        )}
                                    </div>
                                </div>
                            )) : (
                                <div className='text-p20 col-span-2 font-medium py-10 px-5 flex items-center justify-center flex-col text-primary'>
                                    <ShoppingBag className="h-10 w-10 mx-auto text-gray-400 mb-8" />
                                    Your cart is empty
                                </div>
                            )
                        }
                    </section>

                    <section className='absolute bottom-5 w-full left-0 bg-white '>
                        {
                            totalPrice > 0 &&
                            <section className='w-full relative z-30 p-3 h-fit  flex flex-col gap-2 border bg-white  '>
                                <h2 className='text-base font-semibold text-primary text-start'>After Discount</h2>
                                <span className='w-full relative h-auto bg-gray-100 flex items-center  justify-center px-3 py-1'>
                                    <p className='text-base w-full font-medium text-foreground '>Total </p>
                                    <p className='text-lg font-medium text-primary w-full'>₹ {beforeDiscount}</p>
                                </span>
                                {
                                    totalDiscount < 0 &&
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
                                    {
                                        UserAddress?.id &&
                                        <button className='w-fit relative h-auto flex items-center  text-sm md:text-base border border-primary px-4 md:px-5 py-2 text-nowrap bg-primary  text-white  font-medium text-primary' disabled={isOrderSub} onClick={OrdersBeforePayment}  >{isOrderSub ? "Just a second..." : "Buy Now"}</button>

                                    }
                                    {
                                        !UserAddress?.id && !UserAddress?.id &&
                                        <CartSheetOderDailog closeSheet={() => { }}>
                                            <button className='w-fit relative h-auto flex items-center  text-sm md:text-base border border-primary px-4 md:px-5 py-2 text-nowrap bg-primary  text-white  font-medium text-primary'>Place Order</button>
                                        </CartSheetOderDailog>
                                    }

                                </div>

                            </section>
                        }
                    </section>

                </SheetHeader>
            </SheetContent>
        </Sheet >
    )
}

export default CartSheet



//  <section className='absolute bottom-5 w-full left-0 bg-white '>
//                     {
//                         totalPrice > 0 &&
//                         <section className='w-full relative z-30 p-3 h-fit  flex flex-col gap-2 border bg-white  '>
//                             <h2 className='text-base font-semibold text-primary text-start'>After Discount</h2>
//                             <span className='w-full relative h-auto bg-gray-100 flex items-center  justify-center px-3 py-1'>
//                                 <p className='text-base w-full font-medium text-foreground '>Total </p>
//                                 <p className='text-lg font-medium text-primary w-full'>₹ {beforeDiscount}</p>
//                             </span>
//                             {
//                                 totalDiscount < 0 &&
//                                 <span className='w-full relative h-auto  flex items-center  justify-center px-3 py-1 '>
//                                     <p className=' text-sm w-full font-medium text-foreground '>Discount</p>
//                                     <p className='text-sm text-red-400 line-through font-medium text-primary w-full '>₹ {Math.floor(totalDiscount)}</p>
//                                 </span>
//                             }

//                             <div className='w-fulll border-t pt-2  relative h-auto px-3 flex items-center justify-between'>
//                                 <p className='text-sm sm:text-base md:text-lg font-medium w-full text-primary'>Price To Pay</p>
//                                 <p className='text-lg font-medium text-primary w-full'>₹ {Math.floor(totalPrice)}</p>
//                             </div>
//                             <div className='w-full relative h-auto flex items-start justify-end'>
//                                 {
//                                     UserAddress?.id &&
//                                     <button className='w-fit relative h-auto flex items-center  text-sm md:text-base border border-primary px-4 md:px-5 py-2 text-nowrap bg-primary  text-white  font-medium text-primary' disabled={isOrderSub} onClick={OrdersBeforePayment}  >{isOrderSub ? "Just a second..." : "Buy Now"}</button>

//                                 }
//                                 {
//                                     !UserAddress?.id && !UserAddress?.id &&
//                                     <CartSheetOderDailog closeSheet={() => { }}>
//                                         <button className='w-fit relative h-auto flex items-center  text-sm md:text-base border border-primary px-4 md:px-5 py-2 text-nowrap bg-primary  text-white  font-medium text-primary'>Place Order</button>
//                                     </CartSheetOderDailog>
//                                 }

//                             </div>

//                         </section>
//                     }
//                 </section>