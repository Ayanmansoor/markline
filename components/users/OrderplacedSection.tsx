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

function OrderplacedSection() {

    const [orders,setOrders]=useState<any[]>([])

    
    useEffect(()=>{
    async function getSupabaseUser() {
      const {
          data: { user },
          error,
      } = await mysupabase.auth.getUser();

      if (user) {
        const response:any = await getCurrentUserOrders(user.id)
        setOrders(response)
      }
    }
    getSupabaseUser()
        
    },[])

  

  return (
    <section className='w-full relative h-auto  bg-gray-100 border gap-5  flex flex-col '>
        <div className=' hidden md:grid grid-cols-[1fr_1fr_1fr_1fr_1fr_auto] gap-2  w-full relative py-5 border px-10 '>
            <h2 className='text-xl font-semibold font-primary'>Image</h2>
            <h2 className='text-xl font-semibold font-primary'>Name</h2>
            <h2 className='text-xl font-semibold font-primary'>Quantity</h2>
            <h2 className='text-xl font-semibold font-primary'>Price</h2>
            <h2 className='text-xl font-semibold font-primary'>Status</h2>
            <h2 className='text-xl font-semibold font-primary'>Action</h2>
            
        </div>

        <section className=' grid grid-cols-2 md:flex flex-col gap-3 h-auto relative  '>
            {
                orders.map((items,index)=>(
                    <div className=' flex flex-col  md:grid md:grid-cols-[1fr_1fr_1fr_1fr_1fr_auto]   gap-1 md:gap-5  lg:gap-2 px-2 lg:px-5  md:px-10  border  py-2  lg:py-3 w-full relative border-gray-200 items-start  md:items-center '>
                {/* {
                    items?.products?.image_url?.map((image: any) => JSON.parse(image))?.map((item,index)=>(
                        <Image src={`${item?.image_url}` || ''} height={100} width={100} alt={item.name}  className=' h-[200px] md:h-[120px] w-full md:w-[140px] relative object-cover border border-gray-300 rounded-sm'/>
                    ))
                } */}

                 <Swiper
                          style={{
                            "--swiper-pagination-color": "#0c0c0c",
                            "--swiper-pagination-bullet-inactive-color": "#0c0c0c",
                            "--swiper-pagination-bullet-inactive-opacity": "1",
                            "--swiper-pagination-bullet-size": "7px",
                            "--swiper-pagination-bullet-horizontal-gap": "6px"
                          } as React.CSSProperties & Record<string, string>}
                          pagination={{
                            dynamicBullets: true
                          }}
                          modules={[Pagination]}
                          className="mySwiper max-w-full lg:max-w-[100px] self-start relative h-full "
                        >
                            
                        {
                              items?.products?.image_url?.map((image: any) => JSON.parse(image))?.map((image, index: number) => (
                                <SwiperSlide className=' max-w-full w-full lg:max-w-[100px] realtive max-h-[150px] md:max-h-[200px] lg:max-h-[100px] relative border' key={index}>
                                  <img  src={`${image?.image_url}` || ''} alt={`${image.name} - markline `} className=' w-full  lg:w-full   transition-all duration-500 ease-in-out h-full    object-cover' height={200} width={300} loading='lazy' />
                                </SwiperSlide>
                              ))
                        } 
                </Swiper>
            
            <h2 className='text-primary font-semibold  text-sm lg:text-2xl md:text-xl uppercase line-clamp-2 lg:line-clamp-1 lg:h-fit'>{items.products.name}</h2>
            
            <h2 className=' font-semibold text-2xl md:text-xl text-red-500  md:block hidden h-fit'>{items.quantity}</h2>
            <h2 className='text-primary font-semibold h-fit text-2xl md:block hidden md:text-xl'>{items.final_price}</h2>
            <span className='flex items-center gap-2 w-full relative h-auto md:hidden'>
                <h2 className=' font-semibold text-primary text-sm md:text-2xl lg:text-xl line-through  h-fit'>100</h2>
                <h2 className='text-red-500 font-semibold h-fit text-sm md:text-2xl lg:text-xl'>900</h2>
            </span>

            <h2 className={`text-primary font-semibold uppercase  text-xs md:text-sm h-fit text-white bg-green-500 py-1 rounded-md px-3 w-fit `}>{items.isDelivered }</h2>
            <button className='text-xl font-semibold font-primary md:block hidden'><BsThreeDotsVertical className='text-[50px] w-fit  rounded-md bg-gray-200 py-3 px-1 cursor-pointer'/></button>
            <button className=' md:text-base lg:text-xl font-semibold mt-2 font-primary text-white rounded-sm md:hidden flex items-center w-full   px-2 lg:px-5 py-1 lg:py-1 justify-between bg-primary'>
                Action
                <IoIosArrowRoundForward className=' text-[25px] lg:text-[40px] '/>
            </button>

                    </div>
                ))
            }
            
            
        </section>

    </section>
  )
}

export default OrderplacedSection