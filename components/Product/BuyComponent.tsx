import { AddressProps, BuyProductProps, forProductsProps, Images, NewForProductsProps, OrderProps, ProductsDataProps } from '@/types/interfaces'
import React, { useEffect, useMemo, useState } from 'react'
import { Tag, Palette, Ruler, Package } from 'lucide-react';
import { safeJsonParse, cn, getCloudflareImageUrl } from '@/lib/utils';

function BuyComponent({ product, variant, user, setConfirm, selectedAddress }: NewForProductsProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const productImages = useMemo(() => {
    const rawImgs = variant?.image_url || (product as any)?.image_urls || (product as any)?.image_url || [];
    if (!Array.isArray(rawImgs)) return [];
    return rawImgs
      .map((item: any) => (typeof item === 'string' ? safeJsonParse(item) : item))
      .filter(Boolean);
  }, [variant, product]);

  const activeImageUrl = getCloudflareImageUrl(productImages?.[selectedImageIndex]?.image_url || productImages?.[0]?.image_url);

  const price = variant?.price || 0;
  const discountPercent = variant?.discounts?.discount_persent || 0;
  const finalPrice = discountPercent ? Math.floor(price - (price * (discountPercent / 100))) : price;
  const quantity = product?.quantity || 1;

  if (!product || (!product.name && !variant)) {
    return (
      <div className="w-full bg-white rounded-xl p-4 animate-pulse">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="w-full md:w-[48%] h-[200px] sm:h-[230px] bg-gray-100 rounded-xl" />
          <div className="w-full md:w-[52%] space-y-3">
            <div className="h-6 bg-gray-100 rounded-lg w-3/4" />
            <div className="h-5 bg-gray-100 rounded-lg w-1/2" />
            <div className="h-5 bg-gray-100 rounded-lg w-2/3" />
            <div className="h-5 bg-gray-100 rounded-lg w-1/3" />
            <div className="h-12 bg-gray-100 rounded-xl w-full mt-4" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full bg-white rounded-xl overflow-y-auto'>
      <div className='flex flex-col md:flex-row gap-4 md:gap-6 items-center md:items-stretch'>
        {/* Left Side: Main Image + Thumbnail Column */}
        <div className='w-full md:w-[48%] shrink-0 flex gap-2 sm:gap-3 items-start'>
          {/* Main Featured Image (Left) */}
          <div className='flex-1 relative h-[180px] sm:h-[220px] md:h-[250px] rounded-xl overflow-hidden bg-gray-50 border border-gray-100'>
            {activeImageUrl ? (
              <img
                src={activeImageUrl}
                alt={product.name}
                className='w-full h-full object-cover object-center transition-all duration-300'
              />
            ) : (
              <div className='w-full h-full flex items-center justify-center text-gray-400 text-xs'>
                No Image Available
              </div>
            )}
          </div>

          {/* Right: Small Thumbnails Column */}
          {productImages.length > 1 && (
            <div className='flex flex-col gap-1.5 w-12 sm:w-16 shrink-0 h-[180px] sm:h-[220px] md:h-[250px] overflow-y-auto touch-pan-y overscroll-contain pr-0.5 scrollbar-thin'>
              {productImages.map((imgObj: any, index: number) => {
                const url = getCloudflareImageUrl(imgObj?.image_url);
                if (!url) return null;
                const isSelected = selectedImageIndex === index;
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedImageIndex(index)}
                    className={cn(
                      "relative aspect-square w-full rounded-lg overflow-hidden border-2 transition-all cursor-pointer bg-gray-50 shrink-0",
                      isSelected
                        ? "border-black ring-2 ring-black/20"
                        : "border-gray-200 hover:border-gray-400 opacity-70 hover:opacity-100"
                    )}
                  >
                    <img
                      src={url}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover object-center pointer-events-none"
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Side: Details */}
        <div className='w-full md:w-[52%] flex flex-col justify-between py-1'>
          <h2 className='text-lg sm:text-xl font-semibold text-gray-900 mb-2 leading-tight'>
            {product.name}
          </h2>

          <div className='flex flex-col space-y-2'>
            {/* Price Row */}
            <div className='flex items-center justify-between pb-1 border-b border-gray-100'>
              <div className='flex items-center gap-4'>
                <div className='w-5 h-5 rounded-full bg-gray-50 flex items-center justify-center text-gray-600'>
                  <Tag size={18} />
                </div>
                <span className='text-gray-600 font-medium text-base sm:text-lg '>Price</span>
              </div>
              <div className='flex flex-col items-end'>
                {discountPercent > 0 && (
                  <span className='text-xs text-gray-400 line-through text-base sm:text-lg'>₹{price}</span>
                )}
                <span className='font-semibold text-gray-900 text-base sm:text-lg'>₹{finalPrice}</span>
              </div>
            </div>

            {/* Color Row */}
            <div className='flex items-center justify-between pb-1 border-b border-gray-100'>
              <div className='flex items-center gap-4'>
                <div className='w-5 h-5 rounded-full bg-gray-50 flex items-center justify-center text-gray-600'>
                  <Palette size={18} />
                </div>
                <span className='text-gray-600 font-medium text-base sm:text-lg'>Color</span>
              </div>
              <div className='flex items-center gap-2'>
                {product?.selectedColor?.hex && (
                  <div
                    className='w-4 h-4 rounded-full border border-gray-200'
                    style={{ backgroundColor: product?.selectedColor?.hex }}
                  />
                )}
                <span className='font-semibold text-gray-900 text-base sm:text-lg'>{product?.selectedColor?.name || 'N/A'}</span>
              </div>
            </div>

            {/* Size Row */}
            <div className='flex items-center justify-between pb-1 border-b border-gray-100'>
              <div className='flex items-center gap-4'>
                <div className='w-5 h-5 rounded-full bg-gray-50 flex items-center justify-center text-gray-600'>
                  <Ruler size={18} />
                </div>
                <span className='text-gray-600 font-medium text-base sm:text-lg'>Size</span>
              </div>
              <span className='font-semibold text-gray-900 text-base sm:text-lg'>{product?.selectedSize?.size || 'N/A'}</span>
            </div>

            {/* Quantity Row */}
            <div className='flex items-center justify-between pb-1 border-b border-gray-100'>
              <div className='flex items-center gap-4'>
                <div className='w-5 h-5 rounded-full bg-gray-50 flex items-center justify-center text-gray-600'>
                  <Package size={18} />
                </div>
                <span className='text-gray-600 font-medium text-base sm:text-lg'>Quantity</span>
              </div>
              <span className='font-semibold text-gray-900 text-base sm:text-lg'>{quantity}</span>
            </div>
          </div>

          {/* Total Box */}
          <div className='mt-3 p-3 px-4 bg-gray-50 rounded-xl flex items-center justify-between'>
            <span className='text-gray-900 font-medium text-base'>Total</span>
            <span className='text-gray-900 font-semibold text-lg'>₹{finalPrice * quantity}</span>
          </div>

        </div>
      </div>
    </div>
  )
}

export default BuyComponent