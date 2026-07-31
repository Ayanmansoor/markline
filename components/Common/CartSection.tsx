
'use client'
import React, { useEffect, useMemo, useState } from 'react'
import CartCard from './CartCard'
import Link from 'next/link'
import { ArrowLeft, MessageSquare, Truck, ShieldCheck, CreditCard, RotateCcw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import CartSkeleton from '../Skeleton/CartSkeleton'
import { useCartContext } from '@/Contexts/Cart.context'
import Checkout from './Checkout'
import { mysupabase } from '@/Supabase/SupabaseConfig'
import axios from 'axios'

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
};

const calculateDiscountedPrice = (price: number, discountPercent: number) => {
    if (discountPercent > 0) {
        const discountAmount = price * (discountPercent / 100);
        return price - discountAmount;
    }
    return price;
};

function CartSection() {
    const { cart, clearCart } = useCartContext()
    const [loading, setLoading] = useState(true)
    const [currentUser, setCurrentUser] = useState<any>(null)
    const [couponCode, setCouponCode] = useState<string>('')
    const [appliedCoupon, setAppliedCoupon] = useState<{
        code: string;
        coupon_id: string;
        discountAmount: number;
        title: string;
    } | null>(null)
    const [couponError, setCouponError] = useState<string | null>(null)
    const [isApplying, setIsApplying] = useState(false)

    const { totalOriginalPrice, totalDiscountAmount, finalCartTotal } = useMemo(() => {
        let totalOriginalPrice = 0;
        let totalDiscountAmount = 0;
        let finalCartTotal = 0;

        cart.forEach((item) => {
            if (!item || !item.variant) return;
            const unitPrice = item.variant.price || 0;
            const quantity = item.quantity || 0;
            const discountPercent = item.variant.discounts?.discount_persent || 0;

            const originalItemTotal = unitPrice * quantity;
            totalOriginalPrice += originalItemTotal;

            const discountedUnitPrice = calculateDiscountedPrice(unitPrice, discountPercent);
            const discountedItemTotal = discountedUnitPrice * quantity;
            finalCartTotal += discountedItemTotal;

            const discountPerUnit = unitPrice - discountedUnitPrice;
            const itemDiscountTotal = discountPerUnit * quantity;
            totalDiscountAmount += itemDiscountTotal;
        });

        return {
            totalOriginalPrice: Math.round(totalOriginalPrice),
            totalDiscountAmount: Math.round(totalDiscountAmount),
            finalCartTotal: Math.round(finalCartTotal),
        };
    }, [cart]);

    useEffect(() => {
        async function getSupabaseUser() {
            try {
                const { data: { user } } = await mysupabase.auth.getUser();
                if (user) {
                    setCurrentUser(user);
                }
            } catch (err) {
                console.error("Error fetching user:", err);
            }
        }
        getSupabaseUser();
    }, []);

    const handleApplyCoupon = async (codeToApply: string) => {
        if (!codeToApply.trim()) return;
        setIsApplying(true);
        setCouponError(null);
        try {
            const response = await axios.post('/api/validate-coupon', {
                code: codeToApply,
                userId: currentUser?.id || null,
                subtotal: finalCartTotal
            });

            if (response.data.valid) {
                setAppliedCoupon({
                    code: response.data.coupon.code,
                    coupon_id: response.data.coupon.coupon_id,
                    discountAmount: response.data.discountAmount,
                    title: response.data.coupon.title
                });
                toast.success(`Coupon "${response.data.coupon.code}" applied successfully!`);
            } else {
                setCouponError(response.data.message || "Invalid coupon code");
                toast.error(response.data.message || "Invalid coupon code");
            }
        } catch (error: any) {
            console.error("Error applying coupon:", error);
            setCouponError("Failed to apply coupon. Please try again.");
            toast.error("Failed to apply coupon");
        } finally {
            setIsApplying(false);
        }
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setCouponCode('');
        setCouponError(null);
        toast.info("Coupon removed");
    };

    useEffect(() => {
        if (appliedCoupon) {
            const reValidate = async () => {
                try {
                    const response = await axios.post('/api/validate-coupon', {
                        code: appliedCoupon.code,
                        userId: currentUser?.id || null,
                        subtotal: finalCartTotal
                    });
                    if (response.data.valid) {
                        setAppliedCoupon(prev => prev ? {
                            ...prev,
                            discountAmount: response.data.discountAmount
                        } : null);
                    } else {
                        setAppliedCoupon(null);
                        setCouponError(`Coupon removed: ${response.data.message}`);
                        toast.error(`Coupon removed: ${response.data.message}`);
                    }
                } catch (err) {
                    console.error("Error re-validating coupon:", err);
                }
            };
            reValidate();
        }
    }, [finalCartTotal, currentUser?.id]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false)
        }, 1200) // simulate loading
        return () => clearTimeout(timer)
    }, [])

    function clearCard() {
        clearCart()
        toast.success("Bag cleared successfully")
    }

    return (
        <section className='max-w-[1440px] mx-auto px-5 lg:px-10 xl:px-20 py-10 lg:py-16'>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className='flex items-center justify-between mb-2  border-b border-gray-100 pb-6'
            >
                <div className='flex flex-col gap-1'>
                    <h1 className='text-3xl md:text-4xl font-bold tracking-tight text-primary '>Your Bag</h1>
                    <p className='text-sm text-gray-500 font-medium tracking-wide'>{cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart</p>
                </div>
                {cart.length > 0 && (
                    <button
                        onClick={clearCard}
                        className='text-xs font-bold  tracking-widest text-red-500 hover:text-red-600 transition-colors py-2'
                    >
                        Clear All
                    </button>
                )}
            </motion.div>

            <div className='grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-16 items-start'>
                {/* Cart Items Column */}
                <div className='lg:col-span-8 flex flex-col gap-6'>
                    <div className='flex flex-col gap-4 min-h-[400px]'>
                        {loading ? (
                            Array.from({ length: 3 }).map((_, index) => (
                                <CartSkeleton key={index} />
                            ))
                        ) : (
                            <AnimatePresence mode='popLayout'>
                                {cart.length > 0 ? (
                                    cart.map((item, index) => (
                                        <motion.div
                                            key={`${item.productId}-${item.variant.selectedColor.name}-${item.variant.selectedSize.size}`}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ duration: 0.3, delay: index * 0.05 }}
                                        >
                                            <CartCard data={item} />
                                        </motion.div>
                                    ))
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className='flex flex-col items-center justify-center py-20 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200'
                                    >
                                        <div className='bg-white p-4 rounded-full shadow-sm mb-4'>
                                            <Truck className='text-gray-400' size={32} />
                                        </div>
                                        <h3 className='text-xl font-semibold text-primary mb-2'>Your bag is empty</h3>
                                        <p className='text-gray-500 mb-6'>Looks like you haven&apos;t added anything yet.</p>
                                        <Link
                                            href='/products'
                                            className='px-8 py-3 bg-black text-white text-xs font-bold  tracking-widest hover:bg-gray-800 transition-all rounded-full'
                                        >
                                            Start Shopping
                                        </Link>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        )}
                    </div>

                    <Link
                        href='/products'
                        className="flex items-center gap-2 text-sm font-bold  tracking-widest text-primary hover:gap-3 transition-all mt-4 w-fit group"
                    >
                        <ArrowLeft size={18} className='group-hover:translate-x-[-2px] transition-transform' />
                        Continue Shopping
                    </Link>

                    {/* Trust Badges - Desktop Only (visible below items) */}
                    <div className='hidden lg:grid grid-cols-3 gap-6 mt-16 pt-10 border-t border-gray-100'>
                        <div className='flex items-start gap-4'>
                            <div className='bg-gray-50 p-3 rounded-xl'>
                                <ShieldCheck className='text-primary' size={24} strokeWidth={1.5} />
                            </div>
                            <div>
                                <h4 className='text-sm font-bold text-primary  tracking-tight'>Secure Checkout</h4>
                                <p className='text-xs text-gray-500 mt-1 leading-relaxed'>SSL encrypted payment processing for your security.</p>
                            </div>
                        </div>
                        <div className='flex items-start gap-4'>
                            <div className='bg-gray-50 p-3 rounded-xl'>
                                <RotateCcw className='text-primary' size={24} strokeWidth={1.5} />
                            </div>
                            <div>
                                <h4 className='text-sm font-bold text-primary  tracking-tight'>Easy Returns</h4>
                                <p className='text-xs text-gray-500 mt-1 leading-relaxed'>Hassle-free 14-day return policy for peace of mind.</p>
                            </div>
                        </div>
                        <div className='flex items-start gap-4'>
                            <div className='bg-gray-50 p-3 rounded-xl'>
                                <CreditCard className='text-primary' size={24} strokeWidth={1.5} />
                            </div>
                            <div>
                                <h4 className='text-sm font-bold text-primary  tracking-tight'>Payment Options</h4>
                                <p className='text-xs text-gray-500 mt-1 leading-relaxed'>Multiple secure ways to pay: Cards, UPI, Netbanking.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Summary Column */}
                <aside className='lg:col-span-4 sticky top-28'>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <Checkout
                            totalMrp={totalOriginalPrice}
                            totaldiscount={totalDiscountAmount}
                            totalPrice={Math.max(0, finalCartTotal - (appliedCoupon ? appliedCoupon.discountAmount : 0))}
                            coupondiscount={appliedCoupon ? appliedCoupon.discountAmount : 0}
                            appliedCoupon={appliedCoupon}
                            couponCode={couponCode}
                            setCouponCode={setCouponCode}
                            couponError={couponError}
                            isApplying={isApplying}
                            onApplyCoupon={handleApplyCoupon}
                            onRemoveCoupon={handleRemoveCoupon}
                        />
                    </motion.div>

                    {/* Mobile Trust Badges (visible below summary) */}
                    <div className='lg:hidden flex flex-col gap-6 mt-10 p-6 bg-gray-50 rounded-2xl'>
                        <div className='flex items-center gap-4'>
                            <ShieldCheck className='text-primary' size={20} />
                            <span className='text-xs font-bold  tracking-tight'>Secure Encrypted Payments</span>
                        </div>
                        <div className='flex items-center gap-4'>
                            <RotateCcw className='text-primary' size={20} />
                            <span className='text-xs font-bold  tracking-tight'>14-Day Hassle-Free Returns</span>
                        </div>
                        <div className='flex items-center gap-4'>
                            <CreditCard className='text-primary' size={20} />
                            <span className='text-xs font-bold  tracking-tight'>Cards, UPI & Net Banking</span>
                        </div>
                    </div>
                </aside>
            </div>
        </section>
    )
}

export default CartSection
