import React, { useEffect, useRef, useState } from 'react'

import { PiHeartThin } from "react-icons/pi";
import { CiDiscount1 } from "react-icons/ci";
import { BsCurrencyRupee } from "react-icons/bs";
import { MdKeyboardArrowDown } from "react-icons/md";
import { CiDeliveryTruck } from "react-icons/ci";
import ColorView from '../Common/ColorView';
// import BuyDailog from '@/Comman/BuyDailog';
import BuyDailog from './BuyDailog';
import AddToCardPopver from '../Common/AddToCardPopver';
import { useCart } from '@/Contexts/Cart.context';
import { Colors as colorProps, Colors, Images, ProductsDataProps, Sizes as sizeProps, Sizes } from '@/types/interfaces';
import { FaHeart } from 'react-icons/fa6';
import { useWishlists } from '@/Contexts/wishlist';
import Razorpay from 'razorpay';
import axios from 'axios';
import LoadRazorpay from '@/utils/loadrazorpay';

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



function ProductAbout({ product }: ProductsDataProps) {
    const { addToCart, getCartProduct } = useCart()
    const [isInWhishlist, setIsInwhishlist] = useState<boolean>(false)
    const razorpayBtn = useRef<HTMLButtonElement>(null)
    const { wishlist, addToWishlist, isProductInWishlist } = useWishlists()

    const [productcart, setProductcart] = useState<productsCart>({
        colors: {
            color:
                { name: '', hex: '' }
        },
        sizes: {
            size:
                { size: '', unit: '' }
        },
        quentitys: {
            quentity: 1
        }
    })



    function handleStateChange(e: any) {


        addToCart({
            data: {
                productId: product.id,
                price: product.price,
                quantity: productcart.quentitys.quentity,
                color: productcart.colors.color,
                size: productcart.sizes.size,
                discounts: product.discounts,
                discount_key: product.discount_key,
                image_urls: product.image_url,
                name: product.name
            }
        })

    }

    const [colors, setColors] = useState<Colors[]>([])
    const [size, setSizes] = useState<Sizes[]>([])
    const [StringifyImages, setStringifyImages] = useState<Images[]>([])
    useEffect(() => {
        if (!product?.colors || !product?.sizes) return;

        const parsedColors: Colors[] = product.colors.map((item: any) =>
            typeof item === "string" ? JSON.parse(item) : item
        );
        const parsedSizes: Sizes[] = product.sizes.map((size: any) =>
            typeof size === "string" ? JSON.parse(size) : size
        );
        const productImage: Images[] = product.image_url?.map((image: any) => JSON.parse(image)) || []
        setStringifyImages(productImage)
        setColors(parsedColors)
        setSizes(parsedSizes)
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

        }
    }, [product]);

    useEffect(() => {
        const present = isProductInWishlist({ productId: product.id })
        setIsInwhishlist(present)
    }, [wishlist.length])
    function addTowishlistproduct(selectedColor: Colors[], selectedSize: Sizes[]) {
        addToWishlist({ name: product.name, productId: product.id, price: product.price, quantity: product.quantity, color: selectedColor, size: selectedSize, image_urls: StringifyImages, discounts: product.discounts, discount_key: product.discount_key, slug: product.slug })
    }

   

    return (
        <>
            <div className='relative flex items-start h-auto  flex-col w-full md:w-[40%] py-5 md:pl-5  lg:pl-10 '>

                <div className='flex items-center justify-between   w-full relative '>
                    <p className='text-[16px] font-normal items-center gap-1  '>{product?.gender}</p>
                    <p className='text-[16px] font-medium text-primary ' aria-label='Product For Running'></p>
                </div>
                <div className='flex flex-col gap-1 w-full relative'>
                    <h1 className='text-p35 font-bold   uppercase' aria-label='Addidas shoes L1' >{product?.name}</h1>
                    <p className='text-base font-medium text-primary '>Selected Color : <strong className='text-lg font-semibold'> {productcart.colors.color.name} </strong></p>
                </div>
                <div className='flex justify-between items-start sm:items-center w-full relative flex-col  sm:flex-row py-3'>
                    <h2 className='text-p18 font-normal flex items-center gap-2 '>
                        {
                            product?.discounts?.discount_persent ?
                                <>
                                    <p className='text-lg md:text-xl font-normal text-black line-through text-nowrap '>₹ {product?.price}</p>
                                    <p className=' text-2xl lg:text-3xl  font-medium text-nowrap  text-red-400'>₹{
                                        Math.floor(product?.price - (product?.price * (product?.discounts?.discount_persent / 100)))}</p>
                                </>
                                :
                                <p className='text-2xl lg:text-4xl  font-medium text-nowrap text-red-500'>₹ {product?.price}</p>

                        }

                    </h2>
                    <p className='text-[16px] font-normal '>Includes all taxs</p>
                </div>

                <div className='flex items-center   relative flex-col gap-2 w-full '>
                    <p className='text-p18 font-semibold flex items-center justify-between w-full'>Color: {productcart.colors.color.name}
                        {/* 
                        <ColorView colors={[]} images={[]} >
                            <span className='text-[16px]  font-normal  flex items-center gap-1 cursor-pointer '>More Colors  <MdKeyboardArrowDown className='text-[16px]' /></span>
                        </ColorView> */}

                    </p>

                    <div className=' flex flex-wrap  items-center relative  justify-start   w-full '>
                        {
                            colors?.map((color: any, index: number) => (
                                <span className={`p-7   rounded-full cursor-pointer  border  ${color.name === productcart?.colors?.color?.name ? "  border-primary p-1" : " border-transparent"} ${index >= 1 ? "-m-[4px]" : ""} `} style={{ background: color.hex }} key={index}
                                    onClick={(e) => {
                                        console.log(productcart)
                                        setProductcart((prev) => ({
                                            ...prev,
                                            colors: {
                                                color: color
                                            }
                                        }));
                                    }}></span>
                            ))
                        }
                    </div>
                </div>
                {/* Size section */}

                <div className='flex items-center  py-5 relative flex-col gap-3 w-full '>
                    {
                        size?.length > 0 &&
                        <>
                            <p className='text-p18 font-semibold flex items-center justify-between w-full'>Select Size (UK) :</p>
                            <div className='w-full gap-2 relative h-auto  grid grid-cols-6 '>
                                {
                                    size?.map((item: any, index) => (
                                        <p key={index} className={`py-2 text-center border  font-normal cursor-pointer hover:text-white hover:bg-black hover:font-medium ${item.size === productcart?.sizes?.size?.size ? " bg-primary border-transparent text-white" : " text-primary border-primary bg-transparent"}  `} onClick={() => setProductcart((prev) => ({
                                            ...prev,
                                            sizes: {
                                                ...prev.sizes,
                                                size: item
                                            }
                                        }))}>{item?.size}</p>
                                    ))
                                }

                            </div>
                        </>
                    }
                    <p className='text-base text-medium text-start w-full  text-green-700'>{size?.length > 0 ? "Few Left's " : "Out of Stock"}</p>
                    <div className='flex items-center gap-1 w-full relative  h-auto '>
                        <h2 className='text-primary font-medium text-sm  '>Quantity : </h2>

                        <select className='max-w-[600px] relative  bg-transparent  text-base  border border-gray-400 rounded-md py-1 px-4 text-[12px]' value={productcart.quentitys.quentity} onChange={(e) => setProductcart((prev: any) => (
                            {
                                ...prev,
                                quentitys: {
                                    ...prev.quentitys,
                                    quentity: e.target.value ? e.target.value : ''
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
                </div>


                {/* Book btn  */}

                <div className='w-full fixed bottom-0 px-4 flex-wrap sm:px-0 bg-white sm:bg-transparent py-2 sm:py-0  z-30 grid-cols-[1fr_auto] md:grid-cols-1 lg:grid-cols-[1fr_auto] gap-3 right-0 grid   items-center sm:relative  '>
                    <div className='w-full relative flex items-center gap-2 md:gap-1 lg:gap-2 '>

                        {/* <AddToCardPopver currentProduct={product} colors={colors} sizes={size}> */}

                        <button disabled={colors?.length > 0 && size?.length > 0 ? false : true} className=' w-full relative xl:px-5 py-4 bg-black text-white hover:border-black border border-transparent hover:bg-slate-100 hover:text-black  ' onClick={handleStateChange} >Add to Cart</button>
                        <BuyDailog product={{ ...product, selectedColor: productcart.colors.color, selectedSize: productcart.sizes.size, quantity: productcart.quentitys.quentity }}>
                            <button disabled={colors && size ? false : true} className=' w-full relative  xl:px-5 py-4 bg-black text-white hover:border-black border border-transparent hover:bg-slate-100 hover:text-black  ' >Buy Now</button>
                        </BuyDailog>
                        {/* </AddToCardPopver>       */}
                    </div>
                    <span className='border py-1     flex items-center justify-center px-5 cursor-pointer group hover:bg-red-200 h-full ' onClick={() => addTowishlistproduct(colors, size)}>
                        <FaHeart className={`text-[20px] flex items-center  text-black justify-center cursor-pointer hover:text-red-500  ${isInWhishlist && "text-red-500"}  `} />
                    </span>
                </div>

                <div className='w-full relative flex items-center justify-between gap-3'>
                    <span className='flex flex-col gap-1'>

                    </span>
                </div>

                {/* BENIFITS */}
                <ul className='w-full relative h-auto flex items-start gap-2 flex-col py-4 '>

                    <li className=' text-white bg-primary px-3 py-1 w-full  flex items-start text-xs sm:text-sm lg:text-base font-medium'>
                       Free delevery applicable  above 4,000 Rs Shoping.
                    </li>

                    <li className='flex items-center w-full relative gap-1 text-xs sm:text-sm'><CiDiscount1 className='text-[20px]' />
                        Save 5% on all Online Payments under ₹10,000/-
                    </li>
                    <li className='flex items-start w-full relative gap-1 text-xs sm:text-sm'><CiDeliveryTruck className='text-[30px]' />
                        Delivery: Orders are typically delivered within 3-7 business days across India.
                    </li>
                </ul>



            </div>
        </>
    )
}

export default ProductAbout
