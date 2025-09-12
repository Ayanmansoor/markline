'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { BsThreeDotsVertical } from "react-icons/bs";
import UserSheet from './UserSheet';
import { mysupabase } from '@/Supabase/SupabaseConfig';
import UserSkeleton from '../Skeleton/UserSkeleton';

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
  const [currentuser, setUser] = useState<userinterfce>();

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

    <>
      {currentuser?.email ?
        < section className='w-full relative justify-between h-auto   hidden md:grid grid-cols-[1fr_auto_auto] md:grid-cols-[3fr_1fr_auto] lg:grid-cols-[2fr_2fr_auto] lg:border border-gray-300 rounded-sm px-5 py-4 items-center gap-5 ' >

          <span className='w-full relative h-auto flex items-center justify-between border-r px-5 lg:pr-10 '>
            <span className=' text-base md:text-xl lg:text-3xl font-medium text-primary  bg-white rounded-full px-3 lg:px-5 py-3 lg:py-3 border border-gray-300'>
              {currentuser?.email && currentuser?.email.at(0)?.toUpperCase()}
            </span>
            <h2 className=' text-sm  md:text-base  font-semibold text-gray-700 line-clamp-1 pl-5 lg:pl-10 '>{currentuser?.email || ""}</h2>
          </span>
          <UserSheet />
        </section >
        : <UserSkeleton />}
      <section className='w-full relative h-auto  items-center gap-1 border border-gray-300 p-2 rounded-md  flex md:hidden'>
        <span className=' text-base  font-medium text-primary  bg-white rounded-full px-3  py-1 border border-gray-300'>
          {currentuser?.email && currentuser?.email.at(0)?.toUpperCase()}
        </span>
        <h2 className=' text-xs sm:text-sm  md:text-base  font-semibold text-gray-700 line-clamp-1 pl-2 '>{currentuser?.email || ""}</h2>

      </section>
    </>
  )

}


export default UserSection;