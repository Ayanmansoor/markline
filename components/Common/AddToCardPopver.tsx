'use client'
import React, { useEffect, useState } from 'react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { AddToCardPopverProps, Colors, Sizes } from '@/types/interfaces';
import { Colors as colorProps, Sizes as sizeProps } from '@/types/interfaces';
import { useCart } from '@/Contexts/Cart.context';
import { useWishlists } from '@/Contexts/wishlist';

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


function AddToCardPopver({ children, currentProduct, colors, sizes , setIsInWhicshlist }: AddToCardPopverProps) {
    const [productcart, setProductcart] = useState<productsCart>({
        colors: {
            color:
                { name: 'Ivory', hex: '#FFFFF0' }
        },
        sizes: {
            size:
                { size: '38', unit: 'EU' }
        },
        quentitys: {
            quentity: 1
        }
    })
    const {isProductInWishlist}=useWishlists()
    const { addToCart, getCartProduct } = useCart();

    // useEffect(() => {
    //     // clearCart()
    //     const data = getCartProduct(currentProduct.id)
    //     setProductcart(
    //         (prev: any) => ({
    //             ...prev,
    //             colors: {
    //                 ...prev?.colors,
    //                 color: data?.color
    //             },
    //             sizes: {
    //                 ...prev?.sizes,
    //                 size: data?.size
    //             }
    //         })
    //     )

    // }, [currentProduct.id, getCartProduct])

    useEffect(() => {

        if (!currentProduct?.colors || !currentProduct?.sizes) return;
        const parsedColors: Colors[] = currentProduct.colors.map((item: any) =>
            typeof item === "string" ? JSON.parse(item) : item
        );
        const parsedSizes: Sizes[] = currentProduct.sizes.map((size: any) =>
            typeof size === "string" ? JSON.parse(size) : size
        );

        if (parsedColors.length > 0 && parsedSizes.length > 0) {
            setProductcart((prev) => ({
                ...prev,
                colors: {
                    color: parsedColors[0],
                },
                sizes: {
                    size: parsedSizes[0],
                },
            }));

            // const ispresent=isProductInWishlist(currentProduct.id,parsedColors[0].name,parsedSizes[0].size)
            // setIsInWhicshlist((prev)=>ispresent)
        }


    }, [currentProduct,setIsInWhicshlist]);


    


    function handleStateChange() {


        addToCart({
            data: {
                productId: currentProduct.id,
                price: currentProduct.price,
                quantity: productcart.quentitys.quentity,
                color: productcart.colors.color,
                size: productcart.sizes.size,
                image_urls: currentProduct.image_url,
                discount_key: currentProduct.discount_key,
                discounts: currentProduct.discounts,
                name: currentProduct.name
            }
        })
        console.log("cart saved ",)
    }

    return (
        <Popover >
            <PopoverTrigger className='w-full relative h-auto'>{children}</PopoverTrigger>
            <PopoverContent className="flex flex-col gap-2 w-full max-w-[300px] relative h-auto">
                <section className='w-full h-auto flex flex-col gap-1'>
                    <div className='flex flex-col gap-1 w-full relative'>
                        <h2 className='text-primary font-medium text-sm '>Colors</h2>
                        <div className="w-full flex flex-wrap  gap-1">
                            {
                                colors?.map((item, index) => (
                                    <span className={` text-center cursor-pointer border text-sm px-2 py-1  ${item.name == (productcart?.colors.color ? productcart?.colors?.color?.name : colors[0].name) ? "bg-primary text-white" : " text-primary bg-transparent"}  `} key={index} onClick={(e) => {
                                        setProductcart((prev) => ({
                                            ...prev,
                                            colors: {
                                                ...prev.colors,
                                                color: item
                                            }
                                        }));
                                    }}>
                                        {item.name}
                                    </span>
                                ))
                            }
                        </div>
                    </div>
                    <div className='flex flex-wrap gap-1 w-full relative'>
                        <h2 className='text-primary font-medium text-sm '>Sizes</h2>
                        <div className="w-full grid grid-cols-5  gap-1">
                            {
                                sizes?.map((item, index) => (
                                    <span className={` text-center cursor-pointer    border text-sm p-1  ${item.size === (productcart?.sizes?.size?.size ? productcart?.sizes?.size?.size : sizes[0].size) ? "bg-primary text-white" : " text-primary bg-transparent"}  `} key={index}

                                        onClick={() => {
                                            setProductcart((prev) => ({
                                                ...prev,
                                                sizes: {
                                                    ...prev.sizes,
                                                    size: item
                                                }
                                            }))
                                        }}
                                    >
                                        {item.size}
                                    </span>
                                ))
                            }
                        </div>
                    </div>
                    <div className='flex items-center gap-1 w-full relative'>
                        <h2 className='text-primary font-medium text-[12px] '>Quentity </h2>

                        <select className='w-full relative  border py-0 h-[25px] text-[12px]' value={productcart.quentitys.quentity} onChange={(e) => setProductcart((prev) => (
                            {
                                ...prev,
                                quentitys: {
                                    ...prev.quentitys,
                                    quentity: Number(e.target.value)
                                }
                            }
                        ))}>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                    </div>
                    <button className='py-2 text-sm bg-primary text-white flex items-center justify-center '
                        onClick={handleStateChange}

                    >Add To Cart</button>

                </section>
            </PopoverContent>
        </Popover>

    )
}

export default AddToCardPopver


