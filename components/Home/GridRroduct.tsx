'use client'
import React from 'react'
import ProductCard from '../Common/ProductCard'
import { GridProductProps } from '@/types/interfaces'
import { ProductsProps } from '@/types/interfaces'

function GridRroduct({ data, url ,css }: GridProductProps) {
  return (
    <div className={` w-full   h-auto grid grid-cols-2  ${css ?  css : 'sm:grid-cols-[repeat(auto-fill,minmax(200px,auto))]'}   bg-secondary   `}>
      {data?.map((product, index: number) => (
        <ProductCard  url={url} key={index} product={product} />
      ))}
    </div>
  )
}

export default GridRroduct