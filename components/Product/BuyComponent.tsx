import { AddressProps, BuyProductProps, forProductsProps, Images, NewForProductsProps, OrderProps, ProductsDataProps } from '@/types/interfaces'
import React, { useEffect, useMemo, useState } from 'react'
import { Tag, Palette, Ruler, Package } from 'lucide-react';

function BuyComponent({ product, variant, user, setConfirm, selectedAddress }: NewForProductsProps) {

  const productImages = variant?.image_url?.map((obj: any) => JSON.parse(obj));
  const mainImage = productImages?.[0]?.image_url;

  const price = variant?.price || 0;
  const discountPercent = variant?.discounts?.discount_persent || 0;
  const finalPrice = discountPercent ? Math.floor(price - (price * (discountPercent / 100))) : price;
  const quantity = product?.quantity || 1;

  return (
    <div className='w-full bg-white rounded-xl overflow-hidden'>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8'>
        {/* Left Side: Image */}
        <div className='w-full relative h-[200px] md:h-[350px] rounded-xl overflow-hidden bg-gray-50'>
          {mainImage ? (
            <img
              src={mainImage}
              alt={product.name}
              className='w-full h-full object-cover object-center'
            />
          ) : (
            <div className='w-full h-full flex items-center justify-center text-gray-400'>
              No Image Available
            </div>
          )}
        </div>

        {/* Right Side: Details */}
        <div className='w-full flex flex-col justify-center'>
          <h2 className=' text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-3 md:mb-5 leading-tight'>
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
          <div className=' mt-2 bg-gray-50 rounded-xl flex items-center justify-between'>
            <span className='text-gray-900 font-medium text-lg'>Total</span>
            <span className='text-gray-900 font-semibold text-xl'>₹{finalPrice * quantity}</span>
          </div>

        </div>
      </div>
    </div>
  )
}

export default BuyComponent