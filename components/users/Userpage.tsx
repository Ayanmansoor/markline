'use client'
import React, { useEffect, useState } from 'react'
import UserSection from './UserSection'
import OrderplacedSection from './OrderplacedSection'
import AddressSection from './AddressSection'
import AddAdressSheet from './AddAdressSheet'
import { mysupabase } from '@/Supabase/SupabaseConfig'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, Gem, User, Receipt, MapPin, LogOut } from 'lucide-react'
import { UserAddressProvider } from '@/Contexts/UserAddressProvider'
import { useAuth } from '@/Contexts/Auth.context'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

type TabType = 'profile' | 'orders' | 'address';

function Userpage() {
  const { user, loading: isAuthLoading, logout } = useAuth()
  const [loading, setLoading] = useState(true)
  const [dataLoading, setDataLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState<TabType>('profile')
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [address, setAddress] = useState<any[]>([])
  const [perform, setPerfom] = useState(false)
  const [ordersFetched, setOrdersFetched] = useState(false)
  const [addressFetched, setAddressFetched] = useState(false)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()

  function handleperform() {
    setPerfom((prev) => !prev)
  }

  // Reset fetch status when perform changes (e.g., after adding an address)
  useEffect(() => {
    setOrdersFetched(false)
    setAddressFetched(false)
  }, [perform])

  useEffect(() => {
    if (!isAuthLoading) {
      if (isLoggingOut) return // Prevent competing redirect if logout is in progress
      if (!user) {
        router.replace('/?login=true')
        setLoading(false)
      } else {
        setCurrentUser(user)
        setAuthenticated(true)
        setLoading(false)
      }
    }
  }, [user, isAuthLoading, isLoggingOut, router])

  // Lazy load tab data
  useEffect(() => {
    let isMounted = true

    async function fetchTabData() {
      if (!currentUser) return

      if (activeTab === 'orders' && !ordersFetched) {
        setDataLoading(true)
        try {
          const res = await axios.get(`/api/user/orders?userId=${currentUser.id}`)
          if (isMounted) {
            setOrders(res.data?.orders || [])
            setOrdersFetched(true)
          }
        } catch (err) {
          console.error("Error loading orders:", err)
        } finally {
          if (isMounted) setDataLoading(false)
        }
      } else if (activeTab === 'address' && !addressFetched) {
        setDataLoading(true)
        try {
          const res = await axios.get(`/api/user/addresses?userId=${currentUser.id}`)
          if (isMounted) {
            setAddress(res.data?.addresses || [])
            setAddressFetched(true)
          }
        } catch (err) {
          console.error("Error loading addresses:", err)
        } finally {
          if (isMounted) setDataLoading(false)
        }
      }
    }

    fetchTabData()
    return () => { isMounted = false }
  }, [activeTab, currentUser, ordersFetched, addressFetched])

  async function confirmLogout() {
    setIsLoggingOut(true)
    setShowLogoutDialog(false)
    toast.success("Logged out successfully")

    try {
      await logout()
      window.location.replace('/')
    } catch (error) {
      console.error("Logout error:", error)
      window.location.replace('/')
    }
  }

  if (isLoggingOut) {
    return (
      <section className='w-full relative bg-white flex items-center justify-center h-[80vh]'>
        <div className='flex flex-col items-center gap-3'>
          <Loader2 className='w-6 h-6 animate-spin text-zinc-900' />
          <p className='text-xs font-semibold tracking-wider uppercase text-zinc-500'>Logging out...</p>
        </div>
      </section>
    )
  }

  if (loading) {
    return (
      <section className='w-full relative bg-white flex items-center justify-center h-[80vh]'>
        <div className='w-fit relative h-fit flex flex-col items-center justify-center gap-0 animate-pulse'>
          <h2 className='text-p40 text-primary font-semibold italic'>Markline</h2>
          <p className='text-bse font-medium text-primary self-end justify-self-end leading-[.1]'>Mark Your Legacy.</p>
        </div>
      </section>
    )
  }

  if (!authenticated) return null

  return (
    <UserAddressProvider>
      <div className='w-full min-h-[90vh] bg-gray-50 flex justify-center py-10 px-4 md:px-10'>
        <div className='w-full max-w-7xl flex flex-col md:flex-row gap-8 items-start'>

          {/* Sidebar */}
          <aside className='w-full md:w-[280px] shrink-0 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm'>
            <div className='flex flex-row md:flex-col overflow-x-auto md:overflow-visible scrollbar-hide snap-x md:py-2'>
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex shrink-0 snap-start items-center gap-2 md:gap-3 px-5 md:px-6 py-4 text-sm font-medium transition-colors border-b-4 md:border-b-0 md:border-l-4 ${activeTab === 'profile' ? 'border-primary bg-primary/5 text-primary' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
              >
                <User size={18} />
                Profile Settings
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`flex shrink-0 snap-start items-center gap-2 md:gap-3 px-5 md:px-6 py-4 text-sm font-medium transition-colors border-b-4 md:border-b-0 md:border-l-4 ${activeTab === 'orders' ? 'border-primary bg-primary/5 text-primary' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
              >
                <Receipt size={18} />
                My Orders
              </button>
              <button
                onClick={() => setActiveTab('address')}
                className={`flex shrink-0 snap-start items-center gap-2 md:gap-3 px-5 md:px-6 py-4 text-sm font-medium transition-colors border-b-4 md:border-b-0 md:border-l-4 ${activeTab === 'address' ? 'border-primary bg-primary/5 text-primary' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
              >
                <MapPin size={18} />
                Manage Address
              </button>

              <hr className='hidden md:block my-2 border-gray-100' />

              <button
                type='button'
                onClick={() => setShowLogoutDialog(true)}
                className='flex shrink-0 snap-start items-center gap-2 md:gap-3 px-5 md:px-6 py-4 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors'
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className='w-full bg-white border border-gray-200 rounded-xl p-4 md:p-10 min-h-[600px] shadow-sm'>
            <AnimatePresence mode='wait'>
              {activeTab === 'profile' && (
                <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                  <UserSection user={currentUser} onLogout={() => setShowLogoutDialog(true)} />
                </motion.div>
              )}
              {activeTab === 'orders' && (
                <motion.div key="orders" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                  <h2 className='text-2xl font-bold text-gray-800 mb-6'>My Orders</h2>
                  {dataLoading ? (
                    <div className='flex items-center justify-center py-20 text-gray-400 gap-3'>
                      <Loader2 size={24} className='animate-spin text-primary' />
                      <span className='text-sm font-medium'>Loading orders...</span>
                    </div>
                  ) : (
                    <OrderplacedSection orders={orders} handleperform={handleperform} />
                  )}
                </motion.div>
              )}
              {activeTab === 'address' && (
                <motion.div key="address" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                  <div className='flex justify-between items-center mb-8 border-b border-gray-100 pb-4'>
                    <h2 className='text-2xl font-bold text-gray-800'>Saved Addresses</h2>
                    <AddAdressSheet handleperform={handleperform}>
                      <button className='px-5 py-2.5 bg-primary hover:opacity-90 text-white rounded-lg text-sm font-medium shadow-sm transition-colors'>
                        + Add New Address
                      </button>
                    </AddAdressSheet>
                  </div>
                  {dataLoading ? (
                    <div className='flex items-center justify-center py-20 text-gray-400 gap-3'>
                      <Loader2 size={24} className='animate-spin text-primary' />
                      <span className='text-sm font-medium'>Loading addresses...</span>
                    </div>
                  ) : address?.length > 0 ? (
                    <AddressSection address={address} />
                  ) : (
                    <div className='flex flex-col items-center justify-center py-20 text-gray-400'>
                      <MapPin size={48} className='mb-4 opacity-50' />
                      <p>No addresses found.</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent className='max-w-[380px] p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-2xl'>
          <DialogHeader className='text-left space-y-1.5'>
            <DialogTitle className='text-lg font-bold text-zinc-900 flex items-center gap-2'>
              <LogOut size={16} className='text-zinc-500' />
              Log Out
            </DialogTitle>
            <DialogDescription className='text-xs text-zinc-500 leading-relaxed'>
              Are you sure you want to log out? You will need to verify your email again to access your account and orders.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className='flex flex-col-reverse sm:flex-row gap-2 mt-5 sm:justify-end'>
            <button
              type='button'
              disabled={isLoggingOut}
              onClick={() => setShowLogoutDialog(false)}
              className='w-full sm:w-auto h-10 px-4 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition'
            >
              Cancel
            </button>
            <button
              type='button'
              disabled={isLoggingOut}
              onClick={confirmLogout}
              className='w-full sm:w-auto h-10 px-5 rounded-xl bg-zinc-900 text-xs font-semibold text-white hover:bg-zinc-800 transition flex items-center justify-center gap-2'
            >
              {isLoggingOut ? (
                <>
                  <Loader2 size={14} className='animate-spin' />
                  Signing out...
                </>
              ) : (
                "Log Out"
              )}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </UserAddressProvider>
  )
}

export default Userpage

