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


function AddToCardPopver({ children, currentProduct, addToWhishlistCB, currentVariant, onVariantChange }: newAddToCardPopverProps) {
    const { addToCart, isInCart } = useCartContext();
    const [parsedSizes, setParsedSizes] = useState<Sizes[]>([]);
    const [parsedImages, setParsedImages] = useState<Images[]>([]);
    const [selectedColor, setSelectedColor] = useState<Colors | null>(null);
    const [selectedSize, setSelectedSize] = useState<Sizes | null>(null);
    const [isItemSelected, setItemSelected] = useState(false)
    const [quantity, setQuantity] = useState<number>(1);

    const allColors: Colors[] = useMemo(() => {
        const colorMap = new Map<string, Colors>();

        currentProduct?.product_variants.forEach((variant) => {
            let colorArray: Colors[] = [];

            try {
                if (Array.isArray(variant.colors)) {
                    colorArray = variant.colors.map((item) =>
                        typeof item === 'string' ? JSON.parse(item) : item
                    );
                } else if (typeof variant.colors === 'string') {
                    const parsed = JSON.parse(variant.colors);
                    colorArray = Array.isArray(parsed) ? parsed : [parsed];
                }
            } catch (error) {
                console.error('Failed to parse colors from variant:', error);
            }

            colorArray.forEach((color) => {
                if (!colorMap.has(color.name)) {
                    colorMap.set(color.name, color);
                }
            });
        });

        return Array.from(colorMap.values());
    }, [currentProduct,]);

    useEffect(() => {
        try {

            const colors: Colors[] = Array.isArray(currentVariant.colors)
                ? currentVariant.colors.map((item: string) => JSON.parse(item))
                : [];

            const sizes: Sizes[] = Array.isArray(currentVariant.sizes)
                ? currentVariant.sizes.map((item: string) => JSON.parse(item))
                : [];

            const parsedImages: Images[] = Array.isArray(currentVariant.image_url)
                ? currentVariant.image_url.map((item: string) => JSON.parse(item))
                : [];



            setParsedSizes(sizes);
            setParsedImages(parsedImages);
            setSelectedColor(colors?.[0] || null);
            setSelectedSize(sizes?.[0] || null);
            const isExist = isInCart({ variantId: currentVariant?.id, colorName: colors[0]?.name, size: sizes[0]?.size })
            setItemSelected(isExist)
        } catch (e) {
            console.error('Failed to parse variant data:', e);
        }
    }, [currentVariant, isItemSelected]);
    const handleColorChange = (color: Colors) => {
        setSelectedColor(color);

        const matchedVariant = currentProduct.product_variants.find((variant) => {
            try {
                const variantColors: Colors[] = Array.isArray(variant.colors)
                    ? variant.colors.map((item) =>
                        typeof item === 'string' ? JSON.parse(item) : item
                    )
                    : typeof variant.colors === 'string'
                        ? JSON.parse(variant.colors)
                        : [];
                return variantColors.some((c) => c.name === color.name);
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
    };

    const handleAddToCart = () => {
        if (!selectedColor || !selectedSize) {
            toast.error('Please select color and size');
            return;
        }

        const cartItem = {
            productId: currentProduct.id,
            productName: currentProduct.name,
            slug: currentProduct.slug,
            gender: currentProduct.gender,
            quantity,
            variant: {
                id: currentVariant.id,
                sku: currentVariant.sku,
                price: currentVariant.price,
                stock: currentVariant.stock,
                image_url: parsedImages,
                is_active: currentVariant.is_active,
                products_id: currentVariant.products_id,
                discount_key: currentVariant.discount_key,
                discounts: currentVariant.discounts,
                selectedColor,
                selectedSize,
            },
        };
        addToCart(cartItem);
        toast.success('Added to cart!');
    };

    return (
        <Popover >
            <PopoverTrigger className='w-full relative hover:bg-primary hover:text-white h-full'>{children}</PopoverTrigger>
            <PopoverContent className="flex flex-col gap-2 w-full max-w-[300px] relative h-auto">
                <section className="w-full h-auto flex flex-col gap-4">
                    {/* Colors Section */}

                    {/* Color Selection */}
                    <div>
                        <h4 className="text-sm font-semibold mb-1">Color</h4>
                        <div className="flex gap-2 flex-wrap">
                            {allColors.map((color) => (
                                <span
                                    key={color.name}
                                    onClick={() => handleColorChange(color)}
                                    className={cn(
                                        'p-1 rounded-full border-2  ',
                                        selectedColor?.name === color.name ? 'border-black' : 'border-transparent'
                                    )}>
                                    <button
                                        className={`p-5 rounded-full`}
                                        style={{ backgroundColor: color.hex }}
                                    />
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Size Selection */}
                    <div>
                        <h4 className="text-sm font-semibold mb-1">Size</h4>
                        <div className="flex gap-2 flex-wrap">
                            {parsedSizes.map((size) => (
                                <button
                                    key={size.size}
                                    onClick={() => handleSizeChange(size)}
                                    className={cn(
                                        'px-3 py-1 border rounded',
                                        selectedSize?.size === size.size ? 'border-black' : 'border-gray-300'
                                    )}
                                >
                                    {size.size} {size.unit}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 w-full">
                        <label htmlFor="quantity" className="text-primary font-medium text-sm">
                            Quantity
                        </label>
                        <select
                            id="quantity"
                            className="w-full border text-sm h-[30px] px-2"
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                        >
                            {[1, 2, 3, 4, 5].map((qty) => (
                                <option key={qty} value={qty}>
                                    {qty}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                        disabled={!selectedColor || !selectedSize}

                        className="w-full py-2 text-sm font-medium border border-transparent bg-primary text-white hover:bg-white hover:text-primary hover:border-primary transition-all"
                        onClick={handleAddToCart}
                    >
                        {isItemSelected ? "Added" : "Add To Cart"}
                    </button>
                </section>
            </PopoverContent>
        </Popover>

    )
}

export default AddToCardPopver


