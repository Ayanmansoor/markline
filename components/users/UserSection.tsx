'use client'

import React, { useEffect, useState } from 'react'
import { mysupabase } from '@/Supabase/SupabaseConfig';
import UserSkeleton from '../Skeleton/UserSkeleton';
import { LogOut, Shield, Mail, BadgeCheck, Phone, CalendarDays } from 'lucide-react';
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

function UserSection({ user }: { user?: userinterfce }) {
  const [currentuser, setUser] = useState<userinterfce | undefined>(user);
  const [loading, setLoading] = useState(!user);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setUser(user);
      setLoading(false);
    } else {
      async function getSupabaseUser() {
        // Use getSession() — instant local JWT read, no network call
        const { data: { session } } = await mysupabase.auth.getSession();
        if (session?.user) {
          setUser(session.user as any);
        }
        setLoading(false);
      }
      getSupabaseUser();
    }
  }, [user]);

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
  const phone = (currentuser as any)?.user_metadata?.phone || (currentuser as any)?.phone || '';
  const createdAt = (currentuser as any)?.created_at;
  const memberSince = createdAt
    ? new Date(createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : '';

  return (
    <section className='w-full'>
      <div className='flex flex-col gap-8'>

        <div className='flex justify-between items-center pb-4 border-b border-gray-100'>
          <h2 className='text-2xl font-bold text-gray-800'>Profile Settings</h2>
          <UserSheet user={currentuser} />
        </div>

        {/* Profile Header Card */}
        <div className='flex flex-col md:flex-row items-center md:items-start gap-6 bg-gradient-to-br from-gray-50 to-white p-6 md:p-8 rounded-2xl border border-gray-300'>
          {/* Avatar */}
          <div className='relative shrink-0'>
            <div className='w-20 h-20 md:w-24 md:h-24 bg-gray-900 rounded-full flex items-center justify-center border-4 border-white shadow-lg'>
              <span className='text-white text-2xl md:text-3xl font-bold'>{userInitial}</span>
            </div>
            <div className='absolute bottom-0 right-0 w-7 h-7 bg-primary rounded-full border-4 border-white flex items-center justify-center'>
              <BadgeCheck size={14} className='text-white' />
            </div>
          </div>

          {/* Name + Subtitle */}
          <div className='flex flex-col items-center md:items-start gap-1 flex-1'>
            <h3 className='text-xl md:text-2xl font-bold text-gray-900 tracking-tight'>{displayName}</h3>
            <p className='text-sm text-gray-500'>{currentuser?.email}</p>
            {memberSince && (
              <span className='text-xs text-gray-400 mt-1'>Member since {memberSince}</span>
            )}
          </div>
        </div>

        {/* Info Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>

          {/* Email */}
          <div className='flex items-start gap-4 p-5 bg-white rounded-xl border border-gray-300 hover:border-gray-200 transition-colors'>
            <div className='w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0'>
              <Mail size={18} className='text-primary' />
            </div>
            <div className='flex flex-col gap-0.5 min-w-0'>
              <span className='text-xs font-medium text-gray-400'>Email Address</span>
              <span className='text-sm font-semibold text-gray-900 truncate'>{currentuser?.email}</span>
            </div>
          </div>

          {/* Phone */}
          <div className='flex items-start gap-4 p-5 bg-white rounded-xl border border-gray-300 hover:border-gray-200 transition-colors'>
            <div className='w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0'>
              <Phone size={18} className='text-primary' />
            </div>
            <div className='flex flex-col gap-0.5'>
              <span className='text-xs font-medium text-gray-400'>Phone Number</span>
              <span className='text-sm font-semibold text-gray-900'>
                {phone || <span className='text-gray-300 font-normal'>Not added yet</span>}
              </span>
            </div>
          </div>

          {/* Account Status */}
          <div className='flex items-start gap-4 p-5 bg-white rounded-xl border border-gray-300 hover:border-gray-200 transition-colors'>
            <div className='w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0'>
              <Shield size={18} className='text-primary' />
            </div>
            <div className='flex flex-col gap-0.5'>
              <span className='text-xs font-medium text-gray-400'>Account Status</span>
              <div className='flex items-center gap-2'>
                <span className='w-2 h-2 bg-emerald-500 rounded-full'></span>
                <span className='text-sm font-semibold text-gray-900'>Verified</span>
              </div>
            </div>
          </div>

          {/* Member Since */}
          <div className='flex items-start gap-4 p-5 bg-white rounded-xl border border-gray-300 hover:border-gray-200 transition-colors'>
            <div className='w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0'>
              <CalendarDays size={18} className='text-primary' />
            </div>
            <div className='flex flex-col gap-0.5'>
              <span className='text-xs font-medium text-gray-400'>Member Since</span>
              <span className='text-sm font-semibold text-gray-900'>
                {memberSince || <span className='text-gray-300 font-normal'>—</span>}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default UserSection;

