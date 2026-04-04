'use client'
import React, { useEffect, useState } from 'react'
import UserSection from './UserSection'
import OrderandAddressSection from './OrderandAddressSection'
import { mysupabase } from '@/Supabase/SupabaseConfig'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Loader2, ShieldCheck, Gem } from 'lucide-react'

function Userpage() {
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await mysupabase.auth.getUser()
      if (!user) {
        router.push('/?login=true')
      } else {
        setAuthenticated(true)
        setLoading(false)
      }
    }
    checkUser()
  }, [router])

  if (loading) {
    return (
      <div className='w-full h-[70vh] flex flex-col items-center justify-center gap-6'>
        <div className='relative'>
          <Loader2 className='animate-spin text-primary' size={48} strokeWidth={1.5} />
          <Gem className='absolute inset-0 m-auto text-primary animate-pulse' size={20} />
        </div>
        <p className='text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 animate-pulse'>Authenticating Elite Access</p>
      </div>
    )
  }

  if (!authenticated) return null

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className='w-full max-w-[1440px] mx-auto min-h-[90vh] px-6 lg:px-12 xl:px-24 py-12 lg:py-20 flex flex-col gap-16 lg:gap-24'
    >


      <div className='grid grid-cols-1 gap-10 md:gap-20 lg:gap-28'>

        <UserSection />


        <section className='flex flex-col gap-8'>
          <OrderandAddressSection />
        </section>
      </div>
    </motion.main>
  )
}

export default Userpage

