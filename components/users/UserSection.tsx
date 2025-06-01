import React from 'react'
import Image from 'next/image'
import { BsThreeDotsVertical } from "react-icons/bs";
function UserSection() {
  return (
    <section className='w-full relative h-auto  grid grid-cols-[3fr_1fr_auto] lg:grid-cols-[1fr_2fr_auto] border border-gray-300 rounded-sm px-5 py-4 items-center gap-5 '>
        <span className='w-full relative h-auto flex items-center justify-between border-r px-5 lg:pr-10 '>
            <Image src={'/court-vision.png'} alt='userimage' height={100} width={100} className='h-[100px] w-[100px] border rounded-full object-cover ' />
            <h2 className='text-xl font-semibold text-primary line-clamp-1 pl-5 lg:pl-10 '>Ayan mansoor</h2>
        </span>
        <h2 className='text-xl font-semibold text-primary  px-5'>9100504057</h2>
        <BsThreeDotsVertical className='text-primary bg-gray-200  rounded-md cursor-pointer w-fit text-[50px] py-3'/>
   </section>
  )
}

export default UserSection