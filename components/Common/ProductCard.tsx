'use client'
import React, { useState, useReducer, useEffect } from 'react'
import { FaHeart } from "react-icons/fa6";
import { Swiper, SwiperSlide } from 'swiper/react';


import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import Link from 'next/link';
import { Pagination, Scrollbar } from 'swiper/modules';
import { ProductsDataProps, Colors, ProductsProps, Sizes, Images } from '@/types/interfaces';
import AddToCardPopver from './AddToCardPopver';

import { useWishlists } from '@/Contexts/wishlist';

function ProductCard({ product, url ,className }: ProductsDataProps) {
  const { addToWishlist, removeFromWishlist, wishlist, isProductInWishlist } = useWishlists()

  const [Stringifycolor, setStringifyColor] = useState<Colors[]>([])
  const [StringifySize, setStringifySize] = useState<Sizes[]>([])
  const [StringifyImages, setStringifyImages] = useState<any[] | undefined>([])

  const [isInWhishlist, setIsInwhishlist] = useState<boolean>(false)




  useEffect(() => {
    const colors = product?.colors?.map((color: any) => JSON.parse(color))
    const sizes = product?.sizes?.map((size: any) => JSON.parse(size))
    const productImage: Images[] | undefined = product.image_url?.map((image: any) => JSON.parse(image))

    setStringifyColor(colors)
    setStringifySize(sizes)
    setStringifyImages(productImage)

  }, [product])

  useEffect(() => {
    const present = isProductInWishlist({ productId: product.id })
    setIsInwhishlist(present)
  }, [wishlist.length,product])



  function addTowishlistproduct(selectedColor: Colors[], selectedSize: Sizes[]) {
    if(!product.image_urls){
      addToWishlist({ name: product.name, productId: product.id, price: product.price, quantity: product.quantity, color: selectedColor, size: selectedSize, image_urls: StringifyImages, discounts: product.discounts, discount_key: product.discount_key ,slug:product.slug })
    }
  }



  return (
    <section className='max-w-full  relative h-full    justify-between flex items-start border-none flex-col  group '>
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
            StringifyImages ?
              StringifyImages?.map((image, index: number) => (
                <SwiperSlide className='w-full realtive h-full relative border overflow-hidden' key={index}>
                  <img  src={`${image?.image_url}` || ''} alt={`${image.name} - markline `} className={`w-full   transition-all duration-100 ease-in-out object-contain sm:object-cover hover:scale-[1.010]  ${className? className :" h-[260px] sm:h-[300px] md:h-[250px] lg:h-[350px] xl:h-[400px]"} `} height={200} width={300} loading='lazy' />
                </SwiperSlide>
              )) :
              product.image_urls?.map((image, index) => (
                <SwiperSlide className='w-full realtive h-full relative border' key={index}>
                  <img src={`${image?.image_url}` || ''} alt={`${image.name} - markline `} className={`w-full   transition-all duration-500 ease-in-out ${className? className :" h-[260px] sm:h-[300px] md:h-[250px] lg:h-[350px] xl:h-[400px]"}  object-contain sm:object-cover`} height={200} width={300} loading='lazy' />
                </SwiperSlide>
              ))
          }
        </Swiper>
        {
          product?.discounts &&
          <p className='  text-[10px] md:text-[12px] font-medium text-white bg-red-500 w-fit  h-fit px-2  py-[1px] z-20  absolute top-2 left:top-3 left-2 md:left-3 '>Sale</p>
        }

      </Link>
      <Link href={`/${url}/${product?.slug}`} className='flex w-full items-start pt-2 justify-between  px-2 gap-0 ' >
        <h2 className=' text-xs sm:text-sm  md:text-base lg:text-xl font-medium line-clamp-1  lg:line-clamp-2 h-[50px]  flex items-center gap-1 uppercase  text-black'>{product?.name}</h2>

      </Link>
      <section className='w-full relative h-auto  pb-3 py-2 px-2 md:flex-row  flex-col flex  items-start lg:items-center justify-between gap-2'>
        <div className='w-fit relative flex self-star  items-center  justify-end px-2   gap-2'>
          {
            product?.discounts &&
            <>
              <p className='text-base md:text-lg font-normal text-black  line-through text-nowrap '>₹ {product?.price}</p>
              <p className=' text-lg md:text-xl  font-medium text-nowrap text-red-400 '>₹{
                Math.floor(product?.price - (product?.price * (product?.discounts?.discount_persent / 100)))}</p>
            </>
          }
          {
            !product?.discounts &&
            <p className=' text-lg lg:text-xl xl:text-2xl  font-semibold text-nowrap text-primary'>₹ {product?.price}</p>

          }

        </div>

      </section>
      <div className='w-full relative grid grid-cols-[1fr_auto]  border-gray-300 items-center justify-center '>
        <AddToCardPopver currentProduct={product} colors={Stringifycolor} sizes={StringifySize} addToWhishlistCB={addTowishlistproduct}  >
          <button className='w-full hover:bg-gray-300 bg-primary hover:text-primary text-white relative h-full py-2 lg:py-2.5 flex items-center justify-center text-base hover:font-semibold  font-medium    border-gray-300'>Add to Cart</button>
        </AddToCardPopver>

        <button className='flex items-center justify-center px-2.5 ' onClick={() => addTowishlistproduct(Stringifycolor, StringifySize)} >
          <FaHeart className={`text-[20px] flex items-center  text-black justify-center cursor-pointer hover:text-red-500  ${ (isInWhishlist || product.image_urls) && "text-red-500" }  `} />
        </button>

      </div>

    </section >
  )
}

export default ProductCard