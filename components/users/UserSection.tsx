'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { BsThreeDotsVertical } from "react-icons/bs";
import UserSheet from './UserSheet';
import { mysupabase } from '@/Supabase/SupabaseConfig';

interface userinterfce {
  email?: string,
  phone?: string,
  user_metadata: {
    email?: string,
    email_verified?: boolean,
    phone_verified?: boolean
  }


}



function UserSection() {
  const [currentuser, setUser] = useState<userinterfce >();

  useEffect(() => {
    async function getSupabaseUser() {
      const {
          data: { user },
          error,
      } = await mysupabase.auth.getUser();

      if (user) {
        setUser(user);
      }
    }
    getSupabaseUser()
  }, [])

  return (


    < section className='w-full relative h-auto  grid grid-cols-[3fr_1fr_auto] lg:grid-cols-[2fr_2fr_auto] border border-gray-300 rounded-sm px-5 py-4 items-center gap-5 ' >

      <span className='w-full relative h-auto flex items-center justify-between border-r px-5 lg:pr-10 '>
        <span className='text-3xl font-medium text-primary  bg-white rounded-full px-7 py-5 border border-primary'>
          {currentuser?.email && currentuser?.email.at(0)?.toUpperCase()}
        </span>
        {/* <Image src={'/court-vision.png'} alt='userimage' height={100} width={100} className='h-[100px] w-[100px] border rounded-full object-cover ' /> */}
        <h2 className='text-xl font-semibold text-primary line-clamp-1 pl-5 lg:pl-10 '>{currentuser?.email || ""}</h2>
      </span>
      <h2 className='text-xl font-semibold text-primary  px-5'>{currentuser?.phone || ""}</h2>
      <UserSheet />
    </section >
  )

}


export default UserSection;