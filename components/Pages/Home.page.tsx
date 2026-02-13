"use client";
import React, { useState } from "react";
import { useQuery } from "react-query";
import Hero from "../Common/Hero";
import CategoriesSection from "../Common/CategoriesSection";
import Discount from "../Discounts/Discount";
import LeatestCollection from "../Collections/LeatestCollection";
import ProductCardSkeleton from "../Skeleton/ProductCardSkeleton";
import MainCollections from "../Home/MainCollections";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import {
  getAllBanner,
  getAllCollections,
  fetchGroupOfProducts,
  getAllCollectionsBaseOnType,
} from "@/Supabase/SupabaseApi";
import CarouselProduct from "../Product/CarouselProduct";
import MiniCollectionCard from "../Home/MiniCellectionCard";
import KeyMatric from "../Common/KeyMatric";
import { newProductsProps } from "@/types/interfaces";
import CollectionCard from "../Home/CollectionCard";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";

function HomePage() {
  const [selected, setSelected] = useState("women");

  const handleSelect = (option: string) => {
    setSelected(option);
  };

  const { data: homebanners = [], isLoading: isHomebanners } = useQuery<any>({
    queryKey: ["homebanners"],
    queryFn: getAllBanner,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const {
    data: allcollection = [],
    isLoading: allCollectionLoading,
    isError: allCollectionError,
  } = useQuery<any>({
    queryKey: ["allcollection"],
    queryFn: () => getAllCollectionsBaseOnType("ALL"),
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const {
    data: groupOfProducts = { data: [] },
    isLoading: isLoading,
    isError: iserror,
  } = useQuery<{ data: newProductsProps[] }>({
    queryKey: ["groupOfProductshome"],
    queryFn: () => fetchGroupOfProducts("ALL"),
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const categories = [
    {
      name: "Men",
      link: "/collections/men",
      img: "/men-collection-image.png",
    },
    {
      name: "Women",
      link: "/collections/women",
      img: "/women-product-image.png",
    },
    {
      name: "Kids",
      link: "/collections/kids",
      img: "/kid-collection-image.png",
    },
    // {
    //   name: "GenZ",
    //   link: "/collections/genz",
    //   img: "/genz-collection-image.png",
    // },
  ];

  return (
    <>
      <section className="w-full relative gap-2 items-center px-3 md:px-5 lg:px-10 py-3 h-auto flex lg:hidden border-b border-gray-300">
        <Swiper
          slidesPerView="auto"
          spaceBetween={12}
          className="w-full mySwiper"
        >
          {allcollection?.map((collection) => {
            // Parse image_urls (first image)
            const imageData = collection?.image_urls?.[0]
              ? JSON.parse(collection?.image_urls?.[0])
              : null;

            return (
              <SwiperSlide
                key={collection.id}
                className="max-w-fit max-h-fit rounded-full relative cursor-pointer"
              >
                <Link
                  href={`/collections/women/${collection.slug}`}
                  className="h-fit w-fit relative  overflow-hidden flex flex-col items-center"
                >
                  {imageData?.image_url && (
                    <img
                      src={imageData?.image_url}
                      alt={imageData?.name || collection?.name}
                      height={80}
                      width={80}
                      className="object-cover aspect-square h-[85px] w-[85px] object-bottom rounded-2xl border border-gray-300"
                    />
                  )}

                  <p className="text-xs mt-1 font-medium text-center">
                    {collection?.name?.split(" ")?.[0]}
                  </p>
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </section>

      <Hero bannerImages={homebanners} />

      {/* {occasional?.length > 0 &&
        occasional.map((item, index) => {
          return (
            <CategoriesSection title={item.name} url={`shop-by/occasion/${item.slug}`} urltext='Explore' key={index}>
              <CarouselProduct url={'product'} product={item.product} productsCardCss=' h-[250px]  sm:h-[300px] md:h-[350px] lg:h-[400px]' />
            </CategoriesSection>
          )
        })
      } */}

      {/* {collectionAlongWithLoading ? (
        <div className="grid grid-cols-2 py-5 lg:py-10 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 px-5 lg:px-10">
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
        </div>
      ) : collectionWithWomenProducts?.length > 0 ? (
        collectionWithWomenProducts.slice(0, 1).map((item, index) => (
          item?.product?.length > 0 &&
          <CategoriesSection
            title={`Women’s Footwear – ${item.name}`}
            subtitle="Elegant Sandals • Chic Heels • Everyday Flats"
            url="products/women"
            urltext="Women's products"
            key={index}
          >
            <CarouselProduct url="product" product={item.product.slice(0, 10)} productsCardCss=' h-[250px]  sm:h-[300px] md:h-[350px] lg:h-[400px]' />
          </CategoriesSection>
        ))
      ) : (
        <></>
      )} */}


      <section className="w-full  relative flex-col gap-5  2xl:gap-10 items-start  mt-7 lg:mt-10 h-auto flex pb-3 px-5 lg:px-10 xl:px-20 2xl:px-40 py-5 lg:py-10">
        <div className="w-full relative flex items-center justify-between ">
          <h1 className="text-lg md:text-2xl xl:text-3xl font-semibold text-primary uppercase">
            Shop By Collections
          </h1>
          <Link
            href={"/collections"}
            className="text-sm md:text-base lg:text-lg text-primary  rounded-md  self-center justify-self-center relative font-medium  flex items-center justify-center gap-2  cursor-pointer group"
          >
            View{" "}
            <ArrowUpRight className="text-primary text-[10px] md:text-[15px] " />
          </Link>
        </div>

        {/* <div className="flex self-center justify-self-center rounded-md w-fit gap-2 items-center justify-center relative">
          {["women", "men", "kids"].map((option) => (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              className={` px-4 md:px-4  py-1 lg:px-10 lg:py- border-2 rounded-full font-medium transition-all ${selected === option
                ? "bg-foreground text-background border-foreground"
                : "border-foreground text-foreground hover:bg-muted"
                }`}
            >
              {option}
            </button>
          ))}
        </div> */}

        <Swiper
          breakpoints={{
            0: {
              slidesPerView: 1.2, // mobile
            },
            640: {
              slidesPerView: 2, // tablet
            },
            780: {
              slidesPerView: 3, // small desktop
            },
            1024: {
              slidesPerView: 3, // small desktop
            },
            1280: {
              slidesPerView: 4, // full desktop
            },
          }}
          modules={[Autoplay]}
          className="mySwiper w-full relative h-auto"
        >
          {allcollection?.length > 0 ? (
            allcollection
              .filter(
                (col) => col?.gender?.toLowerCase() === selected.toLowerCase()
              )
              .slice(0, 6)
              .map((collec, index) => (
                <SwiperSlide
                  key={index}
                  className="w-full relative px-1 lg:px-2"
                >
                  <CollectionCard
                    key={collec.id || index}
                    collections={collec}
                    url="collections/women/"
                    imageClass="   h-[260px] md:h-[300px] lg:h-[320px] 2xl:h-[450px] w-full border  rounded-lg object-cover relative  transition-all duration-100"
                    className="relative h-full  w-full   cursor-pointer group rounded-lg flex flex-col items-start justify-center gap-4  "
                  />
                </SwiperSlide>
              ))
          ) : (
            <div className="col-span-full text-center text-muted-foreground py-10">
              Loading collections...
            </div>
          )}
        </Swiper>

        {/* Fallback if selected tab has no results */}
        {allcollection?.filter(
          (col) => col?.gender?.toLowerCase() === selected.toLowerCase()
        ).length === 0 && (
            <div className="col-span-full text-center text-muted-foreground py-10">
              No collections found for <strong>{selected}</strong>.
            </div>
          )}
      </section>
      {/* <Link
        href={"/collections"}
        className=" text-xs md:text-base px-5 py-2 rounded-full hover:bg-white border-primary hover:text-primary hover:border-black self-center justify-self-center relative font-medium text-white flex items-center justify-center gap-2 bg-primary cursor-pointer group"
      >
        View{" "}
        <ArrowUpRight className="text-white group-hover:text-primary text-[10px] md:text-[20px]" />
      </Link> */}



      {/* <MainCollections /> */}


      {isLoading ? (
        <div className="grid grid-cols-2  lg:py-10 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 px-5 lg:px-10 xl:px-20 2xl:px-40">
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
        </div>
      ) : groupOfProducts?.data?.length > 0 ? (
        groupOfProducts?.data?.slice(0, 2)?.map(
          (item: any, index: number) =>
            item.products?.length > 0 && (
              <CategoriesSection
                title={`${item?.heading} `}
                subtitle={`${item?.discription}`}
                url={`${item?.url}`}
                urltext={`${item?.urlText}`}
                key={index}
              >
                <CarouselProduct
                  url="product"
                  product={item.products.slice(0, 10)}
                  productsCardCss="  h-[230px] object-cover   sm:h-[300px] md:h-[350px] lg:h-[400px]"
                />
              </CategoriesSection>
            )
        )
      ) : (
        <></>
      )}


      {isLoading ? (
        <div className="grid grid-cols-2   lg:py-10 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 px-5 lg:px-10 xl:px-20 2xl:px-40">
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
        </div>
      ) : groupOfProducts?.data?.length > 0 ? (
        groupOfProducts?.data?.slice(2, 4)?.map(
          (item: any, index: number) =>
            item.products?.length > 0 && (
              <CategoriesSection
                title={`${item?.heading} `}
                subtitle={`${item?.discription}`}
                url={`${item?.url}`}
                urltext={`${item?.urlText}`}
                key={index}
              >
                <CarouselProduct
                  url="product"
                  product={item.products.slice(0, 10)}
                  productsCardCss=" h-[230px]  object-cover sm:h-[300px] md:h-[350px] lg:h-[400px]"
                />
              </CategoriesSection>
            )
        )
      ) : (
        <></>
      )}

      {/* Trending */}
      {/* {trendingProducts?.length > 0 && (
        <TrendingCarousels title='Best-Selling Footwear  Customer Favorites at Markline' discription='Explore the top-rated, most-loved shoes our customers can&apos;t stop talking about.' data={trendingProducts} productsCardCss=' h-[250px]  sm:h-[300px] md:h-[350px] lg:h-[400px]' />
      )} */}
      {/* 
      <Discount
        title={"Step into the Season"}
        description={
          "From chic everyday picks to head-turning highlights, explore MarkLine’s most eye-catching footwear. Curated for bold fashion lovers, this section showcases the must-have designs that steal attention and define trends."
        }
        url={"/products/women"}
        images={[]}
      /> */}

      {/* New Arrivals */}
      {/* {isNewArrivalLoading ? (
        <div className="grid grid-cols-2 py-5 lg:py-10 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 px-5 lg:px-10" >
          <ProductCardSkeleton /><ProductCardSkeleton /><ProductCardSkeleton /><ProductCardSkeleton />
          <ProductCardSkeleton />
        </div>
      ) : newArrivals?.length > 0 && (
        <CategoriesSection title={"Step into the Season's Newest Trends"} url="new-arrivals" urltext='new-arrivals'>
          <SecondHero categoryName={"Shoes"} data={newArrivals} />
        </CategoriesSection>
      )} */}

      <LeatestCollection url={"collections"} />
    </>
  );
}

export default HomePage;
