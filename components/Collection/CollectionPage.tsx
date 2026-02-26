"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import GridRroduct from "../Home/GridRroduct";
import ProductFilter from "../Common/ProductFilter";
import {
  getProductBaseOnCollection,
  getAllCollections,
  getAllBanner,
  getcollection,
  getAllCollectionsBaseOnGender,
  getCollectionBaseOnGender,
} from "@/Supabase/SupabaseApi";
import { useParams } from "next/navigation";
import {
  Colors,
  Images,
  NewProductProps,
  ProductsProps,
  ProductVariant,
  Sizes,
} from "@/types/interfaces";
import ProductCardSkeleton from "../Skeleton/ProductCardSkeleton";
import Link from "next/link";

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
import { selectColorAndSizesProps } from "../Products/Products.page";
import MiniCollectionCard from "../Home/MiniCellectionCard";

function CategoryL2page() {
  const { collection, group } = useParams();
  const [productShow, setProductShow] = useState(20);
  const [productRangevalue, setPRoductRange] = useState(5000);
  const [filterProducts, setFilterProducts] = useState<NewProductProps[]>();
  const nslug = Array.isArray(collection) ? collection[0] : collection;
  const gslug = Array.isArray(group) ? group[0] : group;
  const [selectColorAndSizes, setSelectColorAndSizes] =
    useState<selectColorAndSizesProps>({
      color: [],
      size: [],
    });

  const {
    data: products,
    isLoading,
    isError,
  } = useQuery<any>({
    queryKey: ["collectiondatabaseonslug", nslug],
    enabled: !!collection,
    queryFn: () => getProductBaseOnCollection(nslug || ""),
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const {
    data: genderCollection = { data: [] },
    isLoading: isGenderLoading,
    isError: isGenderDataerror,
  } = useQuery<{ data: any[] }>({
    queryKey: ["gendercollection", group],
    enabled: !!group,
    queryFn: () => getCollectionBaseOnGender(`${gslug}`.toUpperCase()),
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  useEffect(() => {
    if (!products) return;

    const filtered = products.filter((product: NewProductProps) => {
      const variants = product?.product_variants || [];

      // --- PRICE check ---
      const lowestPrice = variants.length
        ? Math.min(...variants.map((variant) => variant.price || 0))
        : 0;
      const matchPrice = lowestPrice <= productRangevalue;

      // --- GENDER check ---
      const matchGender = gslug ? product.gender === gslug.toUpperCase() : true;

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
  }, [products, productRangevalue, gslug, selectColorAndSizes]);

  function showMoreProducts() {
    if (products?.length >= 20) {
      setProductShow((prev) => (prev += 20));
    }
  }

  const { allColors, allSizes } = useMemo(() => {
    const colorMap = new Map<string, Colors>();
    const sizeMap = new Map<string, Sizes>();

    products?.forEach((product: any) => {
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
  }, [products]);

  console.log(products, "filter data");

  return (
    <>
      {/* <L2Banner data={HomeBanner} />/ */}

      <Breadcrumb className="w-full relative  px-2 lg:px-10 xl:px-20 2xl:px-40">
        <BreadcrumbList className="w-full relative h-auto flex items-center py-2 rounded-lg px-2 ">

          <BreadcrumbItem>
            <BreadcrumbLink
              href={`/collections`}
              className=" text-sm sm:text-base text-primary cursor-pointer"
            >
              collections
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              href={`/collections/${gslug}`}
              className=" text-sm sm:text-base text-primary cursor-pointer"
            >
              {gslug}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-sm sm:text-base text-primary cursor-pointer">
              {nslug?.split("-").join(" ")}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-2 w-full relative  px-3 lg:px-10 xl:px-20 2xl:px-40 ">
        <h1 className=" text-xl md:text-xl lg:text-2xl xl:text-3xl font-semibold text-primary  capitalize ">
          {nslug?.split("-").join(" ")}{" "}
        </h1>
        <p className=" text-xs md:text-base font-medium text-primary  line-clamp-2">
          Discover comfortable, stylish and lightweight {gslug?.toLowerCase()} {nslug?.toLowerCase()} designed for everyday wear in India.
          Perfect for office, casual outings, festive occasions and daily comfort with durable quality you can trust.
        </p>
      </div>

      {/* <section className='w-full relative gap-2 items-center px-3 md:px-5 lg:px-10  mt-8  h-auto flex border-b border-gray-400 pb-3  '>
                <Swiper
                    slidesPerView={'auto'}
                    className="mySwiper w-full  relative h-auto  "
                >
                    {
                        genderCollection?.data?.length > 0 &&
                        genderCollection?.data?.map((collec) => (
                            <SwiperSlide className='max-w-fit  border h-auto text-base   ' key={collec.slug}>
                                <MiniCollectionCard collections={collec} url={`${gslug}`} />
                            </SwiperSlide>
                        ))
                    }
                </Swiper>
            </section> */}

      <section className="w-full min-h-[300px] mt-5 relative  gap-10  bg-gray-200  ">
        <span className=" flex items-center border-b border-white w-full justify-between h-fit sticky top-14 z-30 bg-gray-200   py-5 px-2 lg:px-10 xl:px-20 2xl:px-40 ">
          <ProductFilter
            gender={gslug}
            collection={genderCollection.data}
            productRangevalue={productRangevalue}
            setPRoductRange={setPRoductRange}
            slug={nslug}
            colors={allColors}
            sizes={allSizes}
            SetselectColorAndSizes={setSelectColorAndSizes}
          />
        </span>

        <div className="w-full gap-5  relative flex flex-col px-2 lg:px-10 xl:px-20 2xl:px-40 pt-3 md:pt-5 lg:pt-10 ">
          {isLoading ? (
            <div className="grid py-5 lg:py-10 grid-cols-2 md:grid-cols-3  lg:grid-cols-4  items-start justify-start gap-3 px-2  lg:px-10   ">
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
            </div>
          ) : products?.length ? (
            // <GridRroduct data={filterProducts ? filterProducts : products} url={'product'} css=' grid-cols-2 lg:grid-cols-3  xl:grid-cols-4 2xl:grid-cols-5 bg-gray-200 ' productsCardCss=' h-[250px]  sm:h-[300px] md:h-[350px] lg:h-[350px]' />

            <GridRroduct
              data={filterProducts ? filterProducts : products}
              url={"product"}
              css=" grid-cols-2 md:grid-cols-3  xl:grid-cols-4 2xl:grid-cols-5 bg-gray-200  gap-2 lg:gap-3"
              productsCardCss="  h-[180px] object-cover  sm:h-[300px] md:h-[300px] xl:[300px] 2xl:h-[320px] 3xl:h-[350px]"
            />
          ) : (
            <div className="grid grid-cols-2 py-5 lg:py-10 md:grid-cols-3  lg:grid-cols-4   items-start justify-start gap-3 px-2 md:px-5  lg:px-10   ">
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
            </div>
          )}

          {/* <section className="w-full relative h-auto flex items-end justify-end pt-10 ">
            {products?.length >= productShow && (
              <button
                className="w-fit relative h-auto text-base font-medium border cursor-pointer px-3 py-2  bg-primary text-white "
                onClick={showMoreProducts}
              >
                Show More
              </button>
            )}
          </section> */}
        </div>
      </section>




      <section className="w-full relative flex flex-col gap-5 py-5 pb-10 px-2 lg:px-10 xl:px-20 2xl:px-40">



        <div className="py-2 flex flex-col gap-10 no-scrollbar overflow-y-auto">

          <section>
            <h2 className="text-md md:text-lg lg:text-xl font-semibold mb-4">
              Shop Comfortable & Stylish {gslug} {nslug} Online in India
            </h2>

            <p className="text-gray-700 text-xs md:text-sm lg:text-base">
              Explore a thoughtfully crafted collection of comfortable, elegant and
              stylish {gslug?.toLowerCase()} {nslug?.toLowerCase()} online in India at Markline.
              Designed for the Indian lifestyle, these footwear options are ideal for
              daily wear, office use, festive occasions, casual outings and travel.
              Each pair blends supportive cushioning, durability, lightweight feel and
              modern style to give you all–day comfort with a refined look.
              Whether you want fashionable everyday footwear or classy occasion wear,
              Markline brings designs that perfectly match your outfit and lifestyle needs.
            </p>
          </section>

          <section>
            <h2 className="text-md md:text-lg lg:text-xl font-semibold mb-4">
              Why Choose Markline {gslug} {nslug}?
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 text-xs md:text-sm lg:text-base">
              <li><strong>Indian Comfort Fit:</strong> Built to suit Indian foot shape & weather</li>
              <li><strong>Daily Wear Friendly:</strong> Lightweight, durable and long-lasting</li>
              <li><strong>Trendy & Stylish:</strong> Fashion-forward designs loved across India</li>
              <li><strong>Affordable Premium:</strong> Luxury feel without premium pricing</li>
              <li><strong>Quality Materials:</strong> Soft cushioning, strong grip & smooth finish</li>
            </ul>
          </section>

          <section>
            <h2 className="text-md md:text-lg lg:text-xl font-semibold mb-4">
              Perfect for Every Indian Occasion
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 text-xs md:text-sm lg:text-base">
              <li>Daily wear & office routine</li>
              <li>Festivals, weddings & celebrations</li>
              <li>Casual outings, travel & shopping</li>
              <li>College, parties & lifestyle fashion</li>
            </ul>
          </section>

          <section>
            <h2 className="text-md md:text-lg lg:text-xl font-semibold mb-4">
              Trending {gslug} {nslug} in India
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 text-xs md:text-sm lg:text-base">
              <li>Comfortable daily wear {nslug?.toLowerCase()}</li>
              <li>Stylish & fashionable {gslug?.toLowerCase()} footwear India</li>
              <li>Lightweight cushioned {nslug?.toLowerCase()} for all-day comfort</li>
              <li>Premium design at affordable prices</li>
            </ul>
          </section>

          <section>
            <h2 className="text-md md:text-lg lg:text-xl font-semibold mb-4">
              Buy {gslug} {nslug} Online in India
            </h2>
            <p className="text-gray-700 text-xs md:text-sm lg:text-base">
              Shop 100% genuine, high-quality {gslug?.toLowerCase()} {gslug?.toLowerCase()} online at Markline.
              Enjoy smooth shopping, fast India-wide delivery, secure payments, and premium comfort footwear
              designed for everyday Indian lifestyle. Step into style, comfort and confidence with Markline.
            </p>
          </section>
          <h2 className="text-base lg:text-lg font-semibold text-primary">
            POPULAR SEARCHES
          </h2>

          {/* GENDER SECTION */}
          <div className="w-full relative h-auto flex flex-col gap-4">
            <p className="text-base font-semibold text-primary">Shop Shoes By Gender</p>

            <div className="w-full flex flex-wrap items-center gap-2">
              <Link href="/collections/men" className="text-xs sm:text-sm font-semibold text-orange-600 border-l px-3 border-primary">
                Men Shoes
              </Link>
              <Link href="/collections/women" className="text-xs sm:text-sm font-semibold text-orange-600 border-l px-3 border-primary">
                Women Shoes
              </Link>
              <Link href="/collections/kids" className="text-xs sm:text-sm font-semibold text-orange-600 border-l px-3 border-primary">
                Kids Shoes
              </Link>
            </div>
          </div>

          {/* CATEGORY SECTION */}
          <div className="w-full relative h-auto flex flex-col gap-4">
            <p className="text-base font-semibold text-primary">Shop By Shoe Type</p>
            <div className="w-full flex flex-wrap items-center gap-2">
              {/* dynamically map your categories */}
            </div>
          </div>

          {/* WOMEN CATEGORY LINKS (KEEP) */}
          <div className="w-full relative flex flex-col gap-2">
            <p className="text-base font-semibold text-primary">Shop By Women Shoe Type</p>
            <div className="w-full flex flex-wrap items-center gap-2">
              <Link href="/collections/women/wedding-specials" className="text-xs sm:text-sm font-semibold text-orange-600 border-l px-3 border-primary">Women Wedding Specials</Link>
              <Link href="/collections/women/sandals" className="text-xs sm:text-sm font-semibold text-orange-600 border-l px-3 border-primary">Women Sandals</Link>
              <Link href="/collections/women/flats" className="text-xs sm:text-sm font-semibold text-orange-600 border-l px-3 border-primary">Women Flats</Link>
              <Link href="/collections/women/thongs" className="text-xs sm:text-sm font-semibold text-orange-600 border-l px-3 border-primary">Women Thong Sandals</Link>
              <Link href="/collections/women/ballerinas" className="text-xs sm:text-sm font-semibold text-orange-600 border-l px-3 border-primary">Women Ballerinas</Link>
              <Link href="/collections/women/mules" className="text-xs sm:text-sm font-semibold text-orange-600 border-l px-3 border-primary">Women Mules</Link>
            </div>
          </div>

          {/* ---------------------- */}
          {/* SEO CONTENT SECTION */}
          {/* ---------------------- */}
        </div>
      </section>
    </>
  );
}

export default CategoryL2page;
