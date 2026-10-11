"use client";
import Image from "next/image";

import React, { useState, useMemo } from "react";
import { useQuery } from "react-query";
import dynamic from "next/dynamic";
const OfferPopupDialog = dynamic(() => import("../Common/OfferPopupDialog"), { ssr: false });
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
  getPromotionalCollectionBanners,
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

import { motion, Variants } from "framer-motion";
import { getCloudflareImageUrl, safeJsonParse } from "@/lib/utils";

interface HomePageProps {
  initialBanners?: any;
  initialCollections?: any;
  initialGroupOfProducts?: any;
}

function HomePage({ initialBanners, initialCollections, initialGroupOfProducts }: HomePageProps) {
  const [selected, setSelected] = useState("women");

  const handleSelect = (option: string) => {
    setSelected(option);
  };


  const { data: homebanners = [], isLoading: isHomebanners } = useQuery<any>({
    queryKey: ["homebanners"],
    queryFn: getAllBanner,
    initialData: initialBanners,
    staleTime: 1000 * 60 * 60 * 24 * 2, // 2 days
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const { data: promotionalBanners = [] } = useQuery<any>({
    queryKey: ["promotionalCollectionBanners"],
    queryFn: getPromotionalCollectionBanners,
    staleTime: 1000 * 60 * 60 * 24 * 2, // 2 days
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
    initialData: initialCollections,
    staleTime: 1000 * 60 * 60 * 24 * 2, // 2 days
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
    initialData: initialGroupOfProducts,
    staleTime: 1000 * 60 * 60 * 24 * 2, // 2 days
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const activeGroups = useMemo(() => {
    return (groupOfProducts?.data || [])
      .filter((item: any) => item.isActive !== false)
      .sort((a: any, b: any) => Number(a.index || 0) - Number(b.index || 0));
  }, [groupOfProducts]);


  const activeHomeBanners = useMemo(() => {
    return Array.isArray(homebanners)
      ? homebanners.filter((b: any) => b.isEnable !== false)
      : [];
  }, [homebanners]);

  interface BannerCardItem {
    image_url: string;
    name?: string;
    url?: string;
  }

  interface BannerSlotData {
    type: "SINGLE" | "MULTIPLE";
    desktopBanner?: any;
    mobileBanner?: any;
    items: BannerCardItem[];
  }

  const promotionalSlots = useMemo(() => {
    const rawList = Array.isArray(promotionalBanners)
      ? promotionalBanners.filter((b: any) => b && b.isEnable !== false)
      : [];

    const multipleList: BannerCardItem[] = [];
    const singleDesktopList: any[] = [];
    const singleMobileList: any[] = [];

    // Separate all MULTIPLE banners and SINGLE banners
    for (const b of rawList) {
      const isMult = (b.Is_multiple || b.is_multiple || "").toUpperCase() === "MULTIPLE";

      if (isMult) {
        // If image_url is a JSON array string in a single row
        let parsedArray: any = null;
        if (typeof b.image_url === "string") {
          const trimmed = b.image_url.trim();
          if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
            parsedArray = safeJsonParse(trimmed);
          } else if (trimmed.includes(",")) {
            parsedArray = trimmed.split(",").map((s: string) => s.trim());
          }
        } else if (Array.isArray(b.image_url)) {
          parsedArray = b.image_url;
        }

        if (Array.isArray(parsedArray) && parsedArray.length > 1) {
          parsedArray.forEach((item: any) => {
            multipleList.push({
              image_url: typeof item === "string" ? item : item.image_url || item.url || "",
              name: (typeof item === "object" ? item.name : "") || b.name || "",
              url: (typeof item === "object" ? item.url : "") || b.url || "#",
            });
          });
        } else {
          multipleList.push({
            image_url: b.image_url || "",
            name: b.name || "",
            url: b.url || "#",
          });
        }
      } else {
        if (b.isMobile) {
          singleMobileList.push(b);
        } else {
          singleDesktopList.push(b);
        }
      }
    }

    const slots: BannerSlotData[] = [];

    // 1. Group MULTIPLE banners into 3-card grid slots
    for (let i = 0; i < multipleList.length; i += 3) {
      slots.push({
        type: "MULTIPLE",
        items: multipleList.slice(i, i + 3),
      });
    }

    // 2. Add SINGLE banners as slots (pairing desktop & mobile where available)
    const maxSingle = Math.max(singleDesktopList.length, singleMobileList.length);
    for (let i = 0; i < maxSingle; i++) {
      slots.push({
        type: "SINGLE",
        desktopBanner: singleDesktopList[i] || null,
        mobileBanner: singleMobileList[i] || null,
        items: [],
      });
    }

    return slots;
  }, [promotionalBanners]);

  const desktopBanners = useMemo(() => {
    return Array.isArray(promotionalBanners)
      ? promotionalBanners.filter((b: any) => !b.isMobile && b.isEnable !== false)
      : [];
  }, [promotionalBanners]);

  const mobileBanners = useMemo(() => {
    return Array.isArray(promotionalBanners)
      ? promotionalBanners.filter((b: any) => b.isMobile && b.isEnable !== false)
      : [];
  }, [promotionalBanners]);

  const renderBannerSlot = (slotIndex: number) => {
    const slot = promotionalSlots[slotIndex];

    // 1. If MULTIPLE -> Render 3-image grid layout
    if (slot && slot.type === "MULTIPLE" && slot.items && slot.items.length > 0) {
      const items = slot.items.slice(0, 3);

      return (
        <div className="w-full relative py-3 md:py-6  px-3 sm:px-5 lg:px-10 xl:px-20 2xl:px-40">
          {/* 2-Column Grid on Mobile (2 side-by-side on top, 1 on bottom) & 3-Column Grid on Desktop */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-4 lg:gap-6 w-full">
            {items.map((item, idx) => (
              <Link
                key={idx}
                href={item.url || "#"}
                className={`group relative block overflow-hidden rounded-md bg-[#f8f8f8] border border-gray-200/80 shadow-sm hover:shadow-md transition-all duration-300 ${
                  idx === 2
                    ? "col-span-2 md:col-span-1 aspect-[3/4] sm:aspect-[16/9] md:aspect-[4/5]"
                    : "aspect-[3/4] sm:aspect-[4/5]"
                }`}
              >
                <img
                  src={getCloudflareImageUrl(item.image_url)}
                  alt={item.name || `Promotional Collection ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
              </Link>
            ))}
          </div>
        </div>
      );
    }

    // 2. SINGLE Banner (or fallback to slot/legacy arrays)
    const desktopBanner = slot?.desktopBanner || desktopBanners[slotIndex];
    const mobileBanner = slot?.mobileBanner || mobileBanners[slotIndex];

    if (!desktopBanner && !mobileBanner) return null;

    return (
      <div className="w-full relative py-2 my-4">
        {desktopBanner && (
          <div className="hidden min-[701px]:block w-full">
            <Link href={desktopBanner.url || "#"}>
              <div className="relative w-full aspect-[21/9] max-h-[560px] lg:max-h-[690px] overflow-hidden cursor-pointer hover:opacity-95 transition-opacity">
                <img
                  src={getCloudflareImageUrl(desktopBanner.image_url)}
                  alt={desktopBanner.name || `Promo Banner`}
                  className="w-full h-full object-cover"
                />
              </div>
            </Link>
          </div>
        )}
        {mobileBanner && (
          <div className="block min-[701px]:hidden w-full">
            <Link href={mobileBanner.url || "#"}>
              <div className="relative w-full aspect-[4/3] max-h-[380px] overflow-hidden cursor-pointer hover:opacity-95 transition-opacity">
                <img
                  src={getCloudflareImageUrl(mobileBanner.image_url)}
                  alt={mobileBanner.name || `Mobile Promo Banner`}
                  className="w-full h-full object-cover"
                />
              </div>
            </Link>
          </div>
        )}
      </div>
    );
  };


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

  ];

  const fadeInVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  } as const;

  return (
    <>
      <OfferPopupDialog />
      <section className="w-full relative gap-2 items-center px-3 md:px-5 lg:px-10 py-3 h-auto flex lg:hidden border-b border-gray-300">
        <Swiper
          slidesPerView="auto"
          spaceBetween={12}
          className="w-full mySwiper"
        >
          {allcollection?.map((collection) => {
            // Parse image_urls (first image)
            const imageData = collection?.image_urls?.[0]
              ? safeJsonParse(collection?.image_urls?.[0])
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
                      src={getCloudflareImageUrl(imageData?.image_url)}
                      alt={imageData?.name || collection?.name || "Collection image"}
                      height={900}
                      width={900}
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

      <Hero bannerImages={activeHomeBanners} />




      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInVariants}
        className="w-full  relative flex-col gap-5  2xl:gap-10 items-start  mt-7 lg:mt-10 h-auto flex pb-3 px-5 lg:px-10 xl:px-20 2xl:px-40 py-5 lg:py-10"
      >
        <div className="w-full relative flex items-center justify-between ">
          <h1 className="text-lg md:text-2xl xl:text-3xl font-semibold text-primary uppercase">
            Shop By Collections
          </h1>
          <Link
            href={"/collections"}
            className="text-sm md:text-base lg:text-lg text-primary rounded-md  self-center justify-self-center relative font-medium  flex items-center justify-center gap-2  cursor-pointer group"
          >
            View{" "}
            <ArrowUpRight size={20} className="text-primary   " />
          </Link>
        </div>


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
              slidesPerView: 3, // full desktop
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
                    imageClass="   h-[300px] sm:h-[390px] md:h-[380px] lg:h-[460px] 2xl:h-[600px] w-full border  rounded-lg object-cover relative  transition-all duration-100 object-bottom"
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
      </motion.section>




      {isLoading ? (
        <div className="grid grid-cols-2 lg:py-10 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 px-5 lg:px-10 xl:px-20 2xl:px-40">
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
        </div>
      ) : activeGroups.length > 0 ? (
        activeGroups.map((item: any, index: number) => (
          <React.Fragment key={item.id || index}>
            {item.products?.length > 0 && (
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={fadeInVariants}
              >
                <CategoriesSection
                  title={`${item?.heading} `}
                  subtitle={`${item?.discription}`}
                  url={`${item?.url}`}
                  urltext={`${item?.urlText}`}
                >
                  <CarouselProduct
                    url="product"
                    product={item.products.slice(0, 10)}
                    productsCardCss="h-[260px] object-cover sm:h-[300px] md:h-[350px] lg:h-[400px]"
                  />
                </CategoriesSection>
              </motion.div>
            )}

            {/* Interleaved banner slot between groups (Group -> Banner -> Group -> Banner) */}
            {renderBannerSlot(index)}
          </React.Fragment>
        ))
      ) : null}

      {/* Any remaining banner slots if there are more promotional banners than groups */}
      {promotionalSlots.length > activeGroups.length &&
        promotionalSlots.slice(activeGroups.length).map((_, idx) => (
          <React.Fragment key={`extra-banner-${idx}`}>
            {renderBannerSlot(activeGroups.length + idx)}
          </React.Fragment>
        ))}



      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeInVariants}
      >
        <LeatestCollection url={"collections"} />
      </motion.div>
    </>
  );
}

export default HomePage;
