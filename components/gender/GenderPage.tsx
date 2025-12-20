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
    queryFn: () => getCollectionBaseOnGender(finalslug||""),
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

  console.log(genderCollection, "this is all collection ");

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

        <h1 className=" text-base md:text-xl lg:text-2xl xl:text-3xl font-semibold text-primary capitalize  px-5 lg:px-10 xl:px-20 2xl:px-40 ">
          Products - {productslug}{" "}
          {`${
            getallproductbaseongender.data
              ? getallproductbaseongender.data.length
              : ""
          }`}{" "}
        </h1>

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
                productsCardCss=" h-[250px]  sm:h-[300px] md:h-[350px] lg:h-[350px]"
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
            <Link
              href={"/collections/best-sellers"}
              className=" text-[11px] sm:text-sm font-semibold text-orange-600 border-r  text-primary   px-3 border-primary "
            >
              Best Seller
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

        <div className=" py-10 flex flex-col gap-10 no-scrollbar overflow-y-auto ">
          <section>
            <h2 className=" text-md md:text-lg lg:text-xl  font-semibold mb-4">
              Explore Footwear for Everyone
            </h2>
            <p className="text-gray-700 text-[11px] md:text-sm lg:text-base">
              From playful kicks for kids to fashion-forward styles for GenZ,
              timeless classics for men, and elegant essentials for women, our
              diverse collection ensures that everyone finds their perfect fit.
              We combine comfort, quality, and the latest trends to create a
              seamless experience for every step of life.
            </p>
          </section>

          <section>
            <h2 className="text-md md:text-lg lg:text-xl font-semibold mb-4">
              Types of Footwear by Gender
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 text-[11px] md:text-sm lg:text-base">
              <li>
                <strong>For Men:</strong> Discover versatile lace-ups, loafers,
                ethnic mojaris, and street-ready sneakers designed for daily
                grind and weekend style.
              </li>
              <li>
                <strong>For Women:</strong> Choose from elegant heels, trendy
                flats, ethnic kolhapuris, and comfy slip-ons—perfectly balancing
                fashion and comfort.
              </li>
              <li>
                <strong>For Kids:</strong> Fun, flexible, and durable shoes
                tailored for growing feet. Explore velcro sneakers, sandals, and
                colorful sports shoes that keep up with their energy.
              </li>
              <li>
                <strong>For GenZ:</strong> Bold, expressive footwear like chunky
                sneakers, graphic slip-ons, and trend-led sandals that match
                their ever-evolving fashion sense.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-md md:text-lg lg:text-xl font-semibold mb-4">
              How to Choose the Right Shoes
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 text-[11px] md:text-sm lg:text-base">
              <li>
                <strong>Age & Style:</strong> Select age-appropriate
                designs—functional and playful for kids, expressive for GenZ,
                and versatile for adults.
              </li>
              <li>
                <strong>Occasion:</strong> From casual outings to formal events,
                choose shoes that match your lifestyle and schedule.
              </li>
              <li>
                <strong>Fit & Comfort:</strong> Always check sizing charts and
                customer reviews. Comfort features like arch support and padded
                soles are a must.
              </li>
              <li>
                <strong>Material:</strong> Leather for durability, mesh for
                breathability, and canvas or synthetics for affordability and
                flair.
              </li>
              <li>
                <strong>Wear Frequency:</strong> For frequent use, invest in
                supportive, durable shoes. For style rotation, consider lighter
                designs.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-md md:text-lg lg:text-xl font-semibold mb-4">
              Footwear Trends for All
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 text-[11px] md:text-sm lg:text-base">
              <li>
                <strong>Bold Soles:</strong> Platform sneakers and boots are
                popular across ages and genders.
              </li>
              <li>
                <strong>Pastel Tones & Neutrals:</strong> Universally flattering
                hues dominating this season.
              </li>
              <li>
                <strong>Retro Revivals:</strong> Styles like Mary Janes and
                high-top sneakers are making a fashionable comeback.
              </li>
              <li>
                <strong>Tech Comfort:</strong> Cushioned footbeds and
                lightweight designs for all-day wear.
              </li>
              <li>
                <strong>Ethnic Fusion:</strong> Traditional designs reimagined
                for modern wardrobes.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-md md:text-lg lg:text-xl font-semibold mb-4">
              Why Quality Footwear Matters
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 text-[11px] md:text-sm lg:text-base">
              <li>
                <strong>Comfort:</strong> Supportive construction makes walking
                and standing easier for all ages.
              </li>
              <li>
                <strong>Durability:</strong> Long-lasting shoes reduce waste and
                frequent replacement costs.
              </li>
              <li>
                <strong>Foot Health:</strong> Proper fit and cushioning prevent
                common issues like heel pain and blisters.
              </li>
              <li>
                <strong>Confidence:</strong> Stylish shoes that feel good can
                uplift your entire outfit and mood.
              </li>
            </ul>
          </section>
        </div>
      </section>
    </>
  );
}

export default GenderPage;
