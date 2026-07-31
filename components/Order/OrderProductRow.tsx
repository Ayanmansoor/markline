import React from 'react'
import { Colors, Images, Sizes } from '@/types/interfaces'
import Link from 'next/link'

interface OrderProductRowProps {
    item: any;
}

const parseColor = (rawColor: any): string => {
    if (!rawColor) return 'Standard';
    if (typeof rawColor === 'string') {
        try {
            const parsed = JSON.parse(rawColor);
            return parsed.name || parsed.color || rawColor;
        } catch {
            return rawColor;
        }
    }
    return rawColor.name || 'Standard';
};

const parseSize = (rawSize: any): string => {
    if (!rawSize) return 'Standard';
    if (typeof rawSize === 'string') {
        try {
            const parsed = JSON.parse(rawSize);
            return parsed.size ? `${parsed.size} ${parsed.unit || ''}`.trim() : rawSize;
        } catch {
            return rawSize;
        }
    }
    return rawSize.size ? `${rawSize.size} ${rawSize.unit || ''}`.trim() : 'Standard';
};

const parseImageUrl = (item: any): string => {
    if (!item) return '/placeholder.svg';

    // 1. Variant image
    const variantObj = item.variant || item.variant_id;
    if (variantObj?.image_url) {
        const raw = Array.isArray(variantObj.image_url) ? variantObj.image_url[0] : variantObj.image_url;
        try {
            const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
            if (parsed?.image_url) return parsed.image_url;
            if (typeof raw === 'string' && raw.startsWith('http')) return raw;
        } catch {
            if (typeof raw === 'string') return raw;
        }
    }

    // 2. Product image
    const prodObj = item.product;
    if (prodObj?.image_url) {
        const raw = Array.isArray(prodObj.image_url) ? prodObj.image_url[0] : prodObj.image_url;
        try {
            const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
            if (parsed?.image_url) return parsed.image_url;
            if (typeof raw === 'string' && raw.startsWith('http')) return raw;
        } catch {
            if (typeof raw === 'string') return raw;
        }
    }

    if (prodObj?.image_urls && Array.isArray(prodObj.image_urls) && prodObj.image_urls.length > 0) {
        return prodObj.image_urls[0]?.image_url || prodObj.image_urls[0]?.url || '/placeholder.svg';
    }

    if (typeof item.image_url === 'string') return item.image_url;
    return '/placeholder.svg';
};

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price || 0);
};

export function OrderProductRow({ item }: OrderProductRowProps) {
    const productName = item.product?.name || item.name || 'Markline Exclusive Item';
    const colorStr = parseColor(item.color);
    const sizeStr = parseSize(item.size);
    const imgUrl = parseImageUrl(item);

    const unitPrice = Number(item.unit_price || item.final_price || 0);
    const finalPrice = Number(item.final_price || (unitPrice * (item.quantity || 1)));
    const discount = Number(item.discount_amount || 0);
    const productSlug = item.product?.slug;

    return (
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between py-6 border-b border-gray-100 last:border-0 gap-6 group">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 flex-1 w-full">
                <div className="w-20 h-24 sm:w-24 sm:h-28 bg-gray-50 flex-shrink-0 overflow-hidden rounded-xl border border-gray-100 shadow-sm relative">
                    <img
                        src={imgUrl}
                        alt={productName}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                </div>

                <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                    {productSlug ? (
                        <Link href={`/products/${productSlug}`} className="hover:underline">
                            <h4 className="text-xs sm:text-sm font-black  line-clam-1 tracking-widest text-black italic truncate">
                                {productName?.slice(1, 30)}
                            </h4>
                        </Link>
                    ) : (
                        <h4 className="text-xs sm:text-sm font-black  line-clam-1 tracking-widest text-black italic truncate">
                            {productName?.slice(1, 30)}
                        </h4>
                    )}

                    <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold text-gray-400  tracking-[0.2em]">
                        <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
                            <span className="text-gray-600">Clr:</span> {colorStr}
                        </span>
                        <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
                            <span className="text-gray-600">Sz:</span> {sizeStr}
                        </span>
                    </div>

                    {discount > 0 && (
                        <span className="text-xs font-black text-emerald-900  tracking-widest">
                            Item Discount: -{formatPrice(discount)}
                        </span>
                    )}
                </div>
            </div>

            <div className="flex items-center justify-between w-full md:w-fit md:justify-end gap-8 border-t md:border-t-0 border-gray-50 pt-3 md:pt-0">
                <div className="flex flex-col items-start md:items-end gap-0.5">
                    <span className="text-xs font-black  tracking-widest text-gray-600">Unit Price</span>
                    <span className="text-sm font-semibold text-gray-600">{formatPrice(unitPrice)}</span>
                </div>

                <div className="flex flex-col items-start md:items-end gap-0.5">
                    <span className="text-xs font-black  tracking-widest text-gray-600">Quantity</span>
                    <span className="text-sm font-black text-black bg-gray-100 px-2 py-0.5 rounded-md">× {item.quantity || 1}</span>
                </div>

                <div className="flex flex-col items-start md:items-end gap-0.5">
                    <span className="text-xs font-black  tracking-widest text-gray-600">Final Item Price</span>
                    <span className="text-sm sm:text-sm font-black text-black tracking-tight">{formatPrice(finalPrice)}</span>
                </div>
            </div>
        </div>
    )
}
