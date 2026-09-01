'use client'
import React from 'react'
import Link from 'next/link'
import { ChevronRight, Package, Calendar, Tag, ShieldCheck, Clock, CheckCircle2, AlertTriangle } from 'lucide-react'
import { BsWhatsapp } from 'react-icons/bs'
import { safeJsonParse } from '@/lib/utils'

export interface ordersprops {
  orders: any[],
  handleperform: () => void
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price || 0);
};

const formatDate = (isoString?: string) => {
  if (!isoString) return '';
  return new Date(isoString).toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric'
  });
};

const getImageUrl = (item: any) => {
  if (!item) return '';
  // Check variant image
  if (item.variant?.image_url) {
    const raw = Array.isArray(item.variant.image_url) ? item.variant.image_url[0] : item.variant.image_url;
    try {
      const parsed = typeof raw === 'string' ? safeJsonParse(raw) : raw;
      if (parsed?.image_url) return parsed.image_url;
      if (typeof raw === 'string' && raw.startsWith('http')) return raw;
    } catch {
      if (typeof raw === 'string') return raw;
    }
  }
  // Check product image
  if (item.product?.image_url) {
    const raw = Array.isArray(item.product.image_url) ? item.product.image_url[0] : item.product.image_url;
    try {
      const parsed = typeof raw === 'string' ? safeJsonParse(raw) : raw;
      if (parsed?.image_url) return parsed.image_url;
      if (typeof raw === 'string' && raw.startsWith('http')) return raw;
    } catch {
      if (typeof raw === 'string') return raw;
    }
  }
  if (item.product?.image_urls && Array.isArray(item.product.image_urls) && item.product.image_urls.length > 0) {
    return item.product.image_urls[0]?.image_url || item.product.image_urls[0]?.url || '';
  }
  if (typeof item.image_url === 'string') return item.image_url;
  return '';
};

function OrderplacedSection({ orders, handleperform }: ordersprops) {
  const capitalize = (str: string) => {
    if (!str) return '';
    const s = str.toString();
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  };

  return (
    <section className='w-full flex flex-col gap-8'>
      {orders && orders.length > 0 ? (
        <div className='flex flex-col gap-6'>
          <div className='flex items-center justify-between px-2'>
            <span className='text-xs font-semibold text-gray-500 tracking-wider'>
              Total Acquisition Records: {orders.length}
            </span>
          </div>

          <div className='grid grid-cols-1 gap-6'>
            {orders.map((order) => {
              const orderId = order.id ? order.id.toString() : '';
              const shortId = orderId.length > 8 ? orderId.slice(0, 8).toUpperCase() : orderId.toUpperCase();
              const itemsList: any[] = order.order_items && order.order_items.length > 0 ? order.order_items : [order];
              const totalItems = itemsList.reduce((acc, curr) => acc + (curr.quantity || 1), 0);

              const rawPayment = (order.payment_status || 'paid').toString();
              const paymentStatus = capitalize(rawPayment);

              const firstItem = itemsList[0];
              const firstImage = getImageUrl(firstItem);
              const firstProductName = firstItem?.product?.name || firstItem?.name || 'Markline Creation';

              return (
                <div
                  key={orderId}
                  className='group bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-300 hover:shadow-md transition-all duration-300 flex flex-col gap-5 shadow-sm'
                >
                  {/* Top Bar: Order ID, Date, Badges */}
                  <div className='flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-3'>
                    <div className='flex flex-wrap items-center gap-6'>
                      <div className='flex items-center gap-2'>
                        <Tag size={14} className='text-gray-400' />
                        <span className='text-sm font-semibold text-gray-900 tracking-wide'>
                          #Ord-{shortId}
                        </span>
                      </div>

                      <div className='flex items-center gap-2 text-gray-400'>
                        <Calendar size={14} />
                        <span className='text-xs font-medium tracking-wide text-gray-500'>
                          {formatDate(order.created_at)}
                        </span>
                      </div>
                    </div>

                    <div className='flex items-center gap-2'>
                      {/* Payment Status Badge */}
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-md border ${
                        paymentStatus.toLowerCase() === 'paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        paymentStatus.toLowerCase() === 'failed' ? 'bg-red-50 text-red-700 border-red-200' :
                        'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        Payment: {paymentStatus}
                      </span>
                    </div>
                  </div>

                  {/* Middle Content: Items Preview & Order Summary */}
                  <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4'>
                    {/* Items Thumbnails and Names */}
                    <div className='flex items-start gap-4 flex-1 w-full'>
                      <div className='w-20 h-24 bg-gray-50 border border-gray-100 rounded-lg overflow-hidden shrink-0 flex items-center justify-center'>
                        <img
                          src={firstImage || "/placeholder.svg"}
                          alt={firstProductName}
                          className='w-full h-full object-contain'
                        />
                      </div>

                      <div className='flex flex-col gap-1 flex-1 min-w-0 pt-1'>
                        <h3 className='font-semibold text-gray-900 text-sm tracking-tight line-clamp-2'>
                          {firstProductName}
                        </h3>
                        <p className='text-xs font-medium text-gray-500 mt-1'>
                          {itemsList.length > 1
                            ? `+ ${itemsList.length - 1} additional item${itemsList.length - 1 > 1 ? 's' : ''} (${totalItems} total pcs)`
                            : `Qty: ${itemsList[0]?.quantity || 1} Unit`}
                        </p>
                      </div>
                    </div>

                    {/* Price & Actions */}
                    <div className='flex flex-row items-center gap-4 shrink-0 mt-4 md:mt-0 border-t md:border-t-0 border-gray-100 pt-3 md:pt-0 w-full md:w-auto justify-between md:justify-end'>
                      <div className='flex flex-col items-start md:items-end gap-0.5'>
                        <span className='text-[10px] capitalize font-bold tracking-wider text-gray-400'>Total Amount</span>
                        <span className='text-sm font-black text-gray-900'>{formatPrice(order.grand_total || order.final_price || order.total_amount || order.total_price || 0)}</span>
                      </div>
                      <Link href={`/user/order/${orderId}`}>
                        <button className='px-5 py-2.5 bg-black text-white rounded-lg text-xs font-bold hover:bg-gray-800 transition-colors shadow-sm'>
                          View Details
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center py-24 gap-8 border border-gray-100 rounded-3xl bg-gray-50/30'>
          <div className='w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl shadow-gray-200/50 text-gray-200'>
            <Package size={32} />
          </div>
          <div className='flex flex-col items-center gap-2 text-center px-6'>
            <h3 className='text-xl font-bold text-black tracking-tight'>No Orders</h3>
            <p className='text-xs text-gray-400 font-medium tracking-wide max-w-[280px] leading-relaxed'>
              Your acquisition history is currently unrecorded.
            </p>
          </div>
          <Link href="/collections">
            <button className='px-6 py-3 bg-black text-white rounded-xl text-xs font-medium tracking-wide shadow-md hover:bg-gray-800 transition-all active:scale-95'>
              Explore Collections
            </button>
          </Link>
        </div>
      )}
    </section>
  )
}

export default OrderplacedSection
