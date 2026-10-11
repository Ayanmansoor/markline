import React from 'react'
import { Colors, Images, Sizes } from '@/types/interfaces'
import Link from 'next/link'
import { getCloudflareImageUrl, safeJsonParse } from '@/lib/utils'

interface OrderProductRowProps {
    item: any;
}

const parseColor = (rawColor: any): { name: string; hex?: string } => {
    if (!rawColor) return { name: '' };
    if (typeof rawColor === 'string') {
        const parsed = safeJsonParse(rawColor);
        if (parsed && typeof parsed === 'object') return { name: parsed.name || parsed.color || rawColor, hex: parsed.hex };
        return { name: rawColor };
    }
    return { name: rawColor.name || '', hex: rawColor.hex };
};

const parseSize = (rawSize: any): string => {
    if (!rawSize) return '';
    if (typeof rawSize === 'string') {
        const parsed = safeJsonParse(rawSize);
        if (parsed && typeof parsed === 'object') return parsed.size ? `${parsed.size} ${parsed.unit || ''}`.trim() : rawSize;
        return rawSize;
    }
    return rawSize.size ? `${rawSize.size} ${rawSize.unit || ''}`.trim() : '';
};

const parseImageUrl = (item: any): string => {
    if (!item) return '/placeholder.svg';

    // 1. Variant image
    const variantObj = item.variant || item.variant_id;
    if (variantObj?.image_url) {
        const raw = Array.isArray(variantObj.image_url) ? variantObj.image_url[0] : variantObj.image_url;
        const parsed = typeof raw === 'string' ? safeJsonParse(raw) : raw;
        if (parsed?.image_url) return getCloudflareImageUrl(parsed.image_url);
        if (typeof raw === 'string' && raw.startsWith('http')) return getCloudflareImageUrl(raw);
    }

    // 2. Product image
    const prodObj = item.product;
    if (prodObj?.image_url) {
        const raw = Array.isArray(prodObj.image_url) ? prodObj.image_url[0] : prodObj.image_url;
        const parsed = typeof raw === 'string' ? safeJsonParse(raw) : raw;
        if (parsed?.image_url) return getCloudflareImageUrl(parsed.image_url);
        if (typeof raw === 'string' && raw.startsWith('http')) return getCloudflareImageUrl(raw);
    }

    if (prodObj?.image_urls && Array.isArray(prodObj.image_urls) && prodObj.image_urls.length > 0) {
        const url = prodObj.image_urls[0]?.image_url || prodObj.image_urls[0]?.url || '/placeholder.svg';
        return getCloudflareImageUrl(url);
    }

    if (typeof item.image_url === 'string') return getCloudflareImageUrl(item.image_url);
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
    const productName = item.product?.name || item.name || 'Markline Creation';
    const colorObj = parseColor(item.color);
    const sizeStr = parseSize(item.size);
    const imgUrl = parseImageUrl(item);

    const unitPrice = Number(item.unit_price || item.final_price || 0);
    const quantity = Number(item.quantity || 1);
    const finalPrice = Number(item.final_price || (unitPrice * quantity));
    const discount = Number(item.discount_amount || 0);
    const productSlug = item.product?.slug;

    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 border-b border-gray-100 last:border-0 gap-4 group">
            <div className="flex items-start sm:items-center gap-4 flex-1 w-full min-w-0">
                <div className="w-16 h-20 sm:w-20 sm:h-24 bg-gray-50 flex-shrink-0 overflow-hidden rounded-xl border border-gray-100 relative">
                    <img
                        src={imgUrl}
                        alt={productName}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                </div>

                <div className="flex flex-col gap-1 flex-1 min-w-0">
                    {productSlug ? (
                        <Link href={`/product/${productSlug}`} className="hover:underline">
                            <h4 className="text-sm font-bold text-gray-900 line-clamp-1 tracking-tight">
                                {productName}
                            </h4>
                        </Link>
                    ) : (
                        <h4 className="text-sm font-bold text-gray-900 line-clamp-1 tracking-tight">
                            {productName}
                        </h4>
                    )}

                    <div className="flex flex-wrap items-center gap-2 mt-0.5 text-xs">
                        {colorObj.name && (
                            <span className="inline-flex items-center gap-1.5 bg-gray-50 text-gray-700 px-2 py-0.5 rounded border border-gray-200 font-medium">
                                {colorObj.hex && (
                                    <span
                                        className="w-2.5 h-2.5 rounded-full border border-gray-300 shrink-0"
                                        style={{ backgroundColor: colorObj.hex }}
                                    />
                                )}
                                <span>Color: <strong className="text-gray-900">{colorObj.name}</strong></span>
                            </span>
                        )}

                        {sizeStr && (
                            <span className="inline-flex items-center gap-1 bg-gray-50 text-gray-700 px-2 py-0.5 rounded border border-gray-200 font-medium">
                                <span>Size: <strong className="text-gray-900">{sizeStr}</strong></span>
                            </span>
                        )}

                        <span className="inline-flex items-center gap-1 bg-gray-50 text-gray-700 px-2 py-0.5 rounded border border-gray-200 font-medium">
                            <span>Qty: <strong className="text-gray-900">{quantity}</strong></span>
                        </span>
                    </div>

                    {discount > 0 && (
                        <span className="text-xs font-semibold text-emerald-700 mt-0.5">
                            Item Savings: -{formatPrice(discount)}
                        </span>
                    )}
                </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 border-t sm:border-t-0 border-gray-100 pt-2 sm:pt-0 shrink-0">
                <div className="flex flex-col items-start sm:items-end">
                    <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">Unit Price</span>
                    <span className="text-xs font-semibold text-gray-700">{formatPrice(unitPrice)}</span>
                </div>

                <div className="flex flex-col items-end">
                    <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">Total</span>
                    <span className="text-sm font-bold text-gray-900">{formatPrice(finalPrice)}</span>
                </div>
            </div>
        </div>
    )
}

