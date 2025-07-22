import { Images, ProductsDataProps } from '@/types/interfaces'
import React , {useEffect, useState} from 'react'

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import axios from 'axios';
import { Pagination } from 'swiper/modules';
import LoadRazorpay from '@/utils/loadrazorpay';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { mysupabase } from '@/Supabase/SupabaseConfig';


function BuyComponent({ product }: ProductsDataProps | any) {
    const [currentUser,setCurrentUser]=useState<any>(null)
    const { executeRecaptcha } = useGoogleReCaptcha()

    async function getUserData(){
        const {data: { user } , error } = await mysupabase.auth.getUser();
        console.log(user,"this is user data")
        setCurrentUser(user)
    }

    useEffect(()=>{
        getUserData()
    },[])

    const productImages = product?.image_url?.map((obj: any) => JSON.parse(obj))



    //    async function handlepayment() {
    //         const final_price = Math.floor(
    //             product?.price - (product?.price * (product?.discounts?.discount_persent || 0) / 100)
    //         );
    
    //         const response = await axios.post('/api/create-order', {
    //             amount: final_price * 100,
    //         });
    
    //         const res = await LoadRazorpay();
    //         if (!res) {
    //             alert('Failed to load Razorpay SDK');
    //             return;
    //         }
    
    //         const options = {
    //             key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    //             amount: response.data.amount,
    //             one_click_checkout: true,
    //             currency: response.data.currency,
    //             name: "Markline Fashion",
    //             description: "Order description",
    //             order_id: response.data.id,
    //             image: "https://res.cloudinary.com/demhgityh/image/upload/v1750353291/markline-checkout-logo_ukrvoi.png",
    //             handler: (response) => orderSubmition(response, data),
    //             prefill: {
    //                 name: data.name,
    //                 email: data.email,
    //                 contact: data.phone,
    //             },
    //             theme: {
    //                 color: "#084E10",
    //             },
    //         };
    
    
    
    
    //         const paymentObject = new window.Razorpay(options);
    //         paymentObject.open();
    
    //     }

    //     async function orderSubmition(response, fromdata) {
    //             try {
    //                 if (!executeRecaptcha) {
    //                     console.log("token is not generated");
    //                     return;
    //                 }
        
                
    //                 const recaptchaToken = await executeRecaptcha()
        
    //                 const final_price = Math.floor(
    //                     product?.price - (product?.price * (product?.discounts?.discount_persent || 0) / 100)
    //                 );
    //                 const discountPrice = product.price * ((product?.discounts?.discount_persent || 0) / 100);
    //                 const orders = [
    //                     {
    //                         ...fromdata,
    //                         final_price,
    //                         quantity: product.quantity,
    //                         discount_amount: discountPrice,
    //                         product_key: product.id,
    //                         razorpay_payment_id: response.razorpay_payment_id,
    //                         razorpay_order_id: response.razorpay_order_id,
    //                         razorpay_signature: response.razorpay_signature,
    //                         user_id:currentuser?.id,
    //                         recaptchaToken
    //                     }
    //                 ];
        
        
    //                 const responses = await submitOrders(orders)
        
        
        
    //                 const orderIDs: string[] = [];
    //                 responses.data?.forEach((ordersaved: any) => {
    //                     if (ordersaved) {
        
    //                         const id = ordersaved?.id
    //                         if (id) {
    //                             orderIDs.push(id);
    //                         }
    //                     } else {
    //                         console.error("Order failed:", responses?.message);
    //                     }
    //                 });
        
    //                 if (orderIDs.length > 0) {
    //                     setOrderID({
    //                         orderID: orderIDs,
    //                         email: fromdata.email,
    //                         username: fromdata.name
    //                     });
        
        
        
    //                     const emailResponse: any = await axios.post('/api/sendmail',
    //                         {
    //                             email: fromdata.email,
    //                             name: fromdata.name,
    //                             phone: fromdata.phone,
    //                             orderId: orderIDs[0],
    //                             productNames: product.name,
        
    //                         }
    //                     )
        
    //                     if (!emailResponse.ok) {
    //                         console.error("Failed to send confirmation emails");
    //                     }
        
    //                     reset();
    //                 } else {
    //                     console.error("No valid order ID returned.");
    //                 }
        
    //             }
    //             catch (error) {
    //                 console.log(error)
    //              }
    //      }

    return (
        <>
            <section className='w-full relative grid grid-cols-1 md:grid-cols-[1fr_2fr] items-center  gap-1 h-[320px]'>
                <div className='w-full relative flex items-center md:items-start flex-row md:flex-col gap-1 px-2 py-1 lg:py-2 border h-full  bg-gray-50 border-gray-300 rounded-md'>
                    <Swiper
                        pagination={{
                            dynamicBullets: true,
                        }}
                        modules={[Pagination]}
                        className="mySwiper max-w-[150px] sm:max-w-[200px] md:max-w-[250px]  relative h-auto "
                    >
                        {
                            productImages?.map((item: Images, index: number) => (
                                <SwiperSlide className=' w-full  relative h-auto  ' key={index}>
                                    <img src={item.image_url} alt={item.name} height={400} width={500} className=' w-full  h-[120px] md:h-[200px] lg:h-[220px] border border-gray relative   object-cover rounded-md ' loading='lazy' />
                                </SwiperSlide>
                            ))

                        }


                    </Swiper>

                    <div className='flex  flex-col  items-start justify-between gap-1    '>
                        <h2 className=' text-lg mt-1  font-medium leading-[1] text-black mb-2  w-full '>{product.name}</h2>
                    </div>
                </div>

                <section className='w-full relative h-full items-center flex flex-col justify-center  gap-10 '>

                    <div className='w-full relative h-full flex  flex-col gap-1'>
                       {
                            !product?.discounts?.discount_persent &&
                            <div className='w-full relative bg-gray-100 py-1 text-balck  grid grid-cols-2  px-10 '>
                                <p className='text-lg font-medium text-black '>Price :</p>
                                <p className='text-lg font-medium text-black '>₹{product.price}</p>
                            </div>
                        }
                        {
                            product?.discounts?.discount_persent &&
                            <div className='w-full relative bg-gray-100 py-1 text-balck  grid grid-cols-2  px-10 '>
                                <p className='text-lg font-medium text-black '>Price :</p>
                                <p className='text-lg font-medium text-black '>₹₹{
                                    Math.floor(product?.price - (product?.price * (product?.discounts?.discount_persent / 100)))}</p>
                            </div>
                        }

                        <div className='w-full relative bg-gray-100 py-1 text-balck  grid grid-cols-2  px-10 '>
                            <p className='text-p18 font-medium text-black '>Color :</p>
                            <p className='text-p18 font-medium text-black '>{product?.selectedColor?.name}</p>
                        </div>
                        <div className='w-full relative bg-gray-100 py-1 text-balck  grid grid-cols-2  px-10 '>
                            <p className='text-p18 font-medium text-black '>Size :</p>
                            <p className='text-p18 font-medium text-black '>{product.selectedSize.size}</p>
                        </div>
                           <div className='w-full relative bg-gray-100 py-1 text-balck  grid grid-cols-2  px-10 '>
                            <p className='text-lg font-medium text-black '>Quantity :</p>
                            <p className='text-lg font-medium text-black '>{product.quantity}</p>
                        </div>
                    </div>

                    <div className='w-full relative h-fit flex  flex-col gap-1 '>


                        {
                            product?.discounts?.discount_persent && product?.discounts?.name &&
                            <div className='w-full relative  py-1 text-balck  bg-green-50 grid grid-cols-2 items-center  px-10 '>
                                <p className='text-sm font-medium text-green-800 '>Discount name :</p>
                                <p className=' text-sm sm:text-base leading-[1.3] flex items-center gap-4 font-medium text-green-800 '>{product?.discounts?.name}

                                    <p className='text-red-400 line-through'>{product?.discounts?.discount_persent}%</p>
                                </p>
                            </div>

                        }
                        {
                            product?.discounts?.discount_persent &&
                            < div className='w-full relative  py-1 text-balck  bg-gray-100 items-center grid grid-cols-2  px-10 '>
                                <p className='text-xl font-semibold text-gray-400 '>Total :</p>
                                <p className='text-xl font-medium text-black '>₹{Math.floor(product?.price - (product?.price * (product?.discounts?.discount_persent / 100)))}</p>
                            </div>
                        }

                        {
                            !product?.discounts?.discount_persent &&

                            < div className='w-full relative  py-1 text-balck  bg-gray-100 items-center grid grid-cols-2  px-10 '>
                                <p className='text-xl font-semibold text-gray-700 '>Total :</p>
                                <p className='text-xl font-medium text-gray-900 '>₹{product?.price}</p>
                            </div>
                        }
                    </div>
                </section>
            </section >
            {/* {
                currentUser &&
                 <button className='text-base font-medium text-white rounded-md border border-gray-200 px-12 mt-4 py-2 bg-primary ' >Buy Now</button> 
            } */}
        </>
    )
}

export default BuyComponent