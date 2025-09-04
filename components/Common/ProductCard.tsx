  'use client'
  import React, { useState, useReducer, useEffect } from 'react'
  import { FaHeart } from "react-icons/fa6";
  import { Swiper, SwiperSlide } from 'swiper/react';


  import 'swiper/css';
  import 'swiper/css/pagination';
  import 'swiper/css/scrollbar';
  import Link from 'next/link';
  import { Pagination, Scrollbar } from 'swiper/modules';
  import { ProductsDataProps, Colors, ProductsProps, Sizes, Images, newProductsProps, ProductVariant } from '@/types/interfaces';
  import AddToCardPopver from './AddToCardPopver';

  import { useWishlists } from '@/Contexts/wishlist';

  function  ProductCard({ product, url ,className }: newProductsProps) {
    const { addToWishlist, removeFromWishlist, wishlist, isProductInWishlist } = useWishlists()


  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(product?.product_variants[0]);
    const [Stringifycolor, setStringifyColor] = useState<Colors[]>([])
    const [StringifySize, setStringifySize] = useState<Sizes[]>([])
    const [StringifyImages, setStringifyImages] = useState<any[] | undefined>([])

    const [isInWhishlist, setIsInwhishlist] = useState<boolean>(false)



    // useEffect(()=>{
      //   setSelectedVariant(product.product_variants[0])
      // },[product])


    useEffect(() => {
    if (!product || !product.product_variants || product.product_variants.length === 0) return;
    try {

      const parsedImages: Images[] = Array.isArray(selectedVariant.image_url)
        ? selectedVariant.image_url.map((item: string) => JSON.parse(item))
        : [];

      setStringifyImages(parsedImages);
    } catch (error) {
      console.error("Failed to parse variant data:", error);
    }
  }, [selectedVariant]);

    useEffect(() => {
      const present = isProductInWishlist({ productId: product?.id })
      setIsInwhishlist(present)
    }, [wishlist.length,product])



    function addTowishlistproduct(selectedColor: Colors[], selectedSize: Sizes[]) {
      if(!selectedVariant.image_url){
        // addToWishlist({ name: product.name, productId: product.id, price: product.price, quantity: product.quantity, color: selectedColor, size: selectedSize, image_urls: StringifyImages, discounts: product.discounts, discount_key: product.discount_key ,slug:product.slug })
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
              StringifyImages &&
                StringifyImages?.map((image, index: number) => (
                  <SwiperSlide className='w-full realtive h-full relative border overflow-hidden' key={index}>
                    <img  src={`${image?.image_url}` || ''} alt={`${image.name} - markline `} className={`w-full   transition-all duration-100 ease-in-out object-contain sm:object-cover hover:scale-[1.010]  ${className? className :" h-[260px] sm:h-[300px] md:h-[250px] lg:h-[350px] xl:h-[400px]"} `} height={200} width={300} loading='lazy' />
                  </SwiperSlide>
                )) 
            }
          </Swiper>
          {
            selectedVariant?.discounts?.discount_persent &&
            <p className='  text-[10px] md:text-[12px] font-medium text-white bg-red-500 w-fit  h-fit px-2  py-[1px] z-20  absolute top-2 left:top-3 left-2 md:left-3 '>Sale</p>
          }

        </Link>
        <Link href={`/${url}/${product?.slug}`} className='flex w-full items-start pt-2 justify-between  px-2 gap-0 ' >
          <h2 className=' text-xs sm:text-sm  xl:text-base 2xl:text-xl font-medium  !line-clamp-3   flex items-center gap-1 uppercase  text-black'>{product?.name}</h2>

        </Link>
        <section className='w-full relative h-auto  pb-3 py-2 px-2 md:flex-row  flex-col flex  items-start lg:items-center justify-between gap-2'>
          <div className='w-fit relative flex self-star  items-center  justify-end px-2   gap-2'>
            {
              selectedVariant?.discounts?.discount_persent &&
              <>
                <p className='text-base xl:text-lg font-normal text-black  line-through text-nowrap '>₹ {selectedVariant?.price}</p>
                <p className='text-base xl:text-lg 2xl:text-xl  font-medium text-nowrap text-red-400 '>₹{
                  Math.floor(selectedVariant?.price - (selectedVariant?.price * (selectedVariant?.discounts?.discount_persent / 100)))}</p>
              </>
            }
            {
              !selectedVariant?.discounts &&
              <p className=' text-base lg:text-lg xl:text-xl 2xl:text-2xl  font-semibold text-nowrap text-primary'>₹ {selectedVariant?.price}</p>

            }

          </div>

        </section>
        <div className='w-full relative grid grid-cols-[1fr_auto]  border-gray-300 items-center justify-center '>
          <AddToCardPopver currentVariant={selectedVariant} currentProduct={product}  addToWhishlistCB={addTowishlistproduct}   onVariantChange={(variant) => setSelectedVariant(variant)} >
            <button className='w-full  bg-primary text-primary text-white relative h-full py-2 lg:py-2.5 flex items-center justify-center text-xs sm:text-sm md:text-base  font-medium    group-border-gray-300'>Add to Cart</button>
          </AddToCardPopver>

          <button className='flex items-center justify-center px-2.5 group h-full group-hover:bg-red-400' onClick={() => addTowishlistproduct(Stringifycolor, StringifySize)} >
            <FaHeart className={` text-[16px] sm:text-[20px] flex items-center  text-black justify-center cursor-pointer group group-hover:text-white  ${ (isInWhishlist ) && "text-red-500" }  `} />
          </button>

        </div>

      </section >
    )
  }

  export default ProductCard