'use client'
import React from 'react'
import ProductCard from '../Common/ProductCard'
import { GridProductProps } from '@/types/interfaces'
import { ProductsProps } from '@/types/interfaces'

function  GridRroduct({ data, url ,css ,productsCardCss }: GridProductProps) {
  return (
    <div className={` w-full   h-auto grid grid-cols-2  ${css ?  css : 'sm:grid-cols-[repeat(auto-fill,minmax(230px,auto))]'}   bg-secondary   `}>
      {data?.map((product, index: number) => (
        <ProductCard  url={url} key={index} product={product} className={productsCardCss} />
      ))}
    </div>
  )
}

export default GridRroduct