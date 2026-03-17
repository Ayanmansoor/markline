import React, { useRef } from 'react'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import Link from 'next/link'
import { ProductsDataProps } from '@/types/interfaces'
import { ArrowLeftRight, ChevronUp, Ruler, ShoppingCart, TicketCheck, Truck } from 'lucide-react'

function Specification({ product }: ProductsDataProps) {


    return (
        <section className='w-full relative   h-auto grid  grid-cols-1 lg:grid-cols-2  gap-8 bg-secondary px-5 lg:px-10 xl:px-20 2xl:px-40 '>
            <div className='w-full lg:sticky lg:top-14 flex flex-col h-fit '>
                <span className='w-fit relative px-5  py-1 border-t border-black text-primary bg-white text-base font-medium '>
                    Details
                </span>
                <div className='w-full py-5 px-5  border  relative h-auto flex flex-col '>
                    <h2 className=' text-base md:text-xl lg:text-2xl mb-1 font-meidum text-primary'>{product?.brands?.name}</h2>
                    <div
                        className="prose max-w-none text-gray-800 text-sm md:text-base"
                        dangerouslySetInnerHTML={{ __html: product?.description || "" }}
                    ></div>
                </div>
            </div>



            <div className='w-full relative h-auto p-0 lg:p-5'>
                <Accordion type="single" collapsible>



                    <AccordionItem value="order-process">
                        <AccordionTrigger className="text-sm md:text-base font-medium px-2 ">
                            <span className='flex items-center justify-start gap-3'>
                                <ShoppingCart size={20} className='text-gray-700' /> How to Order
                            </span>
                        </AccordionTrigger>

                        <AccordionContent className="px-2 text-xs sm:text-sm text-primary space-y-2">
                            <ul className="list-disc pl-4 space-y-1">
                                <li>Click “Order on WhatsApp” button</li>
                                <li>Our team confirms product availability</li>
                                <li>Shipping details & payment method shared on chat</li>
                                <li>Order confirmed after your approval</li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>


                    {/* Return Policy */}
                    <AccordionItem value="return-policy">
                        <AccordionTrigger className="text-sm md:text-base font-medium px-2">


                            <span className='flex items-center justify-start gap-3'>
                                <ArrowLeftRight size={20} className='text-gray-700' /> 15-Day Return Policy
                            </span>
                        </AccordionTrigger>

                        <AccordionContent className="px-2 text-xs sm:text-sm text-primary space-y-2">
                            <ul className="list-disc pl-4 space-y-1">
                                <li>Return within 15 days of delivery</li>
                                <li>Item must be unused with original tags</li>
                                <li>Sale items, shoes, bags & accessories (except belts) are non-returnable</li>
                                <li>No exchanges — place a new order if needed</li>
                                <li>Refund processed after product inspection</li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>


                    {/* Shipping Policy */}
                    <AccordionItem value="shipping-policy">
                        <AccordionTrigger className="text-sm md:text-base font-medium px-2">


                            <span className='flex items-center justify-start gap-3'>
                                <Truck size={20} className='text-gray-700' /> Shipping & Delivery
                            </span>
                        </AccordionTrigger>

                        <AccordionContent className="px-2 text-xs sm:text-sm text-primary space-y-2">
                            <ul className="list-disc pl-4 space-y-1">
                                <li>Orders dispatched within 1–4 business days</li>
                                <li>Free shipping on all prepaid orders</li>
                                <li>Tracking details shared via WhatsApp</li>
                                <li>Delivery time depends on location</li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3">
                        <AccordionTrigger className='text-sm md:text-base  font-medium md:font-medium px-2'>


                            <span className='flex items-center justify-start gap-3'>
                                <Ruler size={20} className='text-gray-700' /> Size Guide
                            </span>

                        </AccordionTrigger>
                        <AccordionContent className="w-full relative h-auto px-2 flex items-center justify-center text-sm text-primary">
                            <img src="/size-guide.png" alt="Markline || Markline || buy online || size Guied" className=' max-w-[300px] md:max-w-[400px] relative h-auto' height={200} width={500} loading='lazy' />
                        </AccordionContent>
                    </AccordionItem>


                    <AccordionItem value="item-4">
                        <AccordionTrigger className=' text-sm md:text-base  font-medium md:font-medium px-2'>


                            <span className='flex items-center justify-start gap-3'>
                                <ChevronUp size={20} className='text-gray-700' />   Footwear Care Instructions
                            </span>

                        </AccordionTrigger>
                        <AccordionContent className="w-full relative h-auto px-2 flex flex-col gap-3 items-start justify-center text-sm text-primary">

                            <h3 className=' text-xs sm:text-sm md:text-lg font-medium text-primary'>1. General Care Tips</h3>
                            <ul className='text-xs sm:text-sm md:text-lg font-medium text-primary'>
                                <li>Store your shoes in a cool, dry place away from direct sunlight.</li>
                                <li>Use a shoe bag or box to protect your footwear from dust and moisture.</li>
                                <li>Rotate your shoes – don’t wear the same pair every day.</li>
                            </ul>

                            <h3 className=' text-xs sm:text-sm md:text-lg font-medium text-primary'> 2. For Leather Shoes</h3>
                            <ul className='text-xs sm:text-sm md:text-lg font-medium text-primary'>
                                <li>Clean with a soft, damp cloth to remove surface dirt.</li>
                                <li>Apply leather conditioner or polish to retain shine and prevent cracking.</li>
                                <li>Dry naturally if wet – avoid using heaters.</li>
                            </ul>

                            <h3 className=' text-xs sm:text-sm md:text-lg font-medium text-primary'>3. For Synthetic Footwear</h3>
                            <ul className='text-xs sm:text-sm md:text-lg font-medium text-primary'>
                                <li>Wipe gently with a cloth and mild soap solution.</li>
                                <li>Do not use harsh chemicals or abrasive tools.</li>
                                <li>Air dry away from direct heat or sunlight.</li>
                            </ul>

                            <h3 className=' text-xs sm:text-sm md:text-lg font-medium text-primary'>4. For Fabric or Canvas Shoes</h3>
                            <ul className='text-xs sm:text-sm md:text-lg font-medium text-primary'>
                                <li>Spot clean with a soft brush and mild detergent.</li>
                                <li>Air dry in the shade to prevent fading.</li>
                                <li>Use fabric protector spray to prevent stains.</li>
                            </ul>

                            <h3 className=' text-xs sm:text-sm md:text-lg font-medium text-primary'>5. For Heels & Delicate Styles</h3>
                            <ul className='text-xs sm:text-sm md:text-lg font-medium text-primary'>
                                <li>Handle with care and avoid rough surfaces.</li>
                                <li>Use separators during storage to prevent scuffing.</li>
                                <li>Replace worn-out heel caps promptly.</li>
                            </ul>

                            <h3 className=' text-xs sm:text-sm md:text-lg font-medium text-primary'>6. For Kids’ Shoes</h3>
                            <ul className='text-xs sm:text-sm md:text-lg font-medium text-primary'>
                                <li>Use child-safe wipes or damp cloth to clean.</li>
                                <li>Regularly inspect for wear and support.</li>
                                <li>Clean weekly to maintain hygiene.</li>
                            </ul>

                            <h3 className=' text-xs sm:text-sm md:text-lg font-medium text-primary'>7. Odor & Freshness Maintenance</h3>
                            <ul className='text-xs sm:text-sm md:text-lg font-medium text-primary'>
                                <li>Use silica gel or natural deodorizers to absorb moisture.</li>
                                <li>Allow shoes to breathe after each wear.</li>
                                <li>Use foot powder or breathable socks for freshness.</li>
                            </ul>

                            <h3 className=' text-sm sm:text-base md:text-lg font-medium text-primary'>Additional Tips</h3>
                            <ul className='text-sm lg:text-sm font-medium text-primary'>
                                <li>Never machine wash unless product care tag allows.</li>
                                <li>Check soles and replace footwear as needed.</li>
                                <li>Clean or replace laces regularly for a fresh look.</li>
                            </ul>

                            <p><strong>Why Footwear Care Matters:</strong> Proper care extends shoe life, maintains style, and ensures foot health. Whether it’s women’s sandals, heels, kids’ sneakers, or men’s loafers – take care of your steps with Markline.</p>
                        </AccordionContent>
                    </AccordionItem>


                    {
                        product?.materials_used &&
                        <AccordionItem value="item-5">
                            <AccordionTrigger className=' text-sm md:text-base font-medium md:font-medium px-2 capitalize'>


                                <span className='flex items-center justify-start gap-3'>
                                    <TicketCheck size={20} className='text-gray-700' />  Materials we Used
                                </span>
                            </AccordionTrigger>
                            <AccordionContent className="w-full relative h-auto px-2 flex flex-col text-sm md:text-base text-primary">
                                <div dangerouslySetInnerHTML={{ __html: product?.materials_used }} className='text-base' />
                            </AccordionContent>
                        </AccordionItem>
                    }

                </Accordion>
            </div>

        </section>
    )
}

export default Specification