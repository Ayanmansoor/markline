import React, { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react';


import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Images, newCartItem, useCartContext } from '@/Contexts/Cart.context';
import { Trash } from 'lucide-react';
import Link from 'next/link';
// import { CartItemProps } from '@/types/Interface'
// import { BASE_URL } from '@/config/config'
// import { useCartContext } from '@/context/ProductContext'
const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
};

interface NEWCartItemProps {
    cartItemId?: string;
    productId?: string;
    sku: {
        id: string;
        name: string;
        images: string[];
        size: string;
        moq: number;
        mrp: number;
        retail: number;
        discount: number;
        cgst: number;
        sgst: number;
        igst: number;
        Product?: {
            name: string;
        };
    };
    quantity: number;
}


interface CartCardProps {
    data: NEWCartItemProps
}


function CartCard({ data }: any) {
    const [StringifyImages, setStringifyImages] = useState<any[] | undefined>([])

    const { updateQuantity, removeFromCart } = useCartContext()


    function handleQuantityChange(item: newCartItem, quantity: number) {
        console.log(item.quantity, "this is item have")
        if (!item) return;
        if (quantity <= 5) {
            updateQuantity({
                productId: item.productId,
                colorName: item.variant.selectedColor,
                size: item.variant.selectedSize,
                quantity: quantity,
            });
        }
    }

    useEffect(() => {
        const images: any[] = data?.variant?.image_url;
        setStringifyImages(images);
    }, [data]);

    const { originalPrice, discountPercent, finalPrice } = useMemo(() => {
        const price = data.variant.price;
        const discount = data.variant.discounts?.discount_persent || 0;

        if (discount > 0) {
            const discountAmount = price * (discount / 100);
            const calculatedFinalPrice = price - discountAmount;
            return {
                originalPrice: price,
                discountPercent: discount,
                finalPrice: Math.floor(calculatedFinalPrice)
            };
        }

        return {
            originalPrice: price,
            discountPercent: 0,
            finalPrice: price
        };
    }, [data.variant.price, data.variant.discounts]);



    function removecat(id, colorName, size) {
        removeFromCart({ productId: id, colorName: colorName, size: size })
    }

    return (
        <Link href={`/product/${data.slug}`} className='w-full relative h-fit border rounded-lg   flex-col sm:flex-row flex items-center justify-between gap-2  p-2 md:p-1 pb-4 sm:border-b border-gray-300 '>
            <div className='flex flex-col sm:flex-row items-start sm:items-center w-full sm:w-fit  gap-3  '>
                <Swiper

                    pagination={{
                        dynamicBullets: true
                    }}
                    className="mySwiper max-w-[150px]  realtive max-h-[200px] md:max-h-[150px]"
                >

                    {
                        StringifyImages &&
                        StringifyImages?.map((image, index: number) => (
                            <SwiperSlide className=' max-w-[150px] rounded-lg max-h-[200px] md:max-h-[120px] relative border overflow-hidden' key={index}>
                                <img src={`${image?.image_url}` || ''} alt={`${image.name} - markline `} className={` aspect-square  w-full transition-all duration-100 ease-in-out object-contain sm:object-cover hover:scale-[1.010] max-h-[220px] sm:max-h-[150px]  `} height={200} width={300} loading='lazy' />
                            </SwiperSlide>
                        ))
                    }
                </Swiper>
                <span className='flex flex-col gap-1'>
                    <h2 className=' text-lg md:text-lg max-w-[350px] font-semibold text-gray-800 line-clamp-2'>
                        {data?.productName}
                    </h2>
                    <ul className=' flex-col sm:flex-row flex items-start sm:items-center gap-1 justify-start  '>
                        <li className='text-sm font-medium text-primary'>
                            Size :  {data?.variant?.selectedSize?.size}
                        </li>
                        <li className='text-sm font-medium text-primary'>
                            Color: {data?.variant?.selectedColor?.name}
                        </li>
                    </ul>
                </span>

            </div>
            <div className='flex flex-col items-end gap-2 px-0 md:px-2  w-full sm:w-fit  justify-end '>

                <div className='flex  flex-wrap items-center gap-3 px-0 md:px-3'>
                    {discountPercent > 0 && (
                        <p className='text-xs font-bold text-green-600 bg-green-100 w-fit px-2 py-0.5 rounded-full mt-1'>
                            {discountPercent}% OFF
                        </p>
                    )}
                    {discountPercent > 0 && (
                        <p className='text-sm text-gray-500 line-through'>
                            {formatPrice(originalPrice)}
                        </p>
                    )}
                    <h2 className='text-lg font-semibold text-primary'>
                        {formatPrice(finalPrice)}
                    </h2>

                </div>
                <Select onValueChange={(newValue) => handleQuantityChange(data, parseInt(newValue))}>
                    <SelectTrigger className=" w-full sm:w-[120px] font-semibold text-base text-text-primary border-gray-200 border ">
                        <SelectValue className='' placeholder={`Qty : ${data?.quantity}`} />
                    </SelectTrigger>
                    <SelectContent >
                        {
                            [...Array(5)].map((item, index) => (
                                <SelectItem value={`${index + 1}`} key={index} className={` ${index + 1 == data?.quantity && "bg-gray-200"} `} >{index + 1}</SelectItem>
                            ))
                        }
                    </SelectContent>
                </Select>

                <Trash height={20} className=" cursor-pointer text-red-500" onClick={() => removecat(data?.productId, data?.variant?.selectedColor, data?.variant?.selectedSize)} />
            </div>
        </Link>
    )
}

export default CartCard