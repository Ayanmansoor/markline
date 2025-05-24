'use client'
import React, { useState, useReducer, useEffect } from 'react'
import { PiHeartThin } from "react-icons/pi";
import { FaHeart } from "react-icons/fa6";


import { useRouter } from 'next/navigation';
// import { useCart } from '@/Contexts/Cart.context';

// import { useCart } from '../Context/Cart.context';

// import { useWishlists } from '@/Contexts/wishlist';
import { Swiper, SwiperSlide } from 'swiper/react';
// import AddToCardPopver from '@/Comman/AddToCardPopver';


// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import Link from 'next/link';
import { Pagination, Scrollbar } from 'swiper/modules';
import { ProductsDataProps, Colors, ProductsProps, Sizes } from '@/types/interfaces';
import AddToCardPopver from './AddToCardPopver';

import { useWishlists } from '@/Contexts/wishlist';

function ProductCard({ product, url }: ProductsDataProps) {
  const { addToWishlist, removeFromWishlist, isProductInWishlist } = useWishlists()
  
// state for set color and sizes
  const [Stringifycolor,setStringifyColor]=useState<Colors[]>([])
  const [StringifySize,setStringifySize]=useState<Sizes[]>([])
  const [StringifyImages,setStringifyImages]=useState<any[]>()

  const [isInWhishlist,setIsInwhishlist]=useState<boolean>(false)

 

  function addwishlist(product: ProductsProps) {
    addToWishlist(product)
  }

  useEffect(() => {
    const colors = product?.colors?.map((color: any) => JSON.parse(color))
    const sizes = product?.sizes?.map((size: any) => JSON.parse(size))
    const productImage = product.image_url?.map((image: any) => JSON.parse(image))

    setStringifyColor(colors)
    setStringifySize(sizes)
    setStringifyImages(productImage)

    //  const isAvailble = isProductInWishlist(product.id,colors[0].name,sizes[0].size)
    // setIsInwhishlist(isAvailble)

  }, [product])






  return (
    <section className='max-w-[400px]  relative h-full border  border-black justify-between flex items-start border-none flex-col  group '>
      <Link href={`/${url}/${product?.slug}`} className=' h-auto relative w-full bg-[#ebeeef] group transition-all duration-500 ease-in cursor-pointer  '>
        <Swiper
          style={{
            "--swiper-pagination-color": "#0c0c0c",
            "--swiper-pagination-bullet-inactive-color": "#0c0c0c",
            "--swiper-pagination-bullet-inactive-opacity": "1",
            "--swiper-pagination-bullet-size": "7px",
            "--swiper-pagination-bullet-horizontal-gap": "6px"
          } as React.CSSProperties & Record<string, string>}
          pagination={{
            dynamicBullets: true
          }}
          modules={[Pagination]}
          className="mySwiper w-full relative h-full "
        >

          {
           StringifyImages?.map((image, index: number) => (
              <SwiperSlide className='w-full realtive h-full relative border' key={index}>
                <img src={`${image?.image_url}` || ''} alt={`${image.name} - markline `} className='w-full   transition-all duration-500 ease-in-out h-[180px] sm:h-[200px] md:h-[250px]  object-cover' height={200} width={300} loading='lazy' />
              </SwiperSlide>
            ))
          }
        </Swiper>
        {
          product?.discounts &&
          <p className='  text-[10px] md:text-[12px] font-medium text-white bg-red-500 w-fit  h-fit px-2  py-[1px] z-20  absolute top-2 left:top-3 left-2 md:left-3 '>Sale</p>
        }

      </Link>
      <Link href={`/${url}/${product?.slug}`} className='flex w-full items-start pt-2 justify-between  px-2 gap-0 border-l border-r' >
        <h2 className=' text-xs sm:text-sm md:text-[16px] font-medium  line-clamp-2 h-[50px]  flex items-center gap-1 uppercase text-black'>{product?.name}</h2>

      </Link>
      <section className='w-full relative h-auto border-l border-r pb-3 py-2 px-2 md:flex-row  flex-col flex  items-start lg:items-center justify-between gap-2'>
        <div className='w-fit relative flex self-star  items-center  justify-end px-2   gap-2'>
          {
            product?.discounts &&
            <>
              <p className='text-base md:text-lg font-normal text-black  line-through text-nowrap '>₹ {product?.price}</p>
              <p className=' text-lg md:text-xl  font-medium text-nowrap text-red-400'>₹{
                Math.floor(product?.price - (product?.price * (product?.discounts?.discount_persent / 100)))}</p>
            </>
          }
          {
            !product?.discounts &&
            <p className=' text-lg md:text-xl  font-medium text-nowrap text-red-400'>₹ {product?.price}</p>

          }

        </div>

      </section>
      <div className='w-full relative grid grid-cols-[1fr_auto] border py-2    border-t border-gray-300 items-center justify-center '>
        <AddToCardPopver currentProduct={product} colors={Stringifycolor} sizes={StringifySize} setIsInWhicshlist={setIsInwhishlist}  >
          <button className='w-full relative h-auto flex items-center justify-center text-base  font-medium text-black   border-r border-gray-300'>Add to Cart</button>
        </AddToCardPopver>

        <button className='flex items-center justify-center px-2' onClick={() => addwishlist(product)}>
          <FaHeart className={`text-[20px] flex items-center  text-black justify-center cursor-pointer hover:text-red-500  ${isInWhishlist&&"text-red-500"}  `} />
        </button>

      </div>

    </section >
  )
}

export default ProductCard