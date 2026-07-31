'use client'
import React from 'react'
import Link from 'next/link'
import { ChevronRight, Package, Calendar, Tag, ShieldCheck, Clock, CheckCircle2, AlertTriangle } from 'lucide-react'
import { BsWhatsapp } from 'react-icons/bs'

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
      const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
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
      const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
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

  return (
    <section className='w-full flex flex-col gap-8'>
      {orders && orders.length > 0 ? (
        <div className='flex flex-col gap-6'>
          <div className='flex items-center justify-between px-2'>
            <span className='text-[10px] font-black uppercase tracking-[0.3em] text-gray-400'>
              Total Acquisition Records: {orders.length}
            </span>
          </div>

          <div className='flex flex-col gap-6'>
            {orders.map((order) => {
              const orderId = order.id ? order.id.toString() : '';
              const shortId = orderId.length > 8 ? orderId.slice(0, 8).toUpperCase() : orderId.toUpperCase();
              const itemsList: any[] = order.order_items && order.order_items.length > 0 ? order.order_items : [order];
              const totalItems = itemsList.reduce((acc, curr) => acc + (curr.quantity || 1), 0);

              const fulfillmentStatus = (order.fulfillment_status || order.isDelivered || 'pending').toString().toUpperCase();
              const paymentStatus = (order.payment_status || 'paid').toString().toUpperCase();

              const calculatedTotal = order.grand_total ? Number(order.grand_total) : itemsList.reduce((acc, curr) => acc + (Number(curr.final_price) * (curr.quantity || 1)), 0);

              const firstItem = itemsList[0];
              const firstImage = getImageUrl(firstItem);
              const firstProductName = firstItem?.product?.name || firstItem?.name || 'Markline Creation';

              return (
                <div
                  key={orderId}
                  className='group bg-white border border-gray-300 rounded-2xl p-5 md:p-8 hover:border-black/20 transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/50 relative overflow-hidden flex flex-col gap-6'
                >
                  {/* Status Indicator Stripe */}
                  <div className={`absolute top-0 left-0 w-1.5 h-full ${fulfillmentStatus === 'DELIVERED' ? 'bg-emerald-500' :
                    fulfillmentStatus === 'SHIPPED' ? 'bg-blue-500' :
                      fulfillmentStatus === 'CANCELLED' ? 'bg-red-500' : 'bg-amber-500'
                    }`} />

                  {/* Top Bar: Order ID, Date, Badges */}
                  <div className='flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-4'>
                    <div className='flex flex-wrap items-center gap-3 md:gap-6'>
                      <div className='flex items-center gap-1.5'>
                        <Tag size={13} className='text-gray-400' />
                        <span className='text-xs font-black text-black uppercase tracking-widest'>
                          #ORD-{shortId}
                        </span>
                      </div>

                      <div className='flex items-center gap-1.5 text-gray-400'>
                        <Calendar size={13} />
                        <span className='text-[11px] font-bold uppercase tracking-wider'>
                          {formatDate(order.created_at)}
                        </span>
                      </div>
                    </div>

                    <div className='flex items-center gap-2'>
                      {/* Payment Status Badge */}
                      <span className={`text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-md border ${paymentStatus === 'PAID' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                        paymentStatus === 'FAILED' ? 'bg-red-50 text-red-600 border-red-100' :
                          'bg-amber-50 text-amber-600 border-amber-100'
                        }`}>
                        Payment: {paymentStatus}
                      </span>

                      {/* Fulfillment Status Badge */}
                      <span className={`text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-md border ${fulfillmentStatus === 'DELIVERED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                        fulfillmentStatus === 'SHIPPED' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                          fulfillmentStatus === 'CANCELLED' ? 'bg-red-50 text-red-600 border-red-100' :
                            'bg-amber-50 text-amber-600 border-amber-100'
                        }`}>
                        {fulfillmentStatus}
                      </span>
                    </div>
                  </div>

                  {/* Middle Content: Items Preview & Order Summary */}
                  <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-6'>
                    {/* Items Thumbnails and Names */}
                    <div className='flex items-center gap-4 flex-1 w-full'>
                      <div className='flex -space-x-3 overflow-hidden shrink-0 py-1'>
                        {itemsList.slice(0, 3).map((item: any, idx: number) => {
                          const img = getImageUrl(item);
                          return (
                            <div
                              key={idx}
                              className='w-16 h-20 md:w-20 md:h-24 bg-gray-50 rounded-xl overflow-hidden border-2 border-white shadow-sm shrink-0'
                            >
                              <img
                                src={img || "/placeholder.svg"}
                                alt={item?.product?.name || "Product"}
                                className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
                              />
                            </div>
                          )
                        })}
                      </div>

                      <div className='flex flex-col gap-1 flex-1 min-w-0'>
                        <h3 className='font-black text-black text-sm md:text-base uppercase tracking-tight truncate italic'>
                          {firstProductName}
                        </h3>
                        <p className='text-[10px] font-bold text-gray-400 uppercase tracking-widest'>
                          {itemsList.length > 1
                            ? `+ ${itemsList.length - 1} additional item${itemsList.length - 1 > 1 ? 's' : ''} (${totalItems} total pcs)`
                            : `Qty: ${itemsList[0]?.quantity || 1} unit`}
                        </p>
                        {order.coupon_code && (
                          <span className='inline-flex items-center gap-1 text-[9px] font-black text-emerald-600 uppercase tracking-widest mt-1'>
                            Coupon Applied: {order.coupon_code}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Grand Total & Actions */}
                    <div className='flex items-center justify-between md:justify-end w-full md:w-auto gap-6 border-t md:border-t-0 border-gray-100 pt-4 md:pt-0'>
                      <div className='flex flex-col items-start md:items-end'>
                        <span className='text-[9px] font-black text-gray-400 uppercase tracking-widest'>Grand Total</span>
                        <span className='text-lg md:text-xl font-black text-black tracking-tight'>
                          {formatPrice(calculatedTotal)}
                        </span>
                      </div>

                      <div className='flex items-center gap-3'>
                        <button
                          onClick={() => {
                            const msg = `Hi Markline, I'd like to track my order #ORD-${shortId}. Current Status: ${fulfillmentStatus}. Total: ${formatPrice(calculatedTotal)}`;
                            window.open(`https://wa.me/919769020660?text=${encodeURIComponent(msg)}`, '_blank');
                          }}
                          className='p-3 bg-[#25D366] text-white rounded-xl shadow-md shadow-green-200 hover:scale-105 active:scale-95 transition-all'
                          title="Track via WhatsApp"
                        >
                          <BsWhatsapp size={16} />
                        </button>

                        <Link href={`/user/order/${orderId}`} className="shrink-0">
                          <button className='px-5 py-3 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-gray-800 transition-all duration-300 flex items-center gap-2 shadow-lg shadow-black/10 active:scale-95'>
                            <span>Details</span>
                            <ChevronRight size={14} />
                          </button>
                        </Link>
                      </div>
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
            <h3 className='text-xl font-black text-black  tracking-tight'>No Orders</h3>
            <p className='text-xs text-gray-400 font-bold  tracking-widest max-w-[280px] leading-relaxed'>
              Your acquisition history is currently unrecorded.
            </p>
          </div>
          <Link href="/collections">
            <button className='px-8 py-4 bg-black text-white rounded-xl text-[10px] font-black  tracking-[0.2em] shadow-xl shadow-black/10 hover:-translate-y-1 transition-all active:scale-95'>
              Explore Vaults
            </button>
          </Link>
        </div>
      )}
    </section>
  )
}

export default OrderplacedSection
