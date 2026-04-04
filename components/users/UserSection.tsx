'use client'

import React, { useEffect, useState } from 'react'
import { mysupabase } from '@/Supabase/SupabaseConfig';
import UserSkeleton from '../Skeleton/UserSkeleton';
import { LogOut, Shield, Mail, BadgeCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import UserSheet from './UserSheet';

interface userinterfce {
  email?: string,
  id?: string,
  user_metadata?: {
    name?: string,
    email?: string,
  }
}

function UserSection() {
  const [currentuser, setUser] = useState<userinterfce>();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function getSupabaseUser() {
      const { data: { user } } = await mysupabase.auth.getUser();
      if (user) {
        setUser(user as any);
      }
      setLoading(false);
    }
    getSupabaseUser()
  }, [])

  async function handleLogout() {
    const { error } = await mysupabase.auth.signOut();
    if (error) {
      toast.error("Error signing out");
    } else {
      toast.success("Logged out successfully");
      router.push('/');
    }
  }

  if (loading) return <UserSkeleton />;

  const userInitial = (currentuser?.user_metadata?.name || currentuser?.email || "?").at(0)?.toUpperCase();
  const displayName = currentuser?.user_metadata?.name || (currentuser?.email?.split('@')[0]);

  return (
    <section className='w-full'>
      <div className='flex flex-col md:flex-row items-stretch gap-8 lg:gap-20'>

        {/* Profile Card */}
        <div className='flex-grow bg-white border border-gray-300 rounded-2xl p-6 md:p-8 shadow-xl shadow-gray-100/40 relative overflow-hidden group'>



          <div className='relative flex flex-col md:flex-row items-center md:items-start gap-8 lg:gap-14'>
            {/* Avatar */}
            <div className='relative shrink-0'>
              <div className='w-20 h-20 md:w-24 md:h-24 bg-black rounded-full flex items-center justify-center border-[6px] border-gray-50 shadow-2xl transition-transform group-hover:scale-105'>
                <span className='text-white text-2xl md:text-3xl font-black italic tracking-tighter'>{userInitial}</span>
              </div>
              <div className='absolute -bottom-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full border-4 border-white flex items-center justify-center'>
                <BadgeCheck size={12} className='text-black' />
              </div>
            </div>

            {/* Identity Details */}
            <div className='flex flex-col md:flex-row items-center md:items-start justify-between gap-8 w-full '>

              {/* Name Group */}
              <div className='flex flex-col items-center md:items-start gap-1'>
                <h2 className='text-2xl md:text-4xl font-black text-black uppercase tracking-tighter italic leading-none'>{displayName}</h2>
              </div>

              {/* Email Group */}
              <div className='flex flex-col items-center md:items-start gap-2 bg-gray-50/50 p-4 rounded-xl border border-gray-100  md:border-none md:bg-transparent md:p-0'>
                <span className='text-[9px] font-black uppercase tracking-[0.3em] text-gray-400'>Official Registry Link</span>
                <div className='flex items-center gap-2 text-black font-bold'>
                  <Mail size={14} className='opacity-40' />
                  <span className='text-xs md:text-sm truncate max-w-[180px] sm:max-w-none'>{currentuser?.email}</span>
                </div>
              </div>


              <UserSheet />

            </div>



          </div>
        </div>
      </div>
    </section>
  )
}

export default UserSection;

