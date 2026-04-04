import Link from 'next/link';
import React from 'react';
import CheckOutButton from './CheckoutButton';
import { CreditCard, Tag, ArrowRight } from 'lucide-react';

interface CheckoutProps {
    totalPrice: number;
    totalMrp: number;
    totaldiscount: number;
    coupondiscount: number;
}

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
};

function Checkout({
    totalPrice,
    totalMrp,
    totaldiscount,
    coupondiscount,
}: CheckoutProps) {

    return (
        <section className="bg-white border border-gray-300 rounded-3xl p-6 lg:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-primary uppercase tracking-tight mb-6">Order Summary</h2>

            {totalPrice > 0 ? (
                <div className="flex flex-col gap-5">
                    {/* Price Breakdown */}
                    <div className="flex flex-col gap-3 pb-6 border-b border-gray-50">
                        <div className="flex justify-between items-center group">
                            <span className="text-sm font-medium text-gray-500 group-hover:text-primary transition-colors">Original Price (MRP)</span>
                            <span className="text-sm font-bold text-primary">{formatPrice(totalMrp)}</span>
                        </div>

                        {totaldiscount > 0 && (
                            <div className="flex justify-between items-center group">
                                <span className="text-sm font-medium text-gray-500 flex items-center gap-1.5 group-hover:text-green-600 transition-colors">
                                    <Tag size={14} /> Product Discount
                                </span>
                                <span className="text-sm font-bold text-green-600">-{formatPrice(totaldiscount)}</span>
                            </div>
                        )}

                        {coupondiscount > 0 && (
                            <div className="flex justify-between items-center group">
                                <span className="text-sm font-medium text-gray-500 flex items-center gap-1.5 group-hover:text-green-600 transition-colors">
                                    <Tag size={14} /> Coupon Discount
                                </span>
                                <span className="text-sm font-bold text-green-600">-{formatPrice(coupondiscount)}</span>
                            </div>
                        )}

                        <div className="flex justify-between items-center group">
                            <span className="text-sm font-medium text-gray-500 group-hover:text-primary transition-colors">Shipping Fee</span>
                            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full uppercase tracking-widest">Free</span>
                        </div>
                    </div>

                    {/* Total */}
                    <div className="flex justify-between items-center pt-2">
                        <span className="text-lg font-bold text-primary uppercase tracking-tight">Total Payable</span>
                        <div className='flex flex-col items-end'>
                            <span className="text-2xl font-black text-primary tracking-tighter">{formatPrice(totalPrice)}</span>
                            <p className='text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1'>Inclusive of all taxes</p>
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-6">
                        <CheckOutButton>
                            <button className="w-full bg-black text-white text-sm  md:text-base h-14 rounded-2xl font-bold uppercase  hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 group">
                                Proceed to Checkout
                                <ArrowRight size={18} className='group-hover:translate-x-1 transition-transform' />
                            </button>
                        </CheckOutButton>
                    </div>

                    {/* Trust Indicators */}
                    <div className="mt-6 pt-6 border-t border-gray-50 flex flex-col gap-4">
                        <div className='flex items-center justify-center gap-3 opacity-60 grayscale hover:grayscale-0 transition-all cursor-default'>
                            <img src="/paymentOption.svg" alt="Payments" className="h-6 object-contain" />
                        </div>
                        <p className="text-[10px] text-center font-medium text-gray-400 leading-relaxed max-w-[200px] mx-auto">
                            Secure payment options powered by industry leading providers.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-6 py-8">
                    <div className='bg-gray-50 p-4 rounded-full'>
                        <CreditCard className='text-gray-300' size={32} />
                    </div>
                    <p className="text-sm font-medium text-gray-500 text-center">Your summary will appear once you add items to the bag.</p>
                    <Link href="/products" className="w-full">
                        <button className="w-full bg-black text-white h-12 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-gray-800 transition-all">
                            Start Shopping
                        </button>
                    </Link>
                </div>
            )}
        </section>
    );
}

export default Checkout;
