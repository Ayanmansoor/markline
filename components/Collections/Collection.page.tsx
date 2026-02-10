"use client";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { useQuery } from "react-query";
import {
  getAllCollections,
  getAllNewArrivalProducts,
  getAllCollectionBanner,
  getAllCollectionWithProducts,
  getAllProductsWithVariants,
} from "@/Supabase/SupabaseApi";
import CategoriesSection from "../Common/CategoriesSection";
import Discount from "../Discounts/Discount";
import Collectionsection from "../Home/Collectionsection";
import GridRroduct from "../Home/GridRroduct";
import SecondHero from "../Common/SecondHero";
import { useWishlists } from "@/Contexts/wishlist";
import WihlistCardSection from "../Product/WihlistCardSection";
import Hero from "../Common/Hero";
import ProductCardSkeleton from "../Skeleton/ProductCardSkeleton";
import ProductFilter from "../Common/ProductFilter";
import {
  Colors,
  NewProductProps,
  ProductsDataProps,
  ProductVariant,
  Sizes,
} from "@/types/interfaces";
import { selectColorAndSizesProps } from "../Products/Products.page";
import MainCollections from "../Home/MainCollections";
import CollectionCard from "../Home/CollectionCard";
import { ArrowUpRight } from "lucide-react";
function CollcetionPage() {
  const [productRangevalue, setPRoductRange] = useState(5000);
  const [filterProducts, setFilterProducts] = useState<NewProductProps[]>();

  const [selectColorAndSizes, setSelectColorAndSizes] =
    useState<selectColorAndSizesProps>({
      color: [],
      size: [],
    });

  const [selected, setSelected] = useState("women");

  const handleSelect = (option: string) => {
    setSelected(option);
  };

  const {
    data: collectionBanner = [],
    isLoading: bannerloading,
    isError: bannererror,
  } = useQuery({
    queryKey: ["collectionBanner"],
    queryFn: getAllCollectionBanner,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const {
    data: collections = { data: [] },
    isLoading: collectionloading,
    isError: collectionerror,
  } = useQuery<{ data: any }>({
    queryKey: ["collections"],
    queryFn: () => getAllCollections("ALL"),
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return (
    <>
      {collectionBanner && (
        <Hero
          bannerImages={collectionBanner}
        />
      )}

      {/* <MainCollections /> */}
      {/* <Collectionsection collections={collections?.data?.filter((item) => item.gender == 'WOMEN')} url={'collections/women'} /> */}

      {collections?.data?.length ? (
        <section className="w-full  relative flex-col gap-5 mb-10 2xl:gap-10 items-start  mt-7 lg:mt-10 h-auto flex pb-3  px-5 lg:px-10 xl:px-20 2xl:px-40 pt-5 lg:pt-10 ">
          <div className="flex flex-col gap-1 relative ">
            <h1 className=" text-base sm:text-lg md:text-2xl xl:text-3xl font-semibold text-primary">
              Women&apos;s Footwear Collections – Sandals, Flats, Heels & More
            </h1>
            <p className=" text-xs sm:text-base md:text-lg font-medium text-primary  ">
              Discover elegant sandals, comfy flats, chic heels & stylish mules
            </p>
          </div>

          {/* <div className="flex self-center justify-self-center rounded-md w-fit gap-2 items-center justify-center relative">
            {["women", "men", "kids"].map((option) => (
              <button
                key={option}
                onClick={() => handleSelect(option)}
                className={` px-4 md:px-4  py-1 lg:px-10 lg:py- rounded-full border-2 font-medium transition-all ${selected === option
                    ? "bg-foreground text-background border-foreground"
                    : "border-foreground text-foreground hover:bg-muted"
                  }`}
              >
                {option}
              </button>
            ))}
          </div> */}

          <section className="w-full relative h-auto gap-3 md:gap-5 xl:gap-5 2xl:gap-5 grid grid-cols-1 sm:grid-cols-2  xl:grid-cols-3 2xl:grid-cols-4">
            {collections?.data?.length > 0 ? (
              collections.data
                .filter(
                  (col) => col?.gender?.toLowerCase() === selected.toLowerCase()
                )
                .map((collec, index) => (
                  <CollectionCard
                    key={collec.id || index}
                    collections={collec}
                    url={`collections/${selected}/`}
                    imageClass="  h-[400px] lg:h-[450px] w-full border  rounded-lg object-cover relative  transition-all duration-100"
                    className="relative h-full  w-full  bg-gray-200 cursor-pointer group rounded-lg flex flex-col items-start justify-center gap-4 p-1 "
                  />
                ))
            ) : (
              <div className="col-span-full text-center text-muted-foreground py-10">
                Loading collections...
              </div>
            )}

            {/* Fallback if selected tab has no results */}
            {collections?.data?.filter(
              (col) => col?.gender?.toLowerCase() === selected.toLowerCase()
            ).length === 0 && (
                <div className="col-span-full text-center text-muted-foreground py-10">
                  No collections found for <strong>{selected}</strong>.
                </div>
              )}
          </section>
        </section>
      ) : (
        <div className="grid grid-cols-2 py-5 lg:py-10 md:grid-cols-3 lg:grid-cols-4   xl:grid-cols-5 items-start justify-start gap-3  px-5 lg:px-10 xl:px-20 2xl:px-40  ">
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
        </div>
      )}

      {/* <section className="w-full min-h-[300px] mt-5 relative  gap-10  bg-gray-200  ">
        <span className=' z-20 bg-gray-200 flex items-center border-b border-white w-full justify-between h-fit sticky top-12   py-5 px-3 md:px-5 lg:px-10 '>
          <ProductFilter collection={[]} productRangevalue={productRangevalue} setPRoductRange={setPRoductRange} colors={allColors} sizes={allSizes} SetselectColorAndSizes={setSelectColorAndSizes} />
        </span>

        <div className="w-full gap-5  relative flex flex-col  px-3 md:px-5 lg:px-10  py-5 lg:py-10 ">
          {
            productloading ?
              <div className="grid py-5 lg:py-10 grid-cols-2 md:grid-cols-3  lg:grid-cols-4  items-start justify-start gap-3 px-5  lg:px-10   ">
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                <ProductCardSkeleton />
              </div>
              :
              products?.data?.length ?
                <GridRroduct data={filterProducts ? filterProducts : products.data} url={'product'} css=' grid-cols-2 md:grid-cols-3  xl:grid-cols-4 bg-gray-200 ' productsCardCss=' h-[220px]  sm:h-[290px] md:h-[300px] lg:h-[350px]' /> :
                <div className="grid grid-cols-2 py-5 lg:py-10 sm:grid-cols-3  lg:grid-cols-4   items-start justify-start gap-3 px-5  lg:px-10   ">
                  <ProductCardSkeleton />
                  <ProductCardSkeleton />
                  <ProductCardSkeleton />
                  <ProductCardSkeleton />
                </div>
          }




        </div>
      </section> */}

      <Discount
        title="Spotlight on Style"
        description="Step into the spotlight with Markline’s curated highlights—handpicked just for you. From sleek sandals and elegant flats to chic heels and playful toe-rings, our featured collection combines comfort, design, and everyday flair. Shop standout styles that elevate every outfit with effortless grace."
        url="/"
      />

      <section className="w-full relative flex flex-col gap-5    py-10   px-5 lg:px-10 xl:px-20 2xl:px-40 ">


        {/* Informational Sections */}
        <div className="  flex flex-col gap-10 no-scrollbar overflow-y-auto ">
          <section>
            <h2 className="text-base sm:text-lg font-semibold mb-4">
              Explore Footwear for Everyone
            </h2>
            <p className="text-gray-700 text-sm">
              From playful kicks for kids to fashion-forward styles for GenZ,
              timeless classics for men, and elegant essentials for women, our
              diverse collection ensures that everyone finds their perfect fit.
              We combine comfort, quality, and the latest trends to create a
              seamless experience for every step of life.
            </p>
          </section>

          <section>
            <h2 className="text-base sm:text-lg font-semibold mb-4">
              Types of Footwear by Gender
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 text-sm">
              <li>
                <strong>For Men:</strong> Versatile lace-ups, loafers, ethnic
                mojaris, and street-ready sneakers for every occasion.
              </li>
              <li>
                <strong>For Women:</strong> Elegant heels, trendy flats, ethnic
                Kolhapuris, and comfy slip-ons—where style meets comfort.
              </li>
              <li>
                <strong>For Kids:</strong> Fun, flexible, and durable shoes like
                velcro sneakers and sporty sandals built for adventure.
              </li>
              <li>
                <strong>For GenZ:</strong> Bold, expressive picks—chunky
                sneakers, graphic slip-ons, and trend-driven sandals.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-base sm:text-lg font-semibold mb-4">
              How to Choose the Right Shoes
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 text-sm">
              <li>
                <strong>Age & Style:</strong> Opt for designs that fit the age
                group—playful for kids, expressive for GenZ, versatile for
                adults.
              </li>
              <li>
                <strong>Occasion:</strong> Match your footwear to your
                lifestyle—casual, formal, or festive.
              </li>
              <li>
                <strong>Fit & Comfort:</strong> Use sizing guides and reviews.
                Look for arch support and padded soles.
              </li>
              <li>
                <strong>Material:</strong> Leather for durability, mesh for
                breathability, synthetics for lightweight comfort.
              </li>
              <li>
                <strong>Wear Frequency:</strong> Durable shoes for daily wear;
                lightweight styles for occasional flair.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-base sm:text-lg font-semibold mb-4">
              Footwear Trends for All
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 text-sm">
              <li>
                <strong>Bold Soles:</strong> Platforms and thick soles dominate
                the streets and runways.
              </li>
              <li>
                <strong>Pastel Tones & Neutrals:</strong> Understated hues that
                work across outfits and age groups.
              </li>
              <li>
                <strong>Retro Revivals:</strong> Mary Janes, moccasins, and
                high-tops making a bold comeback.
              </li>
              <li>
                <strong>Tech Comfort:</strong> Cushioned insoles and lightweight
                builds for all-day support.
              </li>
              <li>
                <strong>Ethnic Fusion:</strong> Classic Indian silhouettes
                blended with modern designs.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-base sm:text-lg font-semibold mb-4">
              Why Quality Footwear Matters
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 text-sm">
              <li>
                <strong>Comfort:</strong> Well-made shoes reduce fatigue and
                make walking a breeze.
              </li>
              <li>
                <strong>Durability:</strong> Quality craftsmanship means less
                frequent replacements.
              </li>
              <li>
                <strong>Foot Health:</strong> Good fit and cushioning prevent
                heel pain and blisters.
              </li>
              <li>
                <strong>Confidence:</strong> When your shoes feel good, you walk
                with confidence and style.
              </li>
            </ul>
          </section>
        </div>
      </section>

      {/* <CategoriesSection title={"Products"} >
        <CarouselProduct data={{ categoryName: "all" }} />
      </CategoriesSection> */}
    </>
  );
}

export default CollcetionPage;
