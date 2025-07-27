'user client'
import React, { useEffect } from 'react'
import UserSection from './UserSection'
import CategoriesSection from '../Common/CategoriesSection'
import OrderplacedSection from './OrderplacedSection'
import { mysupabase } from '@/Supabase/SupabaseConfig'
import { useRouter } from 'next/navigation'
import OrderandAddressSection from './OrderandAddressSection'
function Userpage() {



  return (
    <section className='w-full relative container min-h-[70vh] px-0  md:px-10   xl:px-20 flex flex-col gap-10 py-10'>
        <UserSection/>
        <OrderandAddressSection/>
    </section>
  )
}

export default Userpage