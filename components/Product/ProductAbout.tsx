import React, { useEffect, useMemo, useRef, useState } from 'react'

import { PiHeartThin } from "react-icons/pi";
import { CiDiscount1 } from "react-icons/ci";
import { BsCurrencyRupee, BsPlus } from "react-icons/bs";
import { MdKeyboardArrowDown } from "react-icons/md";
import { CiDeliveryTruck } from "react-icons/ci";
import ColorView from '../Common/ColorView';
// import BuyDailog from '@/Comman/BuyDailog';
import BuyDailog from './BuyDailog';
import AddToCardPopver from '../Common/AddToCardPopver';
import { newCartItem, useCartContext } from '@/Contexts/Cart.context';
import { Colors as colorProps, Colors, Images, ProductMainAboutProps, ProductMainProps, ProductsDataProps, ProductVariant, Sizes as sizeProps, Sizes } from '@/types/interfaces';
import { FaHeart } from 'react-icons/fa6';
import { useWishlists } from '@/Contexts/wishlist';
import Razorpay from 'razorpay';
import axios from 'axios';
import LoadRazorpay from '@/utils/loadrazorpay';
import BuyProduct from './BuyProduct';
import { toast } from 'sonner';
import { RotateCcw, Shield, Truck } from 'lucide-react';
import { HiMiniMinusSmall } from 'react-icons/hi2';
import CustomReview from '../Common/CustomReview';
import { SizeChartModal } from '../Common/SizeChartModal';
import WhatsAppButton from '../Common/WhatsAppButton';
import ProductReviews from './ProductReviews';

import { usePathname } from 'next/navigation';
import { getDiscountedPrice } from '@/lib/getDiscountedPrice';
interface productsCart {
    colors: {
        color: colorProps
    },
    sizes: {
        size: sizeProps
    },
    quentitys: {
        quentity: number
    }
}


const allSizes = [
    { size: "35", unit: "EU" },
    { size: "36", unit: "EU" },
    { size: "37", unit: "EU" },
    { size: "38", unit: "EU" },
    { size: "39", unit: "EU" },
    { size: "40", unit: "EU" },
    { size: "41", unit: "EU" },

];
function ProductAbout({ product, variant, onVariantChange }: ProductMainAboutProps) {
    const { addToCart, isInCart, updateQuantity, getCartProduct } = useCartContext();
    const { isProductInWishlist } = useWishlists();
    const pathname = usePathname();
    /* ---------- local state ------------- */
    const [parsedImages, setParsedImages] = useState<Images[]>([]);
    const [parsedSizes, setParsedSizes] = useState<Sizes[]>([]);
    const [selectedColor, setSelectedColor] = useState<Colors | null>(null);
    const [selectedSize, setSelectedSize] = useState<Sizes | null>(null);
    const [qty, setQty] = useState(1);

    /* ---------- all unique colours from every variant --------- */
    // const allColors = useMemo(() => {
    //     const colorMap = new Map<string, { color: Colors; image: Images | null }>();

    //     product?.product_variants.forEach(v => {
    //         const colors: Colors[] = Array.isArray(v.colors)
    //             ? v.colors.map((c: any) => (typeof c === 'string' ? JSON.parse(c) : c))
    //             : typeof v.colors === 'string'
    //                 ? JSON.parse(v.colors)
    //                 : [];

    //         const images: Images[] = Array.isArray(v.image_url)
    //             ? v.image_url.map((i: any) => (typeof i === 'string' ? JSON.parse(i) : i))
    //             : [];

    //         colors.forEach((c: Colors) => {
    //             if (!colorMap.has(c.name)) {
    //                 colorMap.set(c.name, {
    //                     color: c,
    //                     image: images[0] ?? null, // take the first image of this variant
    //                 });
    //             }
    //         });
    //     });

    //     return Array.from(colorMap.values());
    // }, [product]);

    const allColors = useMemo(() => {
        const colorMap = new Map<string, { color: Colors; image: Images | null }>();

        // ✅ collect ALL images from ALL variants first
        const allImages: Images[] = [];

        product?.product_variants.forEach((v) => {
            if (Array.isArray(v.image_url)) {
                v.image_url.forEach((i: any) => {
                    try {
                        allImages.push(typeof i === "string" ? JSON.parse(i) : i);
                    } catch { }
                });
            }
        });

        // ✅ now map colors to images globally
        product?.product_variants.forEach((v) => {
            const colors: Colors[] = Array.isArray(v.colors)
                ? v.colors.map((c: any) =>
                    typeof c === "string" ? JSON.parse(c) : c
                )
                : [];

            colors.forEach((color: any) => {
                if (colorMap.has(color.name)) return;

                const matchedImage =
                    allImages.find(
                        (img: any) =>
                            img?.color?.toLowerCase() === color.name.toLowerCase()
                    ) ?? null;

                colorMap.set(color.name, {
                    color,
                    image: matchedImage,
                });
            });
        });

        return Array.from(colorMap.values());
    }, [product]);


    /* ---------- whenever current variant changes --------- */
    useEffect(() => {
        /** parse images / sizes for current variant **/
        const imgs: Images[] = Array.isArray(variant?.image_url)
            ? variant.image_url.map((i: any) => (typeof i === 'string' ? JSON.parse(i) : i))
            : [];
        const sizes: Sizes[] = Array.isArray(variant?.sizes)
            ? variant.sizes.map((s: any) => (typeof s === 'string' ? JSON.parse(s) : s))
            : [];

        /* set state */
        setParsedImages(imgs);
        setParsedSizes(sizes);
        console.log(sizes, "tisljsdlkj")
        setSelectedColor(() => {
            // take the first colour attached to this variant for initial display
            if (Array.isArray(variant?.colors) && variant?.colors.length) {
                return typeof variant.colors[0] === 'string' ? JSON.parse(variant.colors[0]) : variant.colors[0];
            }
            return null;
        });
        setSelectedSize(sizes[0] ?? null);
    }, [variant]);

    /* ---------- colour click handler ---------- */
    const handleColourClick = (c: Colors) => {
        setSelectedColor(c);

        const matched = product?.product_variants.find(v => {
            const variantColors = Array.isArray(v.colors)
                ? v.colors.map((x: any) => (typeof x === 'string' ? JSON.parse(x) : x))
                : typeof v.colors === 'string'
                    ? JSON.parse(v.colors)
                    : [];
            return variantColors.some((vc: Colors) => vc.name === c.name);
        });

        if (matched) onVariantChange?.(matched);
    };

    /* ---------- size click handler ---------- */
    const handleSizeClick = (s: Sizes) => setSelectedSize(s);

    /* ---------- add-to-cart ---------- */
    const handleAddToCart = () => {
        if (!selectedColor || !selectedSize) {
            toast.error('Please select colour and size');
            return;
        }

        const cartItem: newCartItem = {
            productId: product?.id,
            productName: product?.name,
            slug: product?.slug,
            gender: product?.gender,
            url: `${pathname}`,
            quantity: qty,
            variant: {
                ...variant,
                image_url: parsedImages,
                selectedColor,
                selectedSize,
            },
        };

        addToCart(cartItem);
        toast.success('Added to cart');
    };
    useEffect(() => {
        if (variant?.id && selectedColor?.name && selectedSize?.size) {
            const existingCartItem = getCartProduct({
                variantId: variant.id,
                colorName: selectedColor.name,
                size: selectedSize.size,
            });

            setQty(existingCartItem ? existingCartItem.quantity : 1);
        }
    }, [variant, selectedColor, selectedSize]);
    function increaseQuantity() {
        if (qty < 5) {
            setQty(prev => prev + 1);

            if (variant?.id && selectedColor?.name && selectedSize?.size &&
                isInCart({ variantId: variant.id, colorName: selectedColor.name, size: selectedSize.size })) {
                updateQuantity({
                    productId: product.id,
                    colorName: selectedColor,
                    size: selectedSize,
                    quantity: qty + 1,
                });
            }
        }
    }
    function decreaseQuantity() {
        if (qty > 1) {
            setQty(prev => prev - 1);

            if (variant?.id && selectedColor?.name && selectedSize?.size &&
                isInCart({ variantId: variant.id, colorName: selectedColor.name, size: selectedSize.size })) {
                updateQuantity({
                    productId: product.id,
                    colorName: selectedColor,
                    size: selectedSize,
                    quantity: qty - 1,
                });
            }
        }
    }

    // console.log(variant, "this is my current varaint i have ")
    const isSizeAvailable = (sizeObj) =>
        parsedSizes.some(
            item => item.size === sizeObj.size && item.unit === sizeObj.unit
        );
    return (
        <>
            <div className=' flex items-start gap-2 md:gap-3  h-fit relative md:sticky md:top-14  flex-col w-full md:w-[35%] py-5 md:pl-5  lg:pl-10 '>

                <div className='flex items-start justify-between flex-col border-b border-gray-200 pb-2  w-full relative '>
                    <p className=' text-xs  sm:text-sm font-medium text-start gap-1  '>{product?.gender}</p>
                    <div className='flex flex-col gap-1 w-full relative'>
                        <h1 className=' text-lg md:text-xl  lg:text-2xl xl:text-3xl font-bold   uppercase' aria-label={product?.name} >{product?.name}</h1>
                    </div>

                    <div className='flex justify-between flex-col xl:flex-row  items-start sm:items-start w-full relative  py-2 md:py-3'>
                        <h2 className=' text-sm md:text-p18 font-normal flex items-center gap-2 '>
                            {
                                variant?.discounts?.discount_persent ?
                                    <>

                                        <p className=' text-xl lg:text-2xl md:text-3xl  font-normal text-red-400 line-through text-nowrap '>₹ {variant?.price}</p>
                                        <p className=' text-2xl lg:text-3xl  xl:text-4xl  font-semibold text-nowrap text-primary px-2 '>

                                            ₹ {getDiscountedPrice(
                                                variant?.price,
                                                variant?.discounts?.discount_persent
                                            )}
                                        </p>
                                        <p className="  font-semibold   py-1  text-red-500   text-nowrap flex w-fit text-base lg:text-lg">
                                            - {variant?.discounts?.discount_persent} % OFF
                                        </p>
                                    </>
                                    :
                                    <p className='text-2xl lg:text-4xl  font-medium text-nowrap text-black'>₹ {variant?.price}</p>

                            }

                        </h2>
                        {/* <p className='text-sm font-normal text-fontPrimary py-3 '>Includes all taxs</p> */}

                    </div>
                </div>



                <SizeChartModal />


                <div className='flex items-center   relative flex-col gap-2 w-full  border-b border-gray-200 pb-3'>

                    <p className='text-sm  md:text-base text-gray-900 font-semibold flex items-center  justify-between w-full'>More Color :
                        {/* 
                        <ColorView colors={[]} images={[]} >
                            <span className='text-[16px]  font-normal  flex items-center gap-1 cursor-pointer '>More Colors  <MdKeyboardArrowDown className='text-[16px]' /></span>
                        </ColorView> */}
                    </p>

                    <section className='w-full flex flex-wrap items-center gap-2'>
                        {allColors.map(({ color, image }, index) => (
                            <section className={` rounded-sm flex-col gap-1 md:gap-2  flex items-center   border border-gray-300  `} key={index}>
                                <div
                                    key={index}
                                    className={`  h-[80px] md:h-[100px] w-[80px] aspect-square md:w-[80px]   overflow-hidden  cursor-pointer 
                             ${selectedColor?.name === color.name ? "border-primary" : "border-gray-300"}`}
                                    onClick={() => handleColourClick(color)}
                                    title={color.name}
                                >
                                    {image?.image_url ? (
                                        <img
                                            src={image.image_url}
                                            alt={color.name}
                                            className="object-cover w-full  h-full"
                                        />
                                    ) : (
                                        <div
                                            style={{ backgroundColor: color.hex }}
                                            className="w-full h-full"
                                        />
                                    )}
                                </div>
                                {/* <p className=' text-sm md:text-base font-medium text-primary line-clamp-2'>{color.name}</p> */}
                            </section>
                        ))}
                    </section>
                </div>



                <div className='flex items-center justify-start'>
                    {
                        variant.stock >= 0 ?
                            <p className='text-base font-semibold text-[#128C7E]'> In Stock </p>
                            :
                            <p className='text-base font-semibold text-gray-800 '> Out Of Stock</p>

                    }
                </div>


                {/* Size section */}
                {parsedSizes?.length > 0 && (
                    <>
                        <p className='text-sm  md:text-base font-medium w-full text-gray-900'>Select Size (UK):</p>
                        <div className='grid grid-cols-7 gap-2 w-full'>
                            {allSizes.map((item, index) => {
                                const available = isSizeAvailable(item);

                                return (
                                    <div
                                        key={index}
                                        onClick={() => available && handleSizeClick(item)}
                                        className={`
                                                relative py-2 text-xs md:text-sm md:py-2  text-center border font-normal
                                                ${available ? "cursor-pointer hover:bg-black hover:text-white" : "cursor-not-allowed opacity-50"}
                                                ${selectedSize?.size === item.size
                                                ? "bg-primary border-transparent text-white"
                                                : "text-primary border-primary bg-transparent"}
                                            `}
                                    >
                                        {item.size}

                                        {!available && (
                                            <span className="absolute inset-0 pointer-events-none">
                                                <span className="absolute top-1/2 left-0 w-full h-[1px] bg-gray-500 rotate-[-45deg]" />
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}

                <div className='w-full fixed bottom-0 px-4 flex-wrap sm:px-0 bg-white sm:bg-transparent py-4 sm:py-0 z-30 grid grid-cols-[1fr_1fr] md:grid-cols-1 lg:grid-cols-2 gap-3 right-0 items-center sm:relative'>
                    {
                        (variant?.id && selectedColor?.name && selectedSize?.size) &&
                            isInCart({ variantId: variant.id, colorName: selectedColor.name, size: selectedSize.size }) ?
                            <div className='flex items-center gap-4 border border-gray-300 py-2 px-2 w-full justify-between rounded-lg bg-gray-50/50 backdrop-blur-sm transition-all duration-300'>
                                <button
                                    className='p-2 hover:bg-white rounded-md transition-colors shadow-sm active:scale-95'
                                    onClick={decreaseQuantity}
                                >
                                    <HiMiniMinusSmall className='text-2xl text-primary' />
                                </button>
                                <span className='text-xl font-bold text-primary tabular-nums'>{qty}</span>
                                <button
                                    className='p-2 hover:bg-white rounded-md transition-colors shadow-sm active:scale-95'
                                    onClick={increaseQuantity}
                                >
                                    <BsPlus className='text-2xl text-primary' />
                                </button>
                            </div>
                            :
                            <button
                                className='w-full text-xs font-black capitalize tracking-[0.2em] bg-white text-black py-4 border-2 border-black hover:bg-black hover:text-white transition-all duration-300 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.05)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed'
                                disabled={!selectedColor || !selectedSize}
                                onClick={handleAddToCart}
                            >
                                Add to Cart
                            </button>
                    }

                    <BuyDailog
                        product={{ ...product, selectedColor: selectedColor, selectedSize: selectedSize, quantity: qty }}
                        selectedVariant={variant}
                    >
                        <button
                            disabled={!(selectedColor?.name && selectedSize?.size)}
                            className='w-full min-w-[140px] bg-black group relative overflow-hidden rounded-xl py-[19px] transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                            {/* Animated Shimmer Overlay */}
                            <div className='absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full' />

                            {/* Subtle Golden Accent Border */}
                            <div className='absolute inset-0 rounded-xl border border-white/5 transition-colors group-hover:border-yellow-500/30' />

                            <div className='relative flex bg-gold-500 items-center justify-center gap-3'>
                                <span className='text-xs font-black uppercase tracking-[0.3em] text-white'>
                                    Buy Now
                                </span>
                                <div className='h-[1px] w-5 bg-yellow-500/80 transition-all duration-300 group-hover:w-8 group-hover:bg-yellow-500' />
                            </div>
                        </button>
                    </BuyDailog>

                    {/* <div className="hidden sm:block lg:col-span-2 mt-2">
                        <WhatsAppButton product={product} variant={variant} />
                    </div> */}
                </div>

                <div className='w-full relative flex items-start flex-col  justify-between'>
                    <p className='  text-sm md:text-base font-medium text-fontPrimary  mt-3 mb-3'>
                        Estd. Dispatch 7 working days
                    </p>

                    <img src="/checkout-image.png" alt="checkout image" height={400} width={400} className="w-full realtive h-auto " />
                </div>

                {/* BENIFITS */}
                {/* <ul className='w-full relative h-auto flex items-start gap-2 flex-col py-4 '>

                    <li className=' text-white bg-primary px-3 py-1 w-full  flex items-start text-xs sm:text-sm lg:text-base font-medium'>
                       Free delevery to all Orders
                    </li>

                    <li className='flex items-center w-full relative gap-1 text-xs sm:text-sm'><CiDiscount1 className='text-[20px]' />
                        Save 5% on all Online Payments under ₹10,000/-
                    </li>
                    <li className='flex items-start w-full relative gap-1 text-xs sm:text-sm'><CiDeliveryTruck className='text-[30px]' />
                        Delivery: Orders are typically delivered within 3-7 business days across India.
                    </li>
                </ul> */}
                <div className="flex flex-col items-start justify-start  gap-4 py-6 border-t w-full  border-gray-200">
                    <div className="text-center  flex items-center justify-start gap-4">
                        <Truck className=" text-[20px] md:text-[25px] mx-auto mb-2 text-gray-500" />
                        <p className=" text-xs sm:text-sm font-semibold sm:font-medium   text-primary">Free Shipping</p>
                    </div>
                    <div className="text-center  flex items-center justify-start gap-4">
                        <Shield className=" text-[20px] md:text-[25px] mx-auto mb-2 text-gray-500" />
                        <p className=" text-xs sm:text-sm font-semibold sm:font-medium    text-primary">Premium Quality</p>
                    </div>
                    <div className="text-center  flex items-center justify-start gap-4">
                        <RotateCcw className=" text-[20px] md:text-[25px] mx-auto mb-2 text-gray-500" />
                        <p className=" text-xs sm:text-sm font-semibold sm:font-medium   text-primary">7-Day Returns</p>
                    </div>
                </div>

                <ProductReviews productId={product.id} productName={product.name} />




            </div>
        </>
    )
}

export default ProductAbout
