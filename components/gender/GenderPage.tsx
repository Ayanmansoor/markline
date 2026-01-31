"use client";
import React, { useEffect, useMemo, useState } from "react";
import Hero from "../Common/Hero";
import CategoriesSection from "../Common/CategoriesSection";
import ProductCardSkeleton from "../Skeleton/ProductCardSkeleton";
import Collectionsection from "../Home/Collectionsection";
import GridRroduct from "../Home/GridRroduct";
import Discount from "../Discounts/Discount";
import {
  getCollectionBaseOnGender,
  getAllBanner,
  getProductBaseOnCollection,
  getAllCollectionWithProducts,
  getAllProductsbygender,
} from "@/Supabase/SupabaseApi";
import { useParams } from "next/navigation";
import { useQuery } from "react-query";
import { CldImage } from "next-cloudinary";
import Link from "next/link";
import ProductFilter from "../Common/ProductFilter";
import {
  Colors,
  NewProductProps,
  ProductVariant,
  Sizes,
} from "@/types/interfaces";
import { selectColorAndSizesProps } from "../Products/Products.page";

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

function GenderPage() {
  const { group } = useParams();
  const nslug = Array.isArray(group) ? group[0] : group;
  const finalslug = nslug?.toUpperCase();
  const [productRangevalue, setPRoductRange] = useState(5000);
  const { slug } = useParams();
  const productslug = Array.isArray(slug) ? slug[0] : slug;
  const [filterProducts, setFilterProducts] = useState<NewProductProps[]>();

  const [selectColorAndSizes, setSelectColorAndSizes] =
    useState<selectColorAndSizesProps>({
      color: [],
      size: [],
    });

  const {
    data: genderCollection = [],
    isLoading: isGenderLoading,
    isError: isGenderDataerror,
  } = useQuery<any>({
    queryKey: ["gendercollection", group],
    enabled: !!group,
    queryFn: () => getCollectionBaseOnGender(finalslug || ""),
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });


  const {
    data: getallproductbaseongender = { data: [] },
    isLoading: collectionAlongWithLoading,
    isError: collectionerrorLoading,
  } = useQuery<{ data: NewProductProps[] }>({
    queryKey: ["getallproductbaseongender", "WOMEN"],
    queryFn: () => getAllProductsbygender(`${finalslug}`.toUpperCase()),
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });


  useEffect(() => {
    if (!getallproductbaseongender.data) return;

    const filtered = getallproductbaseongender.data.filter(
      (product: NewProductProps) => {
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
      }
    );

    setFilterProducts(filtered);
  }, [
    getallproductbaseongender,
    productRangevalue,
    productslug,
    selectColorAndSizes,
  ]);

  const { allColors, allSizes } = useMemo(() => {
    const colorMap = new Map<string, Colors>();
    const sizeMap = new Map<string, Sizes>();

    getallproductbaseongender.data?.forEach((product: any) => {
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
  }, [getallproductbaseongender]);

  return (
    <>
      {/* <Hero bannerImages={HomeBanner} css={" h-[40vh] sm:h-[60vh]"} /> */}

      <section className="w-full min-h-[300px] relative  gap-5   ">
        <Breadcrumb className="w-full relative ">
          <BreadcrumbList className="w-full relative h-auto flex items-center py-5 rounded-lg  px-5 lg:px-10 xl:px-20 2xl:px-40 ">
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/Home"
                className=" text-sm md:text-base  text-primary cursor-pointer"
              >
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                href={`/collections`}
                className=" text-sm sm:text-base md:text-base text-primary cursor-pointer"
              >
                collection
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                href={`/collections/${nslug}`}
                className=" text-sm sm:text-base md:text-base text-primary cursor-pointer"
              >
                {nslug}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col gap-2 px-5 lg:px-10 xl:px-20 2xl:px-40 ">
          <h1 className=" text-base md:text-xl lg:text-2xl xl:text-3xl font-semibold text-primary capitalize   ">
            Products - {productslug}{" "}
            {`${getallproductbaseongender.data
              ? getallproductbaseongender.data.length
              : ""
              }`}{" "}
          </h1>
          <p className="text-gray-700 text-sm md:text-base">
            Shop comfortable and stylish {productslug} footwear online in India, designed for daily wear, office use, festive occasions, and casual outings.
          </p>
        </div>

        <section className="w-full relative gap-2 items-center   mt-8  h-auto flex border-b border-gray-400 pb-3  px-5 lg:px-10 xl:px-20 2xl:px-40  ">
          <Swiper
            slidesPerView={"auto"}
            className="mySwiper w-full  relative h-auto  "
          >
            {genderCollection?.data?.length > 0 &&
              genderCollection?.data?.map((collec) => (
                <SwiperSlide
                  className="max-w-fit  border h-auto text-base   "
                  key={collec.slug}
                >
                  <MiniCollectionCard collections={collec} url={`${nslug}`} />
                </SwiperSlide>
              ))}
          </Swiper>
        </section>

        <section className="w-full min-h-[300px] mt-5 relative  gap-10  bg-gray-200   ">
          <span className=" z-20 bg-gray-200 flex items-center border-b border-white w-full justify-between h-fit sticky top-14  py-5 px-5 lg:px-10 xl:px-20 2xl:px-40">
            <ProductFilter
              gender={productslug}
              collection={productslug && genderCollection}
              productRangevalue={productRangevalue}
              setPRoductRange={setPRoductRange}
              colors={allColors}
              sizes={allSizes}
              SetselectColorAndSizes={setSelectColorAndSizes}
            />
          </span>

          <div className="w-full gap-5  relative flex flex-col  px-5 lg:px-10 xl:px-20 2xl:px-40  py-5 lg:py-10 ">
            {collectionAlongWithLoading ? (
              <div className="grid py-5 lg:py-10 grid-cols-2 md:grid-cols-3  lg:grid-cols-4  items-start justify-start gap-3 px-5  lg:px-10   ">
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                <ProductCardSkeleton />
              </div>
            ) : getallproductbaseongender.data?.length ? (
              <GridRroduct
                data={
                  filterProducts
                    ? filterProducts
                    : getallproductbaseongender.data
                }
                url={"product"}
                css=" gap-2 grid-cols-2 md:grid-cols-3  xl:grid-cols-4 2xl:grid-cols-5 bg-gray-200 "
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

      <Discount
        title={`Spotlight ${nslug} Footwear: Featured Styles You'll Love`}
        description={`Explore our top picks from the ${nslug} collection—curated for quality, comfort, and on‑trend appeal. Whether it's chic sandals, cozy sneakers, or elegant dress shoes, these standout styles are designed to elevate your everyday wardrobe.`}
        url=""
      />

      <section className="w-full relative flex flex-col gap-5  px-5 lg:px-10 xl:px-20 2xl:px-40 pb-10">



        <div className="  flex flex-col gap-10 no-scrollbar overflow-y-auto ">
          {/* Intro Section */}
          <section>
            <h2 className="text-md md:text-lg lg:text-xl font-semibold mb-2">
              Shop Stylish & Comfortable {productslug} Footwear Online in India
            </h2>
            <p className="text-gray-700 text-[11px] md:text-sm lg:text-base">
              Discover thoughtfully designed {productslug?.toLowerCase()} footwear at Markline that blends comfort, style,
              durability, and everyday usability. From daily wear essentials to festive footwear,
              office styles, college casuals, travel-friendly pairs, and special occasion looks —
              every pair is crafted for real lifestyles with lasting comfort and trend-led design.
            </p>
          </section>

          {/* Explore Section */}
          <section>
            <h2 className="text-md md:text-lg lg:text-xl font-semibold mb-2">
              Explore {productslug} Shoes for Every Occasion
            </h2>
            <p className="text-gray-700 text-[11px] md:text-sm lg:text-base">
              Whether it’s work, celebrations, casual outings, school, playtime, or everyday routine,
              Markline offers versatile {productslug?.toLowerCase()} footwear that keeps you comfortable and confident
              all day. Designed for Indian lifestyle, comfort needs, and fashion expectations —
              our collection supports every move effortlessly.
            </p>
          </section>

          {/* Types Section */}
          <section>
            <h2 className="text-md md:text-lg lg:text-xl font-semibold mb-2">
              Types of {productslug} Footwear Available Online
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 text-[11px] md:text-sm lg:text-base">
              <li><strong>Daily Wear Footwear:</strong> Lightweight, easy-to-wear and comfortable designs</li>
              <li><strong>Casual & Trend Styles:</strong> Fashion-forward footwear for outings and lifestyle looks</li>
              <li><strong>Office & Formal Shoes:</strong> Polished and elegant footwear for a refined appearance</li>
              <li><strong>Festive & Wedding Footwear:</strong> Stylish pairs crafted for celebrations</li>
              <li><strong>Outdoor & Travel Friendly:</strong> Supportive and durable footwear for long wear</li>
            </ul>
          </section>

          {/* Choosing Guide */}
          <section>
            <h2 className="text-md md:text-lg lg:text-xl font-semibold mb-2">
              How to Choose the Right {productslug} Footwear
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 text-[11px] md:text-sm lg:text-base">
              <li><strong>Purpose:</strong> Pick shoes based on daily wear, office use, ethnic wear or casual outings</li>
              <li><strong>Comfort:</strong> Choose cushioned soles and soft-lining constructions</li>
              <li><strong>Material:</strong> Breathable and durable materials ensure long-lasting comfort</li>
              <li><strong>Fit:</strong> Always select the right size to support better posture and walking ease</li>
              <li><strong>Style Preference:</strong> Neutral classics or modern trendy silhouettes</li>
            </ul>
          </section>

          {/* Trending */}
          <section>
            <h2 className="text-md md:text-lg lg:text-xl font-semibold mb-2">
              Trending {productslug} Footwear in India
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 text-[11px] md:text-sm lg:text-base">
              <li>Lightweight cushioned footwear for daily comfort</li>
              <li>Neutral tones like beige, tan, black along with trend colors</li>
              <li>Stylish yet practical silhouettes for lifestyle needs</li>
              <li>Modern designs with comfortable builds</li>
              <li>Indian outfit-friendly elegant styles</li>
            </ul>
          </section>

          {/* Why Markline */}
          <section>
            <h2 className="text-md md:text-lg lg:text-xl font-semibold mb-2">
              Why Buy {productslug} Footwear from Markline?
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 text-[11px] md:text-sm lg:text-base">
              <li>Comfort-focused & lifestyle-friendly designs</li>
              <li>Stylish yet wearable for daily to special occasions</li>
              <li>Quality craftsmanship and reliable build</li>
              <li>Designed considering Indian comfort needs</li>
              <li>Free Shipping + Easy Exchange Policy</li>
            </ul>
          </section>

          {/* SEO Closing */}
          <section>
            <h2 className="text-md md:text-lg lg:text-xl font-semibold mb-2">
              Buy {productslug} Footwear Online in India
            </h2>
            <p className="text-gray-700 text-[11px] md:text-sm lg:text-base">
              Shop Markline’s exclusive {productslug?.toLowerCase()} footwear collection online and find the perfect pair
              that brings comfort, style, and long-lasting quality together. From everyday classics to
              fashionable styles — Markline ensures every step feels confident and effortless.
            </p>
          </section>

        </div>

        <h2 className="  text-lg lg:text-xl font-semibold text-primary">
          POPULAR SEARCHES
        </h2>

        <div className="w-full relative h-auto flex flex-col gap-4">
          <p className=" text-sm sm:text-base font-semibold text-primary">
            Shop Shoes By Gender
          </p>
          <div className="w-full relative h-auto flex flex-wrap items-center gap-2">
            <Link
              href={"/collections/men"}
              className=" text-[11px] sm:text-sm font-semibold text-orange-600  text-primary   px-3 border-primary "
            >
              Men Shoes
            </Link>
            <Link
              href={"/collections/women"}
              className=" text-[11px] sm:text-sm font-semibold text-orange-600  border-l text-primary   px-3 border-primary "
            >
              Women Shoes
            </Link>
            <Link
              href={"/collections/kids"}
              className=" text-[11px] sm:text-sm font-semibold text-orange-600  border-l text-primary   px-3 border-primary "
            >
              Kids Shoes
            </Link>

          </div>
        </div>
        <div className="w-full relative h-auto flex flex-col gap-4">
          <p className=" text-sm sm:text-base font-semibold text-primary">
            Shop By Shoe Type
          </p>
          <div className="w-full relative h-auto flex flex-wrap items-center gap-2">
            {genderCollection &&
              genderCollection?.data?.map((item, index) => (
                <Link
                  href={`/collections/${item.gender}/${item.slug}`.toLowerCase()}
                  className="text-[11px] sm:text-sm font-semibold text-orange-600  border-l text-primary  px-3 border-primary"
                  key={index}
                >
                  {item.name}
                </Link>
              ))}
          </div>
        </div>
        <div className="w-full relative h-auto flex flex-col gap-2">
          <p className="text-base font-semibold text-primary">
            Shop By Women Shoe Type
          </p>
          <div className="w-full relative h-auto flex flex-wrap items-center gap-2">
            <Link
              href="/collections/women/wedding-specials"
              className="text-[11px] sm:text-sm font-semibold text-orange-600  border-l text-primary   px-3 border-primary"
            >
              Women Wedding Specials
            </Link>
            <Link
              href={"/collections/women/sandals"}
              className="text-[11px] sm:text-sm font-semibold text-orange-600  border-l text-primary   px-3 border-primary"
            >
              Women Sandals
            </Link>
            <Link
              href={"/collections/women/flats"}
              className="text-[11px] sm:text-sm font-semibold text-orange-600  border-l text-primary   px-3 border-primary"
            >
              Women Flats
            </Link>
            <Link
              href={"/collections/women/Thongs sandels"}
              className="text-[11px] sm:text-sm font-semibold text-orange-600  border-l text-primary   px-3 border-primary"
            >
              Women Thongs sandels
            </Link>
            <Link
              href={"/collections/women/ballerinas"}
              className="text-[11px] sm:text-sm font-semibold text-orange-600  border-l text-primary   px-3 border-primary"
            >
              Women Ballerinas
            </Link>
            <Link
              href={"/collections/women/mules"}
              className="text-[11px] sm:text-sm font-semibold text-orange-600 border-r border-l text-primary   px-3 border-primary"
            >
              Women Mule
            </Link>
          </div>
        </div>
      </section>


    </>
  );
}

export default GenderPage;
