import React, { useMemo } from 'react'
import Image from 'next/image'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Colors, Sizes, newCartItem, useCartContext } from '@/Contexts/Cart.context';
import { Trash2, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import WhatsAppCartButton from './CartWhatsAppbutton';

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
};

interface CartCardProps {
    data: newCartItem
}

function CartCard({ data }: CartCardProps) {
    const { updateQuantity, removeFromCart } = useCartContext()

    const handleQuantityChange = (quantity: number) => {
        if (!data || !data.variant) return;
        updateQuantity({
            productId: data.productId,
            colorName: data.variant.selectedColor,
            size: data.variant.selectedSize,
            quantity: quantity,
        });
    }

    const { originalPrice, discountPercent, finalPrice } = useMemo(() => {
        const price = data.variant?.price || 0;
        const discount = data.variant?.discounts?.discount_persent || 0;

        if (discount > 0) {
            const discountAmount = price * (discount / 100);
            return {
                originalPrice: price,
                discountPercent: discount,
                finalPrice: Math.floor(price - discountAmount)
            };
        }

        return {
            originalPrice: price,
            discountPercent: 0,
            finalPrice: price
        };
    }, [data.variant?.price, data.variant?.discounts]);

    const primaryImage = data.variant?.image_url?.[0]?.image_url || '';

    return (
        <div className='group relative w-full bg-white border border-gray-300 rounded-2xl p-4 transition-all hover:shadow-lg hover:shadow-gray-100/50 flex flex-col sm:flex-row gap-5 items-start sm:items-center'>
            {/* Image Section */}
            <div className='relative w-full sm:w-32 h-40 sm:h-32 bg-gray-50 rounded-xl overflow-hidden shrink-0'>
                {primaryImage ? (
                    <Image
                        src={primaryImage}
                        alt={data.productName}
                        fill
                        className='object-cover transition-transform duration-500 group-hover:scale-110'
                        sizes='(max-width: 640px) 100vw, 128px'
                    />
                ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-xs text-gray-400">No Image</div>
                )}
            </div>

            {/* Info Section */}
            <div className='flex-1 flex flex-col gap-2 w-full'>
                <div className='flex justify-between items-start gap-4'>
                    <Link href={`/product/${data.slug}`} className='group/link'>
                        <h3 className='text-base md:text-lg font-bold text-primary line-clamp-1  transition-colors flex items-center gap-1'>
                            {data.productName}
                            <ExternalLink size={14} className='opacity-0 group-hover/link:opacity-100 transition-opacity' />
                        </h3>
                    </Link>
                    <button
                        onClick={() => removeFromCart({ productId: data.productId, colorName: data.variant?.selectedColor, size: data.variant?.selectedSize })}
                        className='p-2 text-gray-400 hover:text-red-500 hover:bg-red-100 rounded-lg  border border-gray-200 transition-all'
                        title='Remove item'
                    >
                        <Trash2 size={18} />
                    </button>
                </div>

                <div className='flex flex-wrap gap-x-4 gap-y-1 text-xs font-bold uppercase tracking-wider text-gray-400'>
                    <div className='flex items-center gap-1.5'>
                        <span className='w-1 h-1 rounded-full bg-gray-300'></span>
                        <span>Size: <span className='text-primary'>{data.variant?.selectedSize?.size || ''}</span></span>
                    </div>
                    <div className='flex items-center gap-1.5'>
                        <span className='w-1 h-1 rounded-full bg-gray-300'></span>
                        <span>Color: <span className='text-primary'>{data.variant?.selectedColor?.name || ''}</span></span>
                    </div>
                </div>

                <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2'>
                    {/* Price Section */}
                    <div className='flex items-baseline gap-2'>
                        <span className='text-xl font-bold text-primary'>{formatPrice(finalPrice)}</span>
                        {discountPercent > 0 && (
                            <>
                                <span className='text-sm text-gray-400 line-through'>{formatPrice(originalPrice)}</span>
                                <span className='text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full'>
                                    {discountPercent}% OFF
                                </span>
                            </>
                        )}
                    </div>

                    {/* Actions Section */}
                    <div className='flex items-center gap-3'>
                        <div className='flex items-center gap-2'>
                            <span className='text-[10px] font-bold uppercase tracking-widest text-gray-400'>Qty</span>
                            <Select defaultValue={data.quantity.toString()} onValueChange={(val) => handleQuantityChange(parseInt(val))}>
                                <SelectTrigger className="w-20 h-9 rounded-lg border-gray-300 font-bold text-sm bg-gray-50/50 hover:bg-gray-50">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {[1, 2, 3, 4, 5].map((num) => (
                                        <SelectItem key={num} value={num.toString()} className='font-medium'>
                                            {num}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className='h-8 w-[1px] bg-gray-100 hidden sm:block'></div>
                        {/* <WhatsAppCartButton cartItem={data as any} /> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CartCard
