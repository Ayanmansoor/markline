'use client'
import React from 'react'
import Link from 'next/link'
import { ChevronRight, Package, Calendar, Tag } from 'lucide-react'
import { BsWhatsapp } from 'react-icons/bs'

export interface ordersprops {
  orders: any[],
  handleperform: () => void
}

const getOrderStatus = (item: any) => {
  const rawStatus = item.isDelivered || 'PENDING';
  return rawStatus;
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

function OrderplacedSection({ orders, handleperform }: ordersprops) {


  console.log(orders, "this is order data")

  return (
    <section className='w-full flex flex-col gap-8'>
      {orders && orders.length > 0 ? (
        <div className='flex flex-col gap-6'>
          {/* Header for Desktop */}
          <div className='hidden xl:grid grid-cols-[100px_3fr_1fr_1.5fr_1.5fr_auto] gap-8 px-8 py-5 bg-gray-50/50 rounded-2xl border border-gray-300'>
            <span className='text-[10px] font-black uppercase tracking-[0.3em] text-gray-400'>Legacy Item</span>
            <span className='text-[10px] font-black uppercase tracking-[0.3em] text-gray-400'>Identification</span>
            <span className='text-[10px] font-black uppercase tracking-[0.3em] text-gray-400'>Quantity</span>
            <span className='text-[10px] font-black uppercase tracking-[0.3em] text-gray-400'>Value</span>
            <span className='text-[10px] font-black uppercase tracking-[0.3em] text-gray-400'>Transit Status</span>
            <span className='text-[10px] font-black uppercase tracking-[0.3em] text-gray-400'>Registry</span>
          </div>

          <div className='flex flex-col gap-4'>
            {orders.map((items, index) => {
              const mainImage = items?.product_variants?.image_url?.[0] ? JSON.parse(items?.product_variants?.image_url[0])?.image_url : '';
              const currentStatus = getOrderStatus(items);

              return (
                <div key={items.id} className='group bg-white border border-gray-300 md:border-gray-300 rounded-2xl p-4 md:p-6 hover:border-black/10 transition-all hover:shadow-2xl hover:shadow-gray-200/40 relative overflow-hidden'>
                  {/* Status Glow for Desktop */}
                  <div className={`hidden md:block absolute top-0 left-0 w-1 h-full ${currentStatus === 'DELIVERED' ? 'bg-green-500' : currentStatus === 'SHIPPED' ? 'bg-blue-500' : 'bg-yellow-500'}`} />

                  <div className='flex flex-col md:grid md:grid-cols-[100px_3fr_1fr_1.5fr_1.5fr_auto] gap-6 md:gap-8 items-center'>

                    {/* Image & Main Info (Mobile Focus) */}
                    <div className='flex items-center gap-6 w-full md:w-auto'>
                      <div className='w-20 h-24 md:w-20 md:h-24 bg-gray-50 rounded-xl overflow-hidden shrink-0 border border-gray-100'>
                        <img
                          src={mainImage}
                          alt={items?.product?.name}
                          className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-700'
                        />
                      </div>
                      <div className='flex md:hidden flex-col gap-1 flex-1'>
                        <h3 className='font-black text-black text-sm uppercase tracking-tight line-clamp-1 italic'>{items?.product?.name}</h3>
                        <div className='flex items-center gap-2'>
                          <span className='text-[9px] font-black uppercase tracking-widest text-gray-400'>#{items.id.toString().slice(-6).toUpperCase()}</span>
                          <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded-md ${currentStatus === 'DELIVERED' ? 'bg-green-50 text-green-600' : currentStatus === 'SHIPPED' ? 'bg-blue-50 text-blue-600' : 'bg-yellow-50 text-yellow-600'}`}>
                            {currentStatus}
                          </span>
                        </div>
                        <span className='text-xs font-black text-black mt-1'>{formatPrice(items.final_price)}</span>
                      </div>
                    </div>

                    {/* Details (Desktop Only) */}
                    <div className='hidden md:flex flex-col gap-1 w-full'>
                      <h3 className='font-black text-black text-sm lg:text-base uppercase tracking-tight line-clamp-1 italic'>{items?.product?.name}</h3>
                      <div className='flex items-center gap-3'>
                        <p className='text-[10px] text-gray-400 font-bold tracking-[0.2em] uppercase flex items-center gap-1.5'>
                          <Tag size={10} /> ID: #{items.id.toString().slice(-6).toUpperCase()}
                        </p>
                        <button
                          onClick={() => {
                            const msg = `Hi Markline, I'd like to track my order #ORD-${items.id.toString().slice(-6).toUpperCase()}. Current status: ${currentStatus}. Product: ${items?.product?.name}`;
                            window.open(`https://wa.me/919769020660?text=${encodeURIComponent(msg)}`, '_blank');
                          }}
                          className='flex items-center gap-1 px-2 py-1 bg-green-50 text-green-600 rounded-md text-[8px] font-black uppercase tracking-widest hover:bg-green-600 hover:text-white transition-all active:scale-95'
                        >
                          <BsWhatsapp size={8} /> Track on WA
                        </button>
                      </div>
                    </div>

                    {/* Quantity */}
                    <div className='hidden md:flex flex-col items-start'>
                      <span className='text-[10px] font-black text-gray-300 uppercase tracking-widest md:hidden'>Qty</span>
                      <span className='text-xs text-black font-black bg-gray-100 md:bg-transparent px-3 py-1 md:p-0 rounded-full md:rounded-none'>× {items.quantity}</span>
                    </div>

                    {/* Price */}
                    <div className='hidden md:flex flex-col items-start'>
                      <span className='text-[10px] font-black text-gray-300 uppercase tracking-widest md:hidden'>Total Value</span>
                      <span className='text-sm md:text-base font-black text-black tracking-tighter'>{formatPrice(items.final_price)}</span>
                    </div>

                    {/* Status (Desktop) */}
                    <div className='hidden md:flex items-center'>
                      <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-xl border ${currentStatus === 'DELIVERED' ? 'bg-green-50 text-green-600 border-green-100' : currentStatus === 'SHIPPED' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-yellow-50 text-yellow-600 border-yellow-100'}`}>
                        {currentStatus}
                      </span>
                    </div>

                    {/* Action */}
                    <div className='flex items-center justify-between w-full md:w-auto md:justify-end border-t border-gray-50 md:border-none pt-4 md:pt-0 gap-3'>
                      <div className='md:hidden flex items-center gap-3'>
                        <button
                          onClick={() => {
                            const msg = `Hi Markline, I'd like to track my order #ORD-${items.id.toString().slice(-6).toUpperCase()}. Current status: ${currentStatus}. Product: ${items?.product?.name}`;
                            window.open(`https://wa.me/919769020660?text=${encodeURIComponent(msg)}`, '_blank');
                          }}
                          className='p-3 bg-[#25D366] text-white rounded-xl shadow-lg shadow-green-200 active:scale-95 transition-all'
                        >
                          <BsWhatsapp size={18} />
                        </button>
                        <div className='flex flex-col'>
                          <span className='text-[8px] font-black text-gray-400 uppercase tracking-widest'>Registry Access</span>
                          <span className='text-[10px] font-black text-black uppercase'>View Details</span>
                        </div>
                      </div>
                      <Link href={`/user/order/${items?.id}`} className="shrink-0 ml-auto md:ml-0">
                        <div className='px-6 md:px-3 py-3 md:py-3 bg-black text-white md:bg-gray-50 md:text-black rounded-xl hover:bg-black hover:text-white transition-all duration-300 flex items-center gap-2'>
                          <span className='md:hidden text-[10px] font-black uppercase tracking-widest'>Access</span>
                          <ChevronRight size={18} />
                        </div>
                      </Link>
                    </div>
                  </div >
                </div >
              )
            })}
          </div >
        </div >
      ) : (
        <div className='flex flex-col items-center justify-center py-24 gap-8 border border-gray-100 rounded-3xl bg-gray-50/30'>
          <div className='w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl shadow-gray-200/50 text-gray-200'>
            <Package size={32} />
          </div>
          <div className='flex flex-col items-center gap-2 text-center px-6'>
            <h3 className='text-xl font-black text-black uppercase tracking-tight'>Log Empty</h3>
            <p className='text-xs text-gray-400 font-bold uppercase tracking-widest max-w-[280px] leading-relaxed'>
              Your acquisition history is currently unrecorded.
            </p>
          </div>
          <Link href="/collections">
            <button className='px-8 py-4 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-black/10 hover:-translate-y-1 transition-all active:scale-95'>
              Explore Vaults
            </button>
          </Link>
        </div>
      )}
    </section >
  )
}

export default OrderplacedSection
