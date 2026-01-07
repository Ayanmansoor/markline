"use client";
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
      const parsedImages: Images[] = Array.isArray(selectedVariant.image_url)
        ? selectedVariant.image_url.map((item: string) => JSON.parse(item))
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

  function addTowishlistproduct(
    selectedColor: Colors[],
    selectedSize: Sizes[]
  ) {
    if (!selectedVariant.image_url) {
      // addToWishlist({ name: product.name, productId: product.id, price: product.product_variants.price, quantity: 1, color: selectedColor, size: selectedSize, image_urls: StringifyImages, discounts: product.discounts, discount_key: product.discount_key ,slug:product.slug })
    }
  }

  const { allColors, allSizes } = useMemo(() => {
    const colorMap = new Map<string, Colors>();
    const sizeMap = new Map<string, Sizes>();
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
            typeof item === "string" ? JSON.parse(item) : item
          )
          : typeof variant.colors === "string"
            ? JSON.parse(variant.colors)
            : [];
        return variantColors.some((c) => c.name === color.name);
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
                  className="w-full realtive h-full relative border overflow-hidden"
                  key={index}
                >
                  <img
                    src={`${image?.image_url}` || ""}
                    alt={`${image.name} - markline `}
                    className={`w-full   transition-all duration-100 ease-in-out object-contain sm:object-cover hover:scale-[1.010]  ${className
                      ? className
                      : " h-[260px] sm:h-[300px] md:h-[250px] lg:h-[350px] xl:h-[400px]"
                      } `}
                    height={200}
                    width={300}
                    loading="lazy"
                  />
                </SwiperSlide>
              ))}
          </Swiper>
          {selectedVariant?.discounts?.discount_persent && (
            <p className=" text-[8px] md:text-xs font-bold text-green-600 absolute top-2 z-10 left-2 md:left-3 bg-green-100 w-fit px-1.5 sm:px-2 py-0.5 rounded-full mt-1">
              {selectedVariant?.discounts?.discount_persent}% OFF
            </p>
          )}
        </Link>
        {/* <button className="absolute top-3 right-3 bg-gray-200 border border-gray-200 p-1 md:p-2  rounded-full z-20">
          <FaHeart
            className={` text-[10px] sm:text-[16px] md:text-[20px] flex items-center    text-black justify-center cursor-pointer group group-hover:text-red-500  ${isInWhishlist && "text-red-500"
              }  `}
            onClick={() => addTowishlistproduct(Stringifycolor, StringifySize)}
          />
        </button> */}
      </span>

      <Link
        href={`/${url}/${product?.slug}`}
        className="flex w-full items-start pt-2 justify-start min-h-[50px]   gap-0 "
      >
        <h2 className=" text-[11px] md:text-sm  xl:text-base 2xl:text-base font-medium !line-clamp-2 md:!line-clamp-3   flex items-center gap-1 uppercase   text-black">
          {product?.name}
        </h2>
      </Link>
      <div className="flex items-center w-full relative h-auto gap-2 md:py-2 py-0 pt-0 md:pt-3 justify-between">

        <div className="w-fit flex gap-2">
          {allColors?.slice(0, 3).map((color, index) => (
            <span
              key={index}
              onClick={() => handleColorChange(color)}
              className={` h-[20px] md:h-[30px] w-[20px] md:w-[30px] rounded-full border-2 p-1  cursor-pointer  ${selectedColor?.name == color.name
                ? "border-gray-700"
                : "border-gray-300"
                }`}
              style={{
                backgroundColor: color.hex,
              }}
            />
          ))}
        </div>
        {selectedVariant?.discounts?.discount_persent && (
          <div className=" flex items-center lg:flex-row flex-col justify-center gap-1 md:gap-2">
            <p className="text-base w-fit md:text-sm  xl:text-xl  font-medium  !line-clamp-3   flex items-center gap-1 uppercase  text-black">
              ₹
              {(() => {
                const price = selectedVariant?.price || 0;
                const discount =
                  selectedVariant?.discounts?.discount_persent || 0;
                const discountAmount = Math.round((price * discount) / 100);
                return price - discountAmount;
              })()}
            </p>
            <p className="  font-normal text-red-500  line-through text-nowrap flex w-fit text-xs lg:text-sm  xl:text-base ">
              ₹ {selectedVariant?.price}
            </p>
          </div>
        )}
        {!selectedVariant?.discounts && (

            <p className=" text-base md:text-sm   xl:text-xl  font-medium  w-auto !line-clamp-3  text-nowrap flex  justify-center items-center gap-1 uppercase  text-black">
              ₹ {selectedVariant?.price}
            </p>
        )}
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
