"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import Link from "next/link";
import { Pagination } from "swiper/modules";
import {
  Colors,
  Images,
  newProductsProps,
  ProductVariant,
} from "@/types/interfaces";
import AddToCardPopver from "./AddToCardPopver";
import ProductQuickViewDialog from "./ProductQuickViewDialog";
import { useWishlists } from "@/Contexts/wishlist";
import { Heart, Plus } from "lucide-react";
import { calculateVariantPrice } from "@/lib/pricing";
import { getCloudflareImageUrl, safeJsonParse } from "@/lib/utils";

function ProductCard({ product, url = "product" }: newProductsProps) {
  const { addToWishlist, removeFromWishlist, wishlist, isProductInWishlist } =
    useWishlists();

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    product?.product_variants?.[0]
  );
  const [StringifyImages, setStringifyImages] = useState<Images[]>([]);
  const [selectedColor, setSelectedColor] = useState<Colors>();
  const [isInWishlist, setIsInWishlist] = useState<boolean>(false);

  const priceDetails = useMemo(() => {
    return calculateVariantPrice(
      selectedVariant || {},
      selectedVariant?.discounts
    );
  }, [selectedVariant]);

  useEffect(() => {
    if (product?.product_variants?.length) {
      setSelectedVariant(product.product_variants[0]);
    }
  }, [product]);

  useEffect(() => {
    if (
      !product ||
      !product.product_variants ||
      product.product_variants.length === 0
    )
      return;
    try {
      const parsedImages: Images[] = Array.isArray(selectedVariant?.image_url)
        ? selectedVariant.image_url
          .map((item: any) =>
            typeof item === "string" ? safeJsonParse(item) : item
          )
          .filter(Boolean)
        : [];

      setStringifyImages(parsedImages);

      // Initialize selected color from current variant if not set
      if (selectedVariant?.colors) {
        const variantColors: Colors[] = Array.isArray(selectedVariant.colors)
          ? selectedVariant.colors
            .map((c: any) => (typeof c === "string" ? safeJsonParse(c) : c))
            .filter(Boolean)
          : typeof selectedVariant.colors === "string"
            ? safeJsonParse(selectedVariant.colors) || []
            : [];
        if (variantColors[0]) {
          setSelectedColor(variantColors[0]);
        }
      }
    } catch (error) {
      console.error("Failed to parse variant data:", error);
    }
  }, [selectedVariant]);

  useEffect(() => {
    const present = isProductInWishlist({ productId: product?.id });
    setIsInWishlist(present);
  }, [wishlist.length, product]);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product?.id) return;
    if (isInWishlist) {
      removeFromWishlist({ productId: product.id });
    } else {
      addToWishlist({
        name: product?.name || "",
        productId: product.id,
        price: selectedVariant?.price || 0,
        quantity: 1,
        color: [],
        size: [],
        image_urls: StringifyImages || [],
        discounts: selectedVariant?.discounts as any,
        discount_key: product?.discount_key || "",
        slug: product?.slug || "",
      });
    }
  };

  const { allColors } = useMemo(() => {
    const colorMap = new Map<string, Colors>();
    product?.product_variants?.forEach((variant: ProductVariant) => {
      let colorArray: Colors[] = [];

      if (Array.isArray(variant.colors)) {
        colorArray = variant.colors
          .map((item) =>
            typeof item === "string" ? safeJsonParse(item) : item
          )
          .filter(Boolean);
      } else if (typeof variant.colors === "string") {
        const parsed = safeJsonParse(variant.colors);
        colorArray = Array.isArray(parsed) ? parsed : parsed ? [parsed] : [];
      }

      colorArray.forEach((color) => {
        if (color?.name && !colorMap.has(color.name)) {
          colorMap.set(color.name, color);
        }
      });
    });

    return {
      allColors: Array.from(colorMap.values()),
    };
  }, [product]);

  const handleColorChange = (color: Colors) => {
    setSelectedColor(color);

    const matchedVariant = product?.product_variants?.find((variant) => {
      try {
        const variantColors: Colors[] = Array.isArray(variant.colors)
          ? variant.colors
            .map((item) =>
              typeof item === "string" ? safeJsonParse(item) : item
            )
            .filter(Boolean)
          : typeof variant.colors === "string"
            ? safeJsonParse(variant.colors) || []
            : [];
        return variantColors.some((c) => c?.name === color.name);
      } catch (error) {
        console.error("Error parsing variant colors:", error);
        return false;
      }
    });

    if (matchedVariant) {
      setSelectedVariant(matchedVariant);
    }
  };

  const productUrl = `/${url || "product"}/${product?.slug}`;
  const primaryImgUrl = StringifyImages[0]?.image_url
    ? getCloudflareImageUrl(StringifyImages[0].image_url)
    : "";
  const secondaryImgUrl = StringifyImages[1]?.image_url
    ? getCloudflareImageUrl(StringifyImages[1].image_url)
    : "";

  return (
    <div className="group relative w-full h-full flex flex-col justify-between bg-white rounded-2xl border border-gray-200/80 p-2 sm:p-2.5 shadow-xs hover:shadow-lg hover:shadow-gray-200/50 hover:-translate-y-0.5 transition-all duration-300">
      {/* 1. Media Container: Aspect ratio 4:5 with 100% full-height image filling */}
      <div className="relative w-full aspect-[4/5] overflow-hidden rounded-xl bg-gray-100">
        {/* Prominent Highlighted Discount Badge */}
        {priceDetails.totalSavingsPercent > 0 && (
          <span className="absolute top-2 left-2 z-20 bg-red-600 text-white font-extrabold text-[11px] sm:text-xs tracking-wide px-2 py-0.5 rounded shadow-sm pointer-events-none">
            -{priceDetails.totalSavingsPercent.toFixed(0)}%
          </span>
        )}

        {/* Floating Wishlist Button */}
        <button
          type="button"
          onClick={toggleWishlist}
          aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute top-2 right-2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/95 backdrop-blur-md border border-gray-200/80 shadow-xs flex items-center justify-center text-gray-500 hover:text-rose-600 hover:bg-white hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
        >
          <Heart
            className={`w-5 h-5 transition-colors duration-200 ${isInWishlist ? "fill-rose-500 text-rose-500" : "text-gray-600"
              }`}
          />
        </button>

        {/* "Choose Options" Button - hidden on mobile view, visible on desktop hover */}
        <div className="hidden sm:block absolute bottom-3 left-1/2 -translate-x-1/2 z-20 w-fit pointer-events-auto opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <ProductQuickViewDialog product={product} currentVariant={selectedVariant} url={url}>
            <button
              type="button"
              className="relative overflow-hidden rounded-full bg-white text-black shadow-lg transition-colors duration-300 group/btn hover:text-white cursor-pointer px-6 py-2 sm:px-6 sm:py-2.5 whitespace-nowrap active:scale-95"
            >
              {/* Smooth Left-to-Right background sweep */}
              <span className="absolute inset-0 bg-black -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-300 ease-out z-0 pointer-events-none" />
              <span className="relative z-10 text-xs sm:text-sm font-bold tracking-wide pointer-events-none">
                Choose Options
              </span>
            </button>
          </ProductQuickViewDialog>
        </div>

        {/* Full Height Edge-to-Edge Image Display */}
        <Link href={productUrl} className="block w-full h-full">
          {StringifyImages.length > 1 ? (
            <Swiper
              style={
                {
                  "--swiper-pagination-color": "#ffffff",
                  "--swiper-pagination-bullet-inactive-color": "#ffffff",
                  "--swiper-pagination-bullet-inactive-opacity": "0.5",
                  "--swiper-pagination-bullet-size": "4.5px",
                  "--swiper-pagination-bullet-horizontal-gap": "3px",
                } as React.CSSProperties & Record<string, string>
              }
              pagination={{
                dynamicBullets: true,
              }}
              modules={[Pagination]}
              className="w-full h-full [&_.swiper-pagination]:!bottom-2 [&_.swiper-pagination-bullet]:!drop-shadow"
            >
              {StringifyImages.map((image, index: number) => (
                <SwiperSlide key={index} className="w-full h-full relative overflow-hidden">
                  <img
                    src={getCloudflareImageUrl(image?.image_url)}
                    alt={`${image.name || product?.name || "Product"} - Markline`}
                    className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${index === 0 && secondaryImgUrl ? "sm:group-hover:opacity-0 transition-opacity duration-500" : ""
                      }`}
                    loading="lazy"
                  />
                  {index === 0 && secondaryImgUrl && (
                    <img
                      src={secondaryImgUrl}
                      alt={`${product?.name || "Product"} - Markline`}
                      className="hidden sm:block absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out pointer-events-none"
                      loading="lazy"
                    />
                  )}
                </SwiperSlide>
              ))}
            </Swiper>
          ) : primaryImgUrl ? (
            <div className="w-full h-full relative overflow-hidden">
              <img
                src={primaryImgUrl}
                alt={`${product?.name || "Product"} - Markline`}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 bg-gray-100">
              No Image
            </div>
          )}
        </Link>
      </div>

      {/* 2. Product Details */}
      <div className="flex flex-col flex-grow justify-between pt-2 px-1 sm:px-1.5 gap-.8 lg:gap-1.5">
        {/* Category & Color Swatches Row */}
        <div className="flex items-center justify-between gap-1.5 min-h-[18px]">
          <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-gray-500 truncate">
            {product?.gender || "Footwear"}
          </span>

          {allColors.length > 0 && (
            <div
              className="flex items-center gap-1.5 shrink-0"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              {allColors.slice(0, 4).map((color, idx) => (
                <button
                  key={color.name || idx}
                  type="button"
                  title={color.name}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleColorChange(color);
                  }}
                  className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border border-gray-300 transition-all cursor-pointer ${selectedColor?.name === color.name
                    ? "ring-2 ring-gray-950 ring-offset-1 scale-110"
                    : "hover:scale-105"
                    }`}
                  style={{ backgroundColor: color.hex }}
                />
              ))}
              {allColors.length > 4 && (
                <span className="text-[10px] text-gray-500 font-medium">
                  +{allColors.length - 4}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Title */}
        <Link href={productUrl} className="block group/title">
          <h3 className="text-[11px] sm:text-sm lg:text-base font-semibold text-gray-900 group-hover/title:text-black line-clamp-2 leading-snug tracking-tight transition-colors pt-.5">
            {product?.name}
          </h3>
        </Link>

        {/* Highlighted Price & Bold Discount */}
        <div className="flex items-center justify-between gap-2 pt-0.5">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-lg sm:text-xl font-black text-gray-950 tracking-tight">
              ₹{priceDetails.finalPrice.toLocaleString("en-IN")}
            </span>
            {priceDetails.totalSavingsPercent > 0 && (
              <>
                <span className="text-xs md:text-sm text-gray-400 line-through font-normal">
                  ₹{priceDetails.mrp.toLocaleString("en-IN")}
                </span>
                <span className="text-xs md:text-sm font-extrabold text-red-600 tracking-tight">
                  ({priceDetails.totalSavingsPercent.toFixed(0)}% OFF)
                </span>
              </>
            )}
          </div>

          {/* Commented out add button per user request */}
          {/* 
            <AddToCardPopver
              selectedColors={selectedColor}
              currentVariant={selectedVariant}
              currentProduct={product}
              onVariantChange={(variant) => setSelectedVariant(variant)}
            >
              <button
                type="button"
                aria-label="Quick Add"
                onClick={(e) => e.stopPropagation()}
                className="text-sm font-semibold px-3.5 py-1.5 rounded-lg bg-black text-white transition-colors duration-200 flex items-center gap-1 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </AddToCardPopver>
            */}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
