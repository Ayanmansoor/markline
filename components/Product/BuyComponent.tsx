import { AddressProps, BuyProductProps, forProductsProps, Images, NewForProductsProps, OrderProps, ProductsDataProps } from '@/types/interfaces'
import React, { useEffect, useMemo, useState } from 'react'

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import axios from 'axios';
import { Pagination } from 'swiper/modules';
import LoadRazorpay from '@/utils/loadrazorpay';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { mysupabase } from '@/Supabase/SupabaseConfig';
import { submitOrders } from '@/Supabase/acceptOrderForm';
import { getSelectedAddress } from '@/Supabase/SupabaseApi';
import UpdateLocalstorageForOrder from '@/lib/UpdateLocalStorageForOrder';
import SendMail from '@/lib/SendMailHelper';
import { toast } from 'sonner';


function BuyComponent({ product, variant, user, setConfirm, selectedAddress }: NewForProductsProps) {

  const productImages = variant?.image_url?.map((obj: any) => JSON.parse(obj));




  // useEffect(() => {
  //   if (!user?.id) return;
  //   const fetchAddress = async () => {
  //     const address = await getSelectedAddress(user?.id);
  //     setUserAddress(address);
  //   };
  //   fetchAddress();
  // }, [user]);


  return (
    <>
      <section className='w-full relative grid grid-cols-1 md:grid-cols-[1fr_2fr] items-center  gap-1 h-[320px]'>
        <div className='w-full relative flex items-start md:items-start flex-col sm:flex-row md:flex-col gap-1 px-2 py-1 lg:py-2 border h-full  bg-gray-50 border-gray-300 rounded-md'>
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
            <h2 className=' text-base lg:text-lg mt-1  font-medium leading-[1] text-black mb-2  w-full '>{product.name}</h2>
          </div>
        </div>

        <section className='w-full relative h-full items-center flex flex-col justify-center  gap-1 md:gap-10 '>

          <div className='w-full relative h-full flex  flex-col gap-1'>
            {
              !variant?.discounts?.discount_persent &&
              <div className='w-full relative bg-gray-100 py-1 text-balck  grid grid-cols-2  px-10 '>
                <p className=' text-sm md:text-base lg:text-lg font-medium text-black '>Price :</p>
                <p className='text-sm md:text-base lg:text-lg font-medium text-black '>₹{variant.price}</p>
              </div>
            }
            {
              variant?.discounts?.discount_persent &&
              <div className='w-full relative bg-gray-100 py-1 text-balck  grid grid-cols-2  px-10 '>
                <p className='text-sm md:text-base lg:text-lg font-medium text-black '>Price :</p>
                <p className='text-sm md:text-base lg:text-lg font-medium text-black '>₹₹{
                  Math.floor(variant?.price - (variant?.price * (variant?.discounts?.discount_persent / 100)))}</p>
              </div>
            }

            <div className='w-full relative bg-gray-100 py-1 text-balck  grid grid-cols-2  px-10 '>
              <p className='text-sm md:text-base lg:text-lg font-medium text-black '>Color :</p>
              <p className='text-sm md:text-base lg:text-lg font-medium text-black '>{product?.selectedColor?.name}</p>
            </div>
            <div className='w-full relative bg-gray-100 py-1 text-balck  grid grid-cols-2  px-10 '>
              <p className='text-sm md:text-base lg:text-lg font-medium text-black '>Size :</p>
              <p className='text-sm md:text-base lg:text-lg font-medium text-black '>{product?.selectedSize?.size}</p>
            </div>
            <div className='w-full relative bg-gray-100 py-1 text-balck  grid grid-cols-2  px-10 '>
              <p className='text-sm md:text-base lg:text-lg font-medium text-black '>Quantity :</p>
              <p className='text-sm md:text-base lg:text-lg font-medium text-black '>{product.quantity}</p>
            </div>
          </div>

          <div className='w-full relative h-fit flex  flex-col gap-1 '>


            {
              variant?.discounts?.discount_persent && variant?.discounts?.name &&
              <div className='w-full relative  py-1 text-balck  bg-green-50 grid grid-cols-2 items-center  px-10 '>
                <p className='text-sm font-medium text-green-800 '>Discount name :</p>
                <p className=' text-sm sm:text-base leading-[1.3] flex items-center gap-4 font-medium text-green-800 '>{variant?.discounts?.name}

                  <p className='text-red-400 line-through'>{variant?.discounts?.discount_persent}%</p>
                </p>
              </div>

            }
            {
              variant?.discounts?.discount_persent &&
              < div className='w-full relative  py-1 text-balck  bg-gray-100 items-center grid grid-cols-2  px-10 '>
                <p className='text-sm md:text-base lg:text-lg font-semibold text-gray-400 '>Total :</p>
                <p className='text-sm md:text-base lg:text-lg font-medium text-black '>₹{Math.floor(variant?.price - (variant?.price * (variant?.discounts?.discount_persent / 100)))}</p>
              </div>
            }

            {
              !variant?.discounts?.discount_persent &&

              < div className='w-full relative  py-1 text-balck  bg-gray-100 items-center grid grid-cols-2  px-10 '>
                <p className='text-sm md:text-base lg:text-lg font-semibold text-gray-700 '>Total :</p>
                <p className='text-sm md:text-base lg:text-lg font-medium text-gray-900 '>₹{variant?.price}</p>
              </div>
            }
          </div>
        </section>
      </section >
      <div className='w-full flex items-end  justify-end'>
        {/* {
          user?.phone || user?.email &&
          <button disabled={isSubmittingOrder} className='text-base font-medium  text-white rounded-md border border-gray-200 px-12 mt-4 py-2 bg-primary ' onClick={() => {
            saveBeforePayment()
          }} >{
              isSubmittingOrder ? "Just a second.." : "Buy Now"
            }</button>
        } */}
      </div>
    </>
  )
}

export default BuyComponent