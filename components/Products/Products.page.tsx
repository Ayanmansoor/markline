"use client";
import React, { useState, useEffect, useMemo } from "react";
import { isError, useQuery } from "react-query";
// import ProductCard from '@/component/ForHome/ProductCard'
import Link from "next/link";
import { IoFilterOutline } from "react-icons/io5";
import MobFilterSheet from "./MobFilterSheet";
import {
  getAllCollections,
  getBannerBaseonSlug,
  getAllProductsWithVariants,
} from "@/Supabase/SupabaseApi";
import ProductFilter from "../Common/ProductFilter";
import GridRroduct from "../Home/GridRroduct";
import Discount from "../Discounts/Discount";
import ProductCardSkeleton from "../Skeleton/ProductCardSkeleton";
import {
  Colors,
  NewProductProps,
  newProductsProps,
  ProductsProps,
  ProductVariant,
  Sizes,
} from "@/types/interfaces";
import CarouselProduct from "../Product/CarouselProduct";
import L2Banner from "../Common/L2Banner";
import CategoriesSection from "../Common/CategoriesSection";
import WihlistCardSection from "../Product/WihlistCardSection";
import { useWishlists } from "@/Contexts/wishlist";
import SecondHero from "../Common/SecondHero";
import { useParams } from "next/navigation";

import { FreeMode, Pagination } from "swiper/modules";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import MiniCollectionCard from "../Home/MiniCellectionCard";

const data = [
  {
    title: "Shop Women’s Formal Shoes, Heels & Sandals  Markline  Footwear",
    discription:
      "Discover Markline’s women’s formal shoes collection featuring elegant heels, sophisticated sandals & stylish workwear footwear. Shop premium leather designs crafted for timeless comfort and free shipping across India.",
    slug: "women",
  },
  {
    title:
      "Shop Men’s Formal Shoes, Oxfords & Loafers  Markline Classic Footwear",
    discription:
      "Discover Markline’s men’s formal shoe collection featuring premium leather oxfords, loafers & dress shoes. Handcrafted elegance meets comfort—free shipping across India.",
    slug: "men",
  },
  {
    title: "Buy Kids’ School Shoes & Formal Footwear  Markline Kids",
    discription:
      "Explore Markline Kids’ footwear: durable school shoes, formal pairs & comfortable everyday styles. Designed for growing feet, free shipping across India.",
    slug: "kids",
  },
];

export interface selectColorAndSizesProps {
  color?: string[];
  size?: string[];
}

function Productspage() {
  const [productRangevalue, setPRoductRange] = useState(5000);
  const { slug } = useParams();
  const productslug = Array.isArray(slug) ? slug[0] : slug;
  const [selectColorAndSizes, setSelectColorAndSizes] =
    useState<selectColorAndSizesProps>({
      color: [],
      size: [],
    });

  const [filterProducts, setFilterProducts] = useState<NewProductProps[]>();
  const {
    data: allproducts = { data: [] },
    isLoading: isLoadingProducts,
    isError: isErrorProducts,
  } = useQuery<{ data: NewProductProps[] }>({
    queryKey: ["products"],
    queryFn: getAllProductsWithVariants,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const {
    data: allcollection = { data: [] },
    isLoading: isLoadingCollections,
    isError: isErrorCollections,
  } = useQuery<{ data: any[] }>({
    queryKey: ["collections"],
    queryFn: () => getAllCollections(`ALL`),
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  useEffect(() => {
    if (!allproducts) return;

    const filtered = allproducts.data.filter((product: NewProductProps) => {
      const variants = product?.product_variants || [];

      // --- PRICE check ---
      const lowestPrice = variants.length
        ? Math.min(...variants.map((variant) => variant.price || 0))
        : 0;
      const matchPrice = lowestPrice <= productRangevalue;

      // --- GENDER check ---
      const matchGender = productslug
        ? product.gender === productslug.toUpperCase()
        : true;

      // --- COLOR check ---
      const matchColor =
        !selectColorAndSizes.color?.length ||
        variants.some((variant) => {
          let colorArray: Colors[] = [];
          if (typeof variant.colors === "string") {
            try {
              const parsed = JSON.parse(variant.colors);
              colorArray = Array.isArray(parsed) ? parsed : [parsed];
            } catch {
              return false;
            }
          } else if (Array.isArray(variant.colors)) {
            colorArray = variant.colors.map((c) =>
              typeof c === "string" ? JSON.parse(c) : c
            );
          }

          return colorArray.some((c) =>
            selectColorAndSizes.color?.includes(c.name)
          );
        });

      // --- SIZE check ---
      const matchSize =
        !selectColorAndSizes.size?.length ||
        variants.some((variant) => {
          let sizeArray: Sizes[] = [];
          if (typeof variant.sizes === "string") {
            try {
              const parsed = JSON.parse(variant.sizes);
              sizeArray = Array.isArray(parsed) ? parsed : [parsed];
            } catch {
              return false;
            }
          } else if (Array.isArray(variant.sizes)) {
            sizeArray = variant.sizes.map((s) =>
              typeof s === "string" ? JSON.parse(s) : s
            );
          }

          return sizeArray.some((s) =>
            selectColorAndSizes.size?.includes(s.size)
          );
        });

      return matchPrice && matchGender && matchColor && matchSize;
    });

    setFilterProducts(filtered);
  }, [allproducts, productRangevalue, productslug, selectColorAndSizes]);

  const { allColors, allSizes } = useMemo(() => {
    const colorMap = new Map<string, Colors>();
    const sizeMap = new Map<string, Sizes>();
    allproducts?.data.forEach((product: any) => {
      product.product_variants?.forEach((variant: ProductVariant) => {
        let colorArray: Colors[] = [];
        let sizeArray: Sizes[] = [];

        // normalize colors
        if (Array.isArray(variant.colors)) {
          colorArray = variant.colors.map((item) =>
            typeof item === "string" ? JSON.parse(item) : item
          );
        } else if (typeof variant.colors === "string") {
          try {
            const parsed = JSON.parse(variant.colors);
            colorArray = Array.isArray(parsed) ? parsed : [parsed];
          } catch {
            colorArray = [];
          }
        }

        // normalize sizes
        if (Array.isArray(variant.sizes)) {
          sizeArray = variant.sizes.map((item) =>
            typeof item === "string" ? JSON.parse(item) : item
          );
        } else if (typeof variant.sizes === "string") {
          try {
            const parsed = JSON.parse(variant.sizes);
            sizeArray = Array.isArray(parsed) ? parsed : [parsed];
          } catch {
            sizeArray = [];
          }
        }

        // add unique colors
        colorArray.forEach((color) => {
          if (color?.name && !colorMap.has(color.name)) {
            colorMap.set(color.name, color);
          }
        });

        // add unique sizes
        sizeArray.forEach((size) => {
          if (size?.size && !sizeMap.has(size.size)) {
            sizeMap.set(size.size, size);
          }
        });
      });
    });

    return {
      allColors: Array.from(colorMap.values()),
      allSizes: Array.from(sizeMap.values()),
    };
  }, [slug, allproducts]);

  if (isLoadingProducts || isLoadingCollections)
    return <div className="w-full relative h-[60vh] container  py-10  "></div>;
  if (isErrorProducts || isErrorCollections) return <p>Error fetching data</p>;
  return (
    <>
      <section className="w-full min-h-[300px] relative  gap-5   ">
        <Breadcrumb className="w-full relative  px-5 lg:px-10 xl:px-20 2xl:px-40">
          <BreadcrumbList className="w-full relative h-auto flex items-center py-5 rounded-lg px-3 ">
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/"
                className=" text-sm md:text-base  text-primary cursor-pointer"
              >
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                href={`/products/${slug}`}
                className=" text-sm sm:text-base  text-primary cursor-pointer"
              >
                {slug}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h1 className=" text-base md:text-xl lg:text-2xl xl:text-3xl font-semibold text-primary capitalize px-5 lg:px-10 xl:px-20 2xl:px-40 ">
          Products - {productslug}{" "}
          {`${allproducts.data ? allproducts.data.length : ""}`}{" "}
        </h1>

        <section className="w-full relative gap-2 items-center  mt-8  h-auto flex border-b border-gray-400 pb-3   px-5 lg:px-10 xl:px-20 2xl:px-40 ">
          <Swiper
            slidesPerView={"auto"}
            className="mySwiper w-full  relative h-auto  "
          >
            {allcollection?.data.length > 0 &&
              allcollection?.data.map((collec) => (
                <SwiperSlide
                  className="max-w-fit  border h-auto text-base   "
                  key={collec.slug}
                >
                  <MiniCollectionCard
                    collections={collec}
                    url={`${productslug}`}
                  />
                </SwiperSlide>
              ))}
          </Swiper>
        </section>

        <section className="w-full min-h-[300px] mt-5 relative  gap-10  bg-gray-200  ">
          <span className=" z-30 bg-gray-200 flex items-center border-b border-white w-full justify-between h-fit sticky top-14    py-5 px-5 lg:px-10 xl:px-20 2xl:px-40 ">
            <ProductFilter
              gender={productslug}
              collection={
                productslug
                  ? allcollection.data.filter(
                    (item) => item.gender == productslug.toUpperCase()
                  )
                  : allcollection.data
              }
              productRangevalue={productRangevalue}
              setPRoductRange={setPRoductRange}
              colors={allColors}
              sizes={allSizes}
              SetselectColorAndSizes={setSelectColorAndSizes}
            />
          </span>

          <div className="w-full gap-5  relative flex flex-col  px-5 lg:px-10 xl:px-20 2xl:px-40   py-5 md:py-10 ">
            {isLoadingProducts ? (
              <div className="grid py-5 lg:py-10 grid-cols-2 md:grid-cols-3  lg:grid-cols-4  items-start justify-start gap-3 px-5  lg:px-10    ">
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                <ProductCardSkeleton />
              </div>
            ) : allproducts?.data?.length ? (
              <GridRroduct
                data={filterProducts ? filterProducts : allproducts.data}
                url={"product"}
                css=" grid-cols-2 md:grid-cols-3  xl:grid-cols-4 2xl:grid-cols-5 bg-gray-200  gap-2 lg:gap-3"
                productsCardCss=" h-[170px] aspect-square md:aspect-auto  sm:h-[300px] md:h-[300px] xl:[300px] 2xl:h-[320px] 3xl:h-[350px]"
              />
            ) : (
              <div className="grid grid-cols-2 py-5 lg:py-10 md:grid-cols-3  lg:grid-cols-4   items-start justify-start gap-3 px-5  lg:px-10   ">
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                <ProductCardSkeleton />
              </div>
            )}
          </div>
        </section>
      </section>

      <section className="w-full relative flex flex-col gap-5 py-10 px-5 lg:px-10 xl:px-20 2xl:px-40">




        {/* Informational Sections */}
        <div className="py-10 flex flex-col gap-10 no-scrollbar overflow-y-auto">

          <section>
            <h2 className="text-sm md:text-base font-semibold mb-4">
              Explore Stylish & Comfortable Footwear
            </h2>
            <p className="text-gray-700 text-[11px] sm:text-xs md:text-sm">
              Discover thoughtfully designed {productslug?.toLowerCase()} footwear crafted for Indian lifestyle needs—daily wear, office use,
              festive looks, weddings, travel and casual outings. Markline blends comfort, cushioning, lightweight feel and durable build,
              making every step easy, confident and stylish.
            </p>
          </section>

          <section>
            <h2 className="text-sm md:text-base font-semibold mb-4">
              Types of Footwear for Every Need
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 text-[11px] sm:text-xs md:text-sm">
              <li><strong>For Men:</strong> Office shoes, loafers, casual slip-ons, ethnic wedding footwear and durable daily wear shoes.</li>
              <li><strong>For Women:</strong> Comfortable heels, wedges, flats, sandals, festive footwear and stylish everyday shoes.</li>
              <li><strong>For Kids:</strong> Soft, lightweight, flexible and durable shoes for school, play and daily comfort.</li>
              <li><strong>Occasion Based:</strong> Casual wear, office wear, party wear, travel shoes and wedding footwear collections.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-sm md:text-base font-semibold mb-4">
              How to Choose the Right Footwear
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 text-[11px] sm:text-xs md:text-sm">
              <li><strong>Comfort First:</strong> Choose cushioned soles, arch support and soft footbeds.</li>
              <li><strong>Right Fit:</strong> Ensure perfect fitting to avoid pain, blisters or discomfort.</li>
              <li><strong>Purpose Based:</strong> Select footwear based on your lifestyle and usage.</li>
              <li><strong>Durability:</strong> Prefer strong stitching, quality material and solid grip.</li>
              <li><strong>Style Match:</strong> Pick designs that match outfits and occasions.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-sm md:text-base font-semibold mb-4">
              Trending Footwear Styles in India
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 text-[11px] sm:text-xs md:text-sm">
              <li><strong>Comfort Trends:</strong> Lightweight footwear with cushioned comfort.</li>
              <li><strong>Neutral & Classic Shades:</strong> Everyday wearable colours for style and practicality.</li>
              <li><strong>Wedding & Ethnic Styles:</strong> Festive-ready footwear with premium finish.</li>
              <li><strong>Daily Wear Essentials:</strong> Strong grip, breathable and long-lasting comfort.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-sm md:text-base font-semibold mb-4">
              Why Choose Markline Footwear
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 text-[11px] sm:text-xs md:text-sm">
              <li><strong>All-Day Comfort:</strong> Soft cushioning and relaxed fit.</li>
              <li><strong>Durable Build:</strong> Long-lasting quality crafted for Indian conditions.</li>
              <li><strong>Stylish Designs:</strong> Trend-focused footwear with everyday usability.</li>
              <li><strong>Value for Money:</strong> Premium feel at accessible pricing.</li>
            </ul>
          </section>
          <h2 className="text-lg lg:text-xl font-semibold text-primary">
            POPULAR SEARCHES
          </h2>

          {/* Gender-Based Links */}
          <div className="w-full relative h-auto flex flex-col gap-4">
            <p className="text-sm md:text-base font-semibold md:font-medium text-primary">
              Shop Shoes By Gender
            </p>

            {/* Shoe Type Links */}
            <div className="w-full relative h-auto flex flex-col gap-4">
              <p className="text-sm md:text-base font-semibold md:font-medium text-primary capitalize">
                Shop By {productslug} Shoe Type
              </p>

              <div className="w-full flex flex-wrap items-center gap-2">
                {allcollection.data.map(
                  (item, index) =>
                    item.gender == `${productslug}`.toUpperCase() && (
                      <Link
                        href={`/collections/${`${item.gender}`.toLowerCase()}/${item.slug}`}
                        className="text-[11px] sm:text-xs md:text-sm font-medium border-r border-x px-3 border-primary"
                        key={index}
                      >
                        {item.name}
                      </Link>
                    )
                )}
              </div>
            </div>
            <div className="w-full relative h-auto flex flex-wrap items-center gap-2">
              <Link href={"/collections/men"} className="text-[11px] sm:text-sm font-semibold text-orange-600 px-3 border-primary">
                Men Shoes
              </Link>
              <Link href={"/collections/women"} className="text-[11px] sm:text-sm font-semibold text-orange-600 px-3 border-primary">
                Women Shoes
              </Link>
              <Link href={"/collections/kids"} className="text-[11px] sm:text-sm font-semibold text-orange-600 px-3 border-primary">
                Kids Shoes
              </Link>
              <Link href={"/collections/best-sellers"} className="text-[11px] sm:text-sm font-semibold text-orange-600 px-3 border-primary">
                Best Seller
              </Link>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}

export default Productspage;
