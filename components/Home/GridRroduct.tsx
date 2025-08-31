'use client'
import React from 'react'
import ProductCard from '../Common/ProductCard'
import { GridProductProps, NewGridProductProps } from '@/types/interfaces'
import { ProductsProps } from '@/types/interfaces'

function  GridRroduct({ data, url ,css ,productsCardCss }: NewGridProductProps) {
  return (
    <div className={` w-full   h-auto grid grid-cols-2  ${css ?  css : 'sm:grid-cols-[repeat(auto-fill,minmax(230px,auto))]'}     `}>
      {data?.map((product, index: number) => (
        <ProductCard  url={url} key={index} product={product} className={productsCardCss}  />
      ))}
    </div>
  )
}

export default GridRroduct