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
import { RotateCcw, Shield, Truck, ExternalLink } from 'lucide-react';
import { HiMiniMinusSmall } from 'react-icons/hi2';
import CustomReview from '../Common/CustomReview';
import { SizeChartModal } from '../Common/SizeChartModal';
import WhatsAppButton from '../Common/WhatsAppButton';
import ProductReviews from './ProductReviews';

import { usePathname } from 'next/navigation';
import { calculateVariantPrice } from '@/lib/pricing';
import { safeJsonParse } from '@/lib/utils';
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

    const priceDetails = useMemo(() => {
        return calculateVariantPrice(variant || {}, variant?.discounts);
    }, [variant]);

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

        product?.product_variants?.forEach((v) => {
            if (Array.isArray(v.image_url)) {
                v.image_url.forEach((i: any) => {
                    try {
                        const parsed = typeof i === "string" ? safeJsonParse(i) : i;
                        if (parsed) allImages.push(parsed);
                    } catch { }
                });
            }
        });

        // ✅ now map colors to images globally
        product?.product_variants?.forEach((v) => {
            const colors: Colors[] = Array.isArray(v.colors)
                ? v.colors.map((c: any) =>
                    typeof c === "string" ? safeJsonParse(c) : c
                ).filter(Boolean)
                : [];

            colors.forEach((color: any) => {
                if (!color?.name || colorMap.has(color.name)) return;

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
            ? variant.image_url.map((i: any) => (typeof i === 'string' ? safeJsonParse(i) : i)).filter(Boolean)
            : [];
        const sizes: Sizes[] = Array.isArray(variant?.sizes)
            ? variant.sizes.map((s: any) => (typeof s === 'string' ? safeJsonParse(s) : s)).filter(Boolean)
            : [];

        /* set state */
        setParsedImages(imgs);
        setParsedSizes(sizes);
        console.log(sizes, "tisljsdlkj")
        setSelectedColor(() => {
            // take the first colour attached to this variant for initial display
            if (Array.isArray(variant?.colors) && variant?.colors.length) {
                return typeof variant.colors[0] === 'string' ? safeJsonParse(variant.colors[0]) : variant.colors[0];
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
                ? v.colors.map((x: any) => (typeof x === 'string' ? safeJsonParse(x) : x)).filter(Boolean)
                : typeof v.colors === 'string'
                    ? (safeJsonParse(v.colors) || [])
                    : [];
            return variantColors.some((vc: Colors) => vc?.name === c.name);
        });

        if (matched) onVariantChange?.(matched);
    };

    /* ---------- all unique sizes across variants --------- */
    const displaySizes = useMemo(() => {
        const sizeMap = new Map<string, Sizes>();
        product?.product_variants?.forEach((v) => {
            const sizes: Sizes[] = Array.isArray(v.sizes)
                ? v.sizes.map((s: any) => (typeof s === 'string' ? safeJsonParse(s) : s)).filter(Boolean)
                : typeof v.sizes === 'string'
                    ? (safeJsonParse(v.sizes) || [])
                    : [];
            sizes.forEach((s) => {
                if (s && s.size) {
                    const key = `${s.size}-${s.unit || 'UK'}`;
                    if (!sizeMap.has(key)) {
                        sizeMap.set(key, { size: String(s.size), unit: s.unit || 'UK' });
                    }
                }
            });
        });

        const list = Array.from(sizeMap.values());
        if (list.length > 0) return list;

        return [
            { size: "6", unit: "UK" },
            { size: "7", unit: "UK" },
            { size: "8", unit: "UK" },
            { size: "9", unit: "UK" },
            { size: "10", unit: "UK" },
        ];
    }, [product]);

    /* ---------- get variant info (price & discount) for a specific size ---------- */
    const getSizeVariantInfo = (sizeObj: Sizes) => {
        let matchedVariant = product?.product_variants?.find((v) => {
            const vColors: Colors[] = Array.isArray(v.colors)
                ? v.colors.map((c: any) => (typeof c === 'string' ? safeJsonParse(c) : c)).filter(Boolean)
                : typeof v.colors === 'string' ? (safeJsonParse(v.colors) || []) : [];
            const vSizes: Sizes[] = Array.isArray(v.sizes)
                ? v.sizes.map((s: any) => (typeof s === 'string' ? safeJsonParse(s) : s)).filter(Boolean)
                : typeof v.sizes === 'string' ? (safeJsonParse(v.sizes) || []) : [];

            const colorMatch = selectedColor
                ? vColors.some((c) => c.name?.toLowerCase() === selectedColor.name?.toLowerCase())
                : true;
            const sizeMatch = vSizes.some((s) => String(s.size) === String(sizeObj.size));

            return colorMatch && sizeMatch;
        });

        if (!matchedVariant) {
            matchedVariant = product?.product_variants?.find((v) => {
                const vSizes: Sizes[] = Array.isArray(v.sizes)
                    ? v.sizes.map((s: any) => (typeof s === 'string' ? safeJsonParse(s) : s)).filter(Boolean)
                    : typeof v.sizes === 'string' ? (safeJsonParse(v.sizes) || []) : [];
                return vSizes.some((s) => String(s.size) === String(sizeObj.size));
            });
        }

        const targetVariant = matchedVariant || variant;

        if (!targetVariant) {
            return { price: 0, discountedPrice: 0, hasDiscount: false, variant: null };
        }

        const details = calculateVariantPrice(targetVariant, targetVariant.discounts);

        return {
            price: details.mrp,
            retailPrice: details.retailPrice,
            discountedPrice: details.finalPrice,
            discountPercent: targetVariant.discounts?.discount_persent || 0,
            hasDiscount: details.totalSavings > 0,
            variant: targetVariant
        };
    };

    /* ---------- size click handler ---------- */
    const handleSizeClick = (s: Sizes) => {
        setSelectedSize(s);
        const info = getSizeVariantInfo(s);
        if (info.variant && info.variant.id !== variant?.id) {
            onVariantChange?.(info.variant);
        }
    };

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

    const isSizeAvailable = (sizeObj: Sizes) => {
        if (selectedColor) {
            const colorVariants = product?.product_variants?.filter((v) => {
                const vColors: Colors[] = Array.isArray(v.colors)
                    ? v.colors.map((c: any) => (typeof c === 'string' ? safeJsonParse(c) : c)).filter(Boolean)
                    : typeof v.colors === 'string' ? (safeJsonParse(v.colors) || []) : [];
                return vColors.some((c) => c.name?.toLowerCase() === selectedColor.name?.toLowerCase());
            });

            if (colorVariants && colorVariants.length > 0) {
                return colorVariants.some((v) => {
                    const vSizes: Sizes[] = Array.isArray(v.sizes)
                        ? v.sizes.map((s: any) => (typeof s === 'string' ? safeJsonParse(s) : s)).filter(Boolean)
                        : typeof v.sizes === 'string' ? (safeJsonParse(v.sizes) || []) : [];
                    return vSizes.some((s) => String(s.size) === String(sizeObj.size));
                });
            }
        }

        return parsedSizes.some(
            (item) => String(item.size) === String(sizeObj.size)
        );
    };
    return (
        <>
            <div className=' flex items-start gap-2 md:gap-3  h-fit relative md:sticky md:top-14  flex-col w-full md:w-[35%] py-5 md:pl-5  lg:pl-10 '>

                <div className='flex items-start justify-between flex-col border-b border-gray-200 pb-2  w-full relative '>
                    <p className=' text-xs  sm:text-sm font-medium text-start gap-1  '>{product?.gender}</p>
                    <div className='flex flex-col gap-1 w-full relative'>
                        <h1 className=' text-lg md:text-xl  lg:text-2xl xl:text-3xl font-bold   uppercase' aria-label={product?.name} >{product?.name}</h1>
                    </div>

                    <div className='flex flex-col gap-1.5 w-full relative py-2 md:py-3'>
                        {/* Final Price and combined saving badge */}
                        <div className='flex items-baseline gap-2.5 flex-wrap'>
                            <span className='text-3xl lg:text-4xl font-extrabold text-black tracking-tight'>
                                ₹ {priceDetails.finalPrice.toLocaleString('en-IN')}
                            </span>
                            {priceDetails.totalSavingsPercent > 0 && (
                                <span className='text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full uppercase tracking-wider'>
                                    Save {priceDetails.totalSavingsPercent.toFixed(0)}%
                                </span>
                            )}
                        </div>

                        {/* MRP and Retail Price details */}
                        <div className='flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-medium text-gray-500 mt-1'>
                            {priceDetails.mrp > 0 && (
                                <p>
                                    MRP: <span className='line-through text-gray-400'>₹ {priceDetails.mrp.toLocaleString('en-IN')}</span>
                                </p>
                            )}
                            
                            {priceDetails.baseDiscount > 0 && (
                                <p>
                                    Retail Price: <span>₹ {priceDetails.retailPrice.toLocaleString('en-IN')}</span>
                                </p>
                            )}

                            {priceDetails.promoDiscount > 0 && (
                                <p className='text-red-500 font-semibold'>
                                    Promo: -₹ {priceDetails.promoDiscount.toLocaleString('en-IN')} ({variant?.discounts?.discount_persent}% OFF)
                                </p>
                            )}
                        </div>

                        {priceDetails.totalSavings > 0 && (
                            <p className='text-xs font-bold text-green-600 mt-0.5'>
                                Total Savings: ₹ {priceDetails.totalSavings.toLocaleString('en-IN')} on MRP
                            </p>
                        )}
                    </div>
                </div>

                <div className='flex items-center   relative flex-col gap-2 w-full  border-b border-gray-200 pb-3'>

                    <p className='text-sm  md:text-base text-gray-900 font-semibold flex items-center  justify-between w-full'>More Color :
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
                {displaySizes?.length > 0 && (
                    <div className='w-full flex flex-col gap-2.5 my-2 border-b border-gray-200 pb-4'>
                        <div className='flex items-center justify-between w-full'>
                            <p className='text-sm md:text-base font-normal text-gray-900'>
                                Size: <span className='font-bold text-black'>{selectedSize ? `${selectedSize.size} ${selectedSize.unit || 'UK'}` : ''}</span>
                            </p>
                            <SizeChartModal />
                        </div>

                        <div className='grid grid-cols-3 sm:grid-cols-3 gap-2.5 w-full'>
                            {displaySizes.map((item, index) => {
                                const available = isSizeAvailable(item);
                                const isSelected = selectedSize?.size === item.size;
                                const sizeVariantInfo = getSizeVariantInfo(item);

                                const formattedPrice = sizeVariantInfo.discountedPrice
                                    ? `₹${Number(sizeVariantInfo.discountedPrice).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                    : null;

                                const formattedOriginalPrice = (sizeVariantInfo.hasDiscount && sizeVariantInfo.price)
                                    ? `₹${Number(sizeVariantInfo.price).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                    : null;

                                return (
                                    <div
                                        key={index}
                                        onClick={() => available && handleSizeClick(item)}
                                        className={`
                                            relative rounded-xl overflow-hidden border transition-all duration-200 select-none
                                            ${available ? "cursor-pointer" : "cursor-not-allowed opacity-50 bg-gray-50/60"}
                                            ${isSelected
                                                ? "border-[2px] border-[#1d5bd8] shadow-xs"
                                                : "border-gray-300 hover:border-gray-400 bg-white"
                                            }
                                        `}
                                    >
                                        {/* Top Size Header */}
                                        <div className={`px-3 py-1.5 md:py-2 text-left font-bold text-sm md:text-base ${
                                            isSelected ? "bg-[#eef5ff] text-slate-900" : "bg-white text-slate-900"
                                        }`}>
                                            {item.size} {item.unit || 'UK'}
                                        </div>

                                        {/* Divider */}
                                        <div className={`border-b ${isSelected ? "border-blue-200" : "border-gray-200"}`} />

                                        {/* Bottom Price Container */}
                                        <div className="px-3 py-1.5 md:py-2 text-left flex flex-col justify-center bg-white">
                                            {formattedPrice && (
                                                <span className="font-semibold text-xs md:text-sm text-slate-900 leading-tight">
                                                    {formattedPrice}
                                                </span>
                                            )}
                                            {formattedOriginalPrice && (
                                                <span className="line-through text-gray-400 text-[10px] md:text-xs font-normal leading-tight mt-0.5">
                                                    {formattedOriginalPrice}
                                                </span>
                                            )}
                                        </div>

                                        {/* Not available diagonal strikethrough */}
                                        {!available && (
                                            <span className="absolute inset-0 pointer-events-none overflow-hidden">
                                                <span className="absolute top-1/2 left-[-20%] w-[140%] h-[1px] bg-gray-400/70 rotate-[-25deg]" />
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
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

                {/* Marketplace Availability (Amazon & Flipkart) */}
                {(product?.amazon_url || product?.flipkart_url) && (
                    <div className='w-full my-3 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-amber-50/50 via-white to-slate-50 border border-amber-200/80 shadow-xs flex flex-col gap-2.5'>
                        <div className='flex items-center justify-between flex-wrap gap-2'>
                            <span className='text-xs font-bold text-slate-900 tracking-wide flex items-center gap-1.5'>
                                <span className='w-2 h-2 rounded-full bg-emerald-500 animate-pulse' />
                                Also Available On Marketplaces
                            </span>
                            <span className='text-xs font-bold text-emerald-700 bg-emerald-100/90 px-2.5 py-0.5 rounded-full border border-emerald-200 shadow-2xs'>
                                Marketplace has cheaper price, buy from there
                            </span>
                        </div>

                        <div className={`grid ${product.amazon_url && product.flipkart_url ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'} gap-2.5`}>
                            {product.amazon_url && (
                                <a
                                    href={product.amazon_url}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='group relative flex items-center justify-between px-3.5 py-2.5 bg-white border border-slate-200 hover:border-amber-500 rounded-xl shadow-xs hover:shadow-md transition-all duration-300 active:scale-95'
                                >
                                    <div className='flex items-center gap-2.5'>
                                        <img
                                            src='/amazon.png'
                                            alt='Amazon'
                                            className='h-7 w-auto max-w-[36px] object-contain rounded'
                                        />
                                        <div className='text-left'>
                                            <span className='block text-lg font-bold text-slate-900 leading-tight'>Amazon</span>
                                            <span className='block text-sm text-slate-500 font-medium'>
                                                Buy from Amazon
                                            </span>
                                        </div>
                                    </div>
                                    <ExternalLink className='w-5 h-5 text-slate-400 group-hover:text-amber-600 transition-colors' />
                                </a>
                            )}

                            {product.flipkart_url && (
                                <a
                                    href={product.flipkart_url}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='group relative flex items-center justify-between px-3.5 py-2.5 bg-white border border-slate-200 hover:border-blue-500 rounded-xl shadow-xs hover:shadow-md transition-all duration-300 active:scale-95'
                                >
                                    <div className='flex items-center gap-2.5'>
                                        <img
                                            src='/flipkart.png'
                                            alt='Flipkart'
                                            className='h-7 w-auto max-w-[36px] object-contain rounded'
                                        />
                                        <div className='text-left'>
                                            <span className='block text-lg font-bold text-slate-900 leading-tight'>Flipkart</span>
                                            <span className='block text-sm text-slate-500 font-medium'>
                                                Buy from Flipkart
                                            </span>
                                        </div>
                                    </div>
                                    <ExternalLink className='w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors' />
                                </a>
                            )}
                        </div>
                    </div>
                )}

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
