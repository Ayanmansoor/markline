"use client";
// import Image from "next/image";

import React, { useState, useReducer, useEffect, useMemo } from "react";
import { FaHeart } from "react-icons/fa6";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import Link from "next/link";
import { Pagination, Scrollbar } from "swiper/modules";
import {
  ProductsDataProps,
  Colors,
  ProductsProps,
  Sizes,
  Images,
  newProductsProps,
  ProductVariant,
} from "@/types/interfaces";
import AddToCardPopver from "./AddToCardPopver";

import { useWishlists } from "@/Contexts/wishlist";
import { Plus } from "lucide-react";
import { calculateVariantPrice } from '@/lib/pricing';
import { safeJsonParse } from "@/lib/utils";

function ProductCard({ product, url, className }: newProductsProps) {
  const { addToWishlist, removeFromWishlist, wishlist, isProductInWishlist } =
    useWishlists();

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    product?.product_variants[0]
  );
  const [Stringifycolor, setStringifyColor] = useState<Colors[]>([]);
  const [StringifySize, setStringifySize] = useState<Sizes[]>([]);
  const [StringifyImages, setStringifyImages] = useState<any[] | undefined>([]);
  const [selectedColor, setSelectedColor] = useState<Colors>();

  const [isInWhishlist, setIsInwhishlist] = useState<boolean>(false);

  const priceDetails = useMemo(() => {
    return calculateVariantPrice(selectedVariant || {}, selectedVariant?.discounts);
  }, [selectedVariant]);

  // useEffect(() => {
  //   setSelectedVariant(product.product_variants[0])
  // }, [product])

  useEffect(() => {
    if (
      !product ||
      !product.product_variants ||
      product.product_variants.length === 0
    )
      return;
    try {
      const parsedImages: Images[] = Array.isArray(selectedVariant?.image_url)
        ? selectedVariant.image_url.map((item: any) => typeof item === "string" ? safeJsonParse(item) : item).filter(Boolean)
        : [];

      setStringifyImages(parsedImages);
    } catch (error) {
      console.error("Failed to parse variant data:", error);
    }
  }, [selectedVariant]);

  useEffect(() => {
    const present = isProductInWishlist({ productId: product?.id });
    setIsInwhishlist(present);
  }, [wishlist.length, product]);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to the product page when clicking the heart
    if (isInWhishlist) {
      removeFromWishlist({ productId: product.id });
    } else {
      addToWishlist({
        name: product.name,
        productId: product.id,
        price: selectedVariant?.price || 0,
        quantity: 1,
        color: [],
        size: [],
        image_urls: StringifyImages || [],
        discounts: selectedVariant?.discounts as any,
        discount_key: product?.discount_key || "",
        slug: product.slug,
      });
    }
  };

  const { allColors, allSizes } = useMemo(() => {
    const colorMap = new Map<string, Colors>();
    const sizeMap = new Map<string, Sizes>();
    product.product_variants?.forEach((variant: ProductVariant) => {
      let colorArray: Colors[] = [];
      let sizeArray: Sizes[] = [];

      // normalize colors
      if (Array.isArray(variant.colors)) {
        colorArray = variant.colors.map((item) =>
          typeof item === "string" ? safeJsonParse(item) : item
        ).filter(Boolean);
      } else if (typeof variant.colors === "string") {
        const parsed = safeJsonParse(variant.colors);
        colorArray = Array.isArray(parsed) ? parsed : (parsed ? [parsed] : []);
      }

      // normalize sizes
      if (Array.isArray(variant.sizes)) {
        sizeArray = variant.sizes.map((item) =>
          typeof item === "string" ? safeJsonParse(item) : item
        ).filter(Boolean);
      } else if (typeof variant.sizes === "string") {
        const parsed = safeJsonParse(variant.sizes);
        sizeArray = Array.isArray(parsed) ? parsed : (parsed ? [parsed] : []);
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

    return {
      allColors: Array.from(colorMap.values()),
      allSizes: Array.from(sizeMap.values()),
    };
  }, [product]);

  const handleColorChange = (color: Colors) => {
    console.log(color, "this is colors");
    setSelectedColor(color);

    const matchedVariant = product.product_variants.find((variant) => {
      try {
        const variantColors: Colors[] = Array.isArray(variant.colors)
          ? variant.colors.map((item) =>
            typeof item === "string" ? safeJsonParse(item) : item
          ).filter(Boolean)
          : typeof variant.colors === "string"
            ? (safeJsonParse(variant.colors) || [])
            : [];
        return variantColors.some((c) => c?.name === color.name);
      } catch (error) {
        console.error("Error parsing variant colors:", error);
        return false;
      }
    });

    if (matchedVariant) {
      setSelectedVariant?.(matchedVariant);
    }
  };

  return (
    <section className="max-w-full  relative h-full    justify-between flex items-start border-none flex-col  group ">
      <span className=" h-auto relative w-full bg-[#ebeeef] group transition-all duration-500 ease-in cursor-pointer  ">
        <Link href={`/${url}/${product?.slug}`}>
          <Swiper
            style={
              {
                "--swiper-pagination-color": "#0c0c0c",
                "--swiper-pagination-bullet-inactive-color": "#0c0c0c",
                "--swiper-pagination-bullet-inactive-opacity": "1",
                "--swiper-pagination-bullet-size": "7px",
                "--swiper-pagination-bullet-horizontal-gap": "6px",
              } as React.CSSProperties & Record<string, string>
            }
            pagination={{
              dynamicBullets: true,
            }}
            modules={[Pagination]}
            className="mySwiper w-full relative h-full "
          >
            {StringifyImages &&
              StringifyImages?.map((image, index: number) => (
                <SwiperSlide
                  className="w-full relative h-full border overflow-hidden group/slide"
                  key={index}
                >
                  <img
                    src={`${image?.image_url}` || ""}
                    alt={`${image.name} - markline `}
                    className={`w-full object-contain bg-transparent transition-opacity duration-500 ease-in-out sm:object-cover ${index === 0 && StringifyImages.length > 1
                      ? "absolute top-0 left-0 opacity-100 group-hover/slide:opacity-0"
                      : "relative hover:scale-[1.010]"
                      } ${className ? className : "h-[260px] aspect-square sm:h-[300px] md:h-[250px] lg:h-[350px] xl:h-[400px]"}`}
                    height={500}
                    width={500}
                    loading="lazy"
                  />
                  {index === 0 && StringifyImages.length > 1 && (
                    <img
                      src={`${StringifyImages[1]?.image_url}` || ""}
                      alt={`${StringifyImages[1].name || "hover"} - markline`}
                      className={`w-full object-contain bg-transparent transition-opacity duration-500 ease-in-out sm:object-cover relative opacity-0 group-hover/slide:opacity-100 ${className ? className : "h-[260px] aspect-square sm:h-[300px] md:h-[250px] lg:h-[350px] xl:h-[400px]"
                        }`}
                      height={500}
                      width={500}
                      loading="lazy"
                    />
                  )}
                </SwiperSlide>
              ))}
          </Swiper>
        </Link>
        <button
          onClick={toggleWishlist}
          className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm shadow-sm border border-gray-100 p-2 md:p-2 rounded-full z-20 hover:scale-110 hover:bg-white transition-all duration-300 group/heart"
        >
          <FaHeart
            className={`text-[12px] sm:text-[14px] md:text-[16px] flex items-center justify-center transition-colors duration-300 ${isInWhishlist ? "text-red-500" : "text-gray-500 group-hover/heart:text-red-400"
              }`}
          />
        </button>
      </span>




      <Link
        href={`/${url}/${product?.slug}`}
        className="flex w-full items-start pt-2 justify-start min-h-[45px]   gap-0 "
      >
        <h2 className=" text-[11px] md:text-sm  xl:text-base 2xl:text-base font-medium !line-clamp-2 md:!line-clamp-3   flex items-center gap-1 capitalize text-primary">
          {product?.name}
        </h2>
      </Link>
      <div className="flex items-start w-full relative h-auto gap-2 md:py-2 py-0 pt-0 md:pt-3 justify-between">

        <div className="flex flex-col items-start gap-0.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            {priceDetails.totalSavingsPercent > 0 && (
              <span className="text-sm md:text-sm font-semibold text-white bg-[#b32626] px-1.5 py-0.5 rounded shadow-sm">
                Save {priceDetails.totalSavingsPercent.toFixed(0)}%
              </span>
            )}
            <p className="text-sm sm:text-base md:text-base xl:text-lg font-bold text-[#b32626]">
              ₹ {priceDetails.finalPrice.toLocaleString('en-IN')}
            </p>
          </div>
          {priceDetails.totalSavingsPercent > 0 ? (
            <span className="  text-base md:text-lg text-gray-500 line-through">
              ₹ {priceDetails.mrp.toLocaleString('en-IN')}
            </span>
          ) : (
            <div className="h-[16px] md:h-[18px]"></div> /* spacer if no mrp */
          )}
        </div>

        <div className="w-fit flex gap-1.5 pt-0.5 shrink-0">
          {allColors?.slice(0, 3).map((color, index) => (
            <span
              key={index}
              onClick={(e) => {
                e.preventDefault();
                handleColorChange(color);
              }}
              className={` h-[20px] md:h-[30px] w-[20px] md:w-[30px] rounded-full border-2 p-1 cursor-pointer transition-all duration-200 ${selectedColor?.name == color.name
                ? "border-gray-800 scale-110"
                : "border-gray-300 hover:border-gray-400"
                }`}
              style={{
                backgroundColor: color.hex,
              }}
            />
          ))}
        </div>
      </div>
      <section className="w-full relative h-auto  pb-3 py-0 md:py-2  md:flex-row  flex-col flex  items-start lg:items-center justify-end gap-2 px-1">
        <div className="w-full relative flex  flex-col-reverse md:flex-row items-start md:items-center  justify-between   gap-2 pt-1">
          {/* <AddToCardPopver
            selectedColors={selectedColor}
            currentVariant={selectedVariant}
            currentProduct={product}
            addToWhishlistCB={addTowishlistproduct}
            onVariantChange={(variant) => setSelectedVariant(variant)}
          >
            <button className=" w-full md:w-fit px-3 md:px-4 2xl:px-4   bg-primary text-primary text-white relative h-full py-2 lg:py-2.5   flex items-center justify-center text-xs lg:text-xs   font-medium    group-border-gray-300">
              ADD TO CART
            </button>
          </AddToCardPopver> */}



        </div>
      </section>
    </section>
  );
}

export default ProductCard;
