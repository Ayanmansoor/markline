import React from 'react'
import Image from 'next/image'
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoIosArrowRoundForward } from "react-icons/io";

function OrderplacedSection() {
  return (
    <section className='w-full relative h-auto  bg-gray-100 border gap-5  flex flex-col '>
        <div className=' hidden md:grid grid-cols-[1fr_1fr_1fr_1fr_1fr_auto] gap-2  w-full relative py-5 border px-10 '>
            <h2 className='text-xl font-semibold font-primary'>Image</h2>
            <h2 className='text-xl font-semibold font-primary'>Name</h2>
            <h2 className='text-xl font-semibold font-primary'>Discount</h2>
            <h2 className='text-xl font-semibold font-primary'>Price</h2>
            <h2 className='text-xl font-semibold font-primary'>Status</h2>
            <h2 className='text-xl font-semibold font-primary'>Action</h2>
            
        </div>

        <section className=' grid grid-cols-2 md:flex flex-col gap-3 h-auto relative  '>

            <div className=' flex flex-col   md:grid md:grid-cols-[1fr_1fr_1fr_1fr_1fr_auto]   gap-1 md:gap-5  lg:gap-2 px-5  md:px-10  border  py-3 w-full relative border-gray-200 items-start  md:items-center '>
            <Image src='/court-vision.png' height={100} width={100} alt={'product images'}  className=' h-[200px] md:h-[120px] w-full md:w-[140px] relative object-cover border border-gray-300 rounded-sm'/>
            
            <h2 className='text-primary font-semibold text-2xl md:text-xl uppercase line-clamp-1  h-fit'>fancy shoes</h2>
            
            <h2 className=' font-semibold text-2xl md:text-xl text-red-500  md:block hidden h-fit'>100</h2>
            <h2 className='text-primary font-semibold h-fit text-2xl md:block hidden md:text-xl'>900</h2>
            <span className='flex items-center gap-2 w-full relative h-auto md:hidden'>
                <h2 className=' font-semibold text-primary text-2xl md:text-xl line-through  h-fit'>100</h2>
                <h2 className='text-red-500 font-semibold h-fit text-2xl  md:text-xl'>900</h2>
            </span>

            <h2 className={`text-primary font-semibold uppercase  text-lg h-fit text-white bg-green-500 rounded-md px-3 w-fit `}>pending</h2>
            <button className='text-xl font-semibold font-primary md:block hidden'><BsThreeDotsVertical className='text-[50px] w-fit  rounded-md bg-gray-200 py-3 px-1 cursor-pointer'/></button>
            <button className='text-xl font-semibold mt-2 font-primary text-white rounded-sm md:hidden flex items-center w-full  px-5 py-1 justify-between bg-primary'>
                Action
                <IoIosArrowRoundForward className='text-[40px] '/>
            </button>

            </div>
            

            

            

        </section>

    </section>
  )
}

export default OrderplacedSection