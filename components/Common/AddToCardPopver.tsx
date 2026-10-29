'use client'
import React, { useEffect, useMemo, useState } from 'react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from '@/lib/utils';

import { AddToCardPopverProps, Colors, Images, newAddToCardPopverProps, Sizes } from '@/types/interfaces';
import { Colors as colorProps, Sizes as sizeProps } from '@/types/interfaces';
import { useCartContext } from '@/Contexts/Cart.context';
import { useWishlists } from '@/Contexts/wishlist';
import { toast } from 'sonner';
import { usePathname } from 'next/navigation';
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


function AddToCardPopver({ children, currentProduct, addToWhishlistCB, currentVariant, onVariantChange, selectedColors }: newAddToCardPopverProps) {
    const { addToCart, isInCart, cart } = useCartContext();
    const [parsedSizes, setParsedSizes] = useState<Sizes[]>([]);
    const [parsedImages, setParsedImages] = useState<Images[]>([]);
    const [selectedColor, setSelectedColor] = useState<Colors>();
    const [selectedSize, setSelectedSize] = useState<Sizes>();
    const [isItemSelected, setItemSelected] = useState(false)
    // const [quantity, setQuantity] = useState<number>(1);
    const pathname = usePathname();

    const [issomething, setSomeThingchange] = useState(false)

    const allColors: Colors[] = useMemo(() => {
        const colorMap = new Map<string, Colors>();

        currentProduct?.product_variants?.forEach((variant) => {
            let colorArray: Colors[] = [];

            try {
                if (Array.isArray(variant.colors)) {
                    colorArray = variant.colors.map((item) =>
                        typeof item === 'string' ? safeJsonParse(item) : item
                    ).filter(Boolean);
                } else if (typeof variant.colors === 'string') {
                    const parsed = safeJsonParse(variant.colors);
                    colorArray = Array.isArray(parsed) ? parsed : (parsed ? [parsed] : []);
                }
            } catch (error) {
                console.error('Failed to parse colors from variant:', error);
            }

            colorArray.forEach((color) => {
                if (color?.name && !colorMap.has(color.name)) {
                    colorMap.set(color.name, color);
                }
            });
        });

        return Array.from(colorMap.values());
    }, [currentProduct,]);

    useEffect(() => {
        try {

            const colors: Colors[] = Array.isArray(currentVariant?.colors)
                ? currentVariant.colors.map((item: any) => typeof item === 'string' ? safeJsonParse(item) : item).filter(Boolean)
                : [];

            const sizes: Sizes[] = Array.isArray(currentVariant?.sizes)
                ? currentVariant.sizes.map((item: any) => typeof item === 'string' ? safeJsonParse(item) : item).filter(Boolean)
                : [];

            const parsedImages: Images[] = Array.isArray(currentVariant?.image_url)
                ? currentVariant.image_url.map((item: any) => typeof item === 'string' ? safeJsonParse(item) : item).filter(Boolean)
                : [];

            setParsedSizes(sizes);
            setParsedImages(parsedImages);
            if (colors[0]) setSelectedColor(colors[0]);
            if (sizes[0]) setSelectedSize(sizes[0]);
            const isExist = colors[0] && sizes[0] ? isInCart({ variantId: currentVariant?.id, colorName: colors[0].name, size: sizes[0].size }) : false;

            setItemSelected(isExist)
        } catch (e) {
            console.error('Failed to parse variant data:', e);
        }
    }, [currentVariant, cart]);

    const handleColorChange = (color: Colors) => {
        setSelectedColor(color);

        const matchedVariant = currentProduct?.product_variants?.find((variant) => {
            try {
                const variantColors: Colors[] = Array.isArray(variant.colors)
                    ? variant.colors.map((item) =>
                        typeof item === 'string' ? safeJsonParse(item) : item
                    ).filter(Boolean)
                    : typeof variant.colors === 'string'
                        ? (safeJsonParse(variant.colors) || [])
                        : [];
                return variantColors.some((c) => c?.name === color.name);
            } catch (error) {
                console.error('Error parsing variant colors:', error);
                return false;
            }
        });


        if (matchedVariant) {
            onVariantChange?.(matchedVariant);
        }
    };
    const handleSizeChange = (size: Sizes) => {
        setSelectedSize(size);
        setSomeThingchange((prev) => !prev)
        const isExist = selectedColor
            ? isInCart({ variantId: currentVariant?.id, colorName: selectedColor?.name, size: size.size })
            : false;
        setItemSelected(isExist)



    };

    const handleAddToCart = () => {
        if (!selectedColor || !selectedSize) {
            toast.error('Please select color and size');
            return;
        }

        const cartItem = {
            productId: currentProduct?.id,
            productName: currentProduct?.name || "Product",
            slug: currentProduct?.slug || "",
            gender: currentProduct?.gender || "",
            quantity: 1,
            url: `${pathname}`,
            variant: {
                id: currentVariant?.id,
                sku: currentVariant?.sku || "",
                price: currentVariant?.price || 0,
                stock: currentVariant?.stock || 0,
                image_url: parsedImages,
                is_active: currentVariant?.is_active ?? true,
                products_id: currentVariant?.products_id || currentProduct?.id,
                discount_key: currentVariant?.discount_key,
                discounts: currentVariant?.discounts,
                selectedColor,
                selectedSize,
            },
        };

        addToCart(cartItem);
        setSomeThingchange((prev) => !prev)

        toast.success('Added to cart!');
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                {children}
            </PopoverTrigger>
            <PopoverContent 
                align="end" 
                sideOffset={8}
                className="w-64 p-3.5 bg-white border border-gray-200/90 rounded-2xl shadow-xl z-50 flex flex-col gap-3"
            >
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <span className="text-xs font-bold text-gray-900 tracking-tight">Select Size</span>
                    {selectedColor?.name && (
                        <span className="text-[11px] text-gray-500 font-medium capitalize">Color: {selectedColor.name}</span>
                    )}
                </div>

                {/* Size Selection */}
                <div className="flex flex-col gap-1.5">
                    <div className="flex gap-1.5 flex-wrap">
                        {parsedSizes.length > 0 ? (
                            parsedSizes.map((size) => (
                                <button
                                    key={size.size}
                                    type="button"
                                    onClick={() => handleSizeChange(size)}
                                    className={cn(
                                        'px-2.5 py-1 text-xs font-medium rounded-lg border transition-all cursor-pointer',
                                        selectedSize?.size === size.size 
                                            ? 'border-gray-900 bg-gray-900 text-white shadow-xs' 
                                            : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-400 hover:bg-white'
                                    )}
                                >
                                    {size.size} {size.unit}
                                </button>
                            ))
                        ) : (
                            <span className="text-xs text-gray-500">Standard fit</span>
                        )}
                    </div>
                </div>

                {/* Add to Cart Button */}
                <button
                    disabled={!selectedSize}
                    type="button"
                    className="w-full py-2 text-xs font-semibold rounded-xl bg-gray-950 text-white hover:bg-black transition-all shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    onClick={handleAddToCart}
                >
                    {isItemSelected ? "In Bag ✓" : "Add to Bag"}
                </button>
            </PopoverContent>
        </Popover>
    )
}

export default AddToCardPopver


