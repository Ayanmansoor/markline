'use client'
import React ,{useEffect,useState} from 'react'
import Image from 'next/image'
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoIosArrowRoundForward } from "react-icons/io";
import { mysupabase } from '@/Supabase/SupabaseConfig';

import { getCurrentUserOrders } from '@/Supabase/SupabaseApi';
import { Images } from '@/types/interfaces';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import Link from 'next/link';
import { Pagination } from 'swiper/modules';
import OrderCardSkeleton from '../Skeleton/OrderCardSkeleton';

export interface ordersprops{
  orders:any,
    handleperform:()=>void
}

function OrderplacedSection({orders,handleperform}:ordersprops) {

    // const [orders,setOrders]=useState<any[]>([])

    
    // useEffect(()=>{
    // async function getSupabaseUser() {
    //   const {
    //       data: { user },
    //       error,
    //   } = await mysupabase.auth.getUser();

    //   if (user) {
    //     const {orders}:any = await getCurrentUserOrders(user.id)
    //     console.log(orders)
    //     setOrders(orders)
    //   }
    // }
    // getSupabaseUser()
        
    // },[])

  

  return (
    <section className='w-full relative h-auto  flex flex-col max-h-[500px] overflow-y-auto '>
        <div className=' sticky z-30 top-2  hidden md:grid grid-cols-[1fr_1fr_1fr_1fr_1fr_auto] gap-2  w-full h-fit  py-5 border px-10 '>
            <h2 className='text-base  font-semibold text-gray-600'>Image</h2>
            <h2 className='text-base  font-semibold text-gray-600'>Name</h2>
            <h2 className='text-base  font-semibold text-gray-600'>Quantity</h2>
            <h2 className='text-base  font-semibold text-gray-600'>Price</h2>
            <h2 className='text-base  font-semibold text-gray-600'>Status</h2>
            <h2 className='text-base  font-semibold text-gray-600'>Action</h2>
            
        </div>

        <section className=' grid grid-cols-2 md:flex flex-col gap-3   relative  '>
            {
                

              (orders?.length>0) ?
                orders.map((items,index)=>(
                    <div className=' flex flex-col  md:grid md:grid-cols-[1fr_1fr_1fr_1fr_1fr_auto]   gap-1 md:gap-5  lg:gap-2 px-2 lg:px-5  md:px-10  border  py-2  lg:py-3 w-full relative border-gray-200 items-start  md:items-center ' key={index}>
             

                <div className='w-full  justify-self-start flex items-start justify-start '>
                 <Swiper
                          style={{
                            "--swiper-pagination-color": "#0c0c0c",
                            "--swiper-pagination-bullet-inactive-color": "#0c0c0c",
                            "--swiper-pagination-bullet-inactive-opacity": "1",
                            "--swiper-pagination-bullet-size": "3px",
                            "--swiper-pagination-bullet-horizontal-gap": "2px"
                          } as React.CSSProperties & Record<string, string>}
                          pagination={{
                            dynamicBullets: true
                          }}
                          modules={[Pagination]}
                          className="mySwiper md:max-w-[150px] lg:max-w-[100px]   justify-self-start relative h-full "
                        >
                            
                        {
                              items?.product_variants?.image_url?.map((image: any) => JSON.parse(image))?.map((image, index: number) => (
                                <SwiperSlide className='   w-full lg:max-w-[100px] realtive max-h-[250px] md:max-h-[200px] lg:max-h-[100px] relative border' key={index}>
                                  <img  src={`${image?.image_url}` || ''} alt={`${image.name} - markline `} className=' w-full  lg:w-full   transition-all duration-500 ease-in-out h-full    object-cover' height={200} width={300} loading='lazy' />
                                </SwiperSlide>
                              ))
                        } 
                </Swiper>
                </div>
            
            <h2 className='text-primary font-semibold  text-base uppercase line-clamp-2 lg:line-clamp-1 lg:h-fit'>{items?.product.name}</h2>
            
            <h2 className=' font-semibold text-base  text-red-500  md:block hidden h-fit'>{items.quantity}</h2>
            <h2 className='text-primary font-semibold h-fit text-base md:block hidden '>{items.final_price}</h2>
            <span className='flex items-center gap-2 w-full relative h-auto md:hidden'>
                <h2 className=' font-semibold text-primary text-base line-through  h-fit'>100</h2>
                <h2 className='text-red-500 font-semibold h-fit text-base'>900</h2>
            </span>

            <h2 className={`text-primary font-semibold uppercase  text-xs md:text-sm  h-fit text-white bg-green-400 py-1 rounded-md px-2 w-fit `}>{items.isDelivered }</h2>
            <button className='text-xl font-semibold font-primary md:block hidden'><BsThreeDotsVertical className='text-[45px] w-fit  rounded-md bg-gray-200 py-3 px-1 cursor-pointer'/></button>
            <button className=' text-xs md:text-base lg:text-xl font-semibold mt-2 font-primary text-white rounded-sm md:hidden flex items-center w-full   px-2 lg:px-5 py-1 lg:py-1 justify-between bg-primary'>
                Action
                <IoIosArrowRoundForward className=' text-[25px] py-3  text-white'/>
            </button>

                    </div>
                ))
                :
                <p className='text-base text-center font-medium text-primary py-4 px-3'>
                  Not Have Any Orders 
                </p>
            }
            
            
        </section>

    </section>
  )
}

export default OrderplacedSection