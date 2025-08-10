import React, { useRef } from 'react'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import Link from 'next/link'
import { ProductsDataProps } from '@/types/interfaces'

function Specification({ product }: ProductsDataProps) {

    return (
        <section className='w-full relative   h-auto grid  grid-cols-1 lg:grid-cols-2  gap-8 bg-secondary px-3 lg:px-10     '>
            <div className='w-full lg:sticky lg:top-14 flex flex-col h-fit '>
                <span className='w-fit relative px-5  py-1 border-t border-black text-primary bg-white text-base font-medium '>
                    Details
                </span>
                <div className='w-full py-5 px-5  border  relative h-auto flex flex-col '>
                    <h2 className=' text-xl lg:text-2xl mb-1 font-meidum text-primary'>{product?.brands?.name}</h2>
                    <p className=' text-sm sm:text-lg font-normal text-gray-700'>{product?.description}</p>
                </div>
            </div>

       

            <div className='w-full relative h-auto p-0 lg:p-5'>
                    <Accordion type="single" collapsible>

                    

                        <AccordionItem value="item-1">
                            <AccordionTrigger className=' text-sm md:text-base  font-semibold md:font-medium px-2'>Return Policy</AccordionTrigger>
                            <AccordionContent className="w-full relative h-auto px-2 flex flex-col text-sm text-primary">
                                At Marklines, we strive to ensure your complete satisfaction with every purchase. Items may be returned within 15 days of delivery, provided they are unused, in original condition and packaging, including all labels and tags. However, please note that SALE items, shoes, bags, and accessories (except belts) are non-returnable, non-refundable, and non-replaceable. To initiate a return, simply log into your account, go to “My Orders,” and raise a return request. Broken items may be eligible for repairs. Refunds will be processed to the original payment method once your return is approved. At this time, we do not offer exchanges — please place a new order if needed. For full details, please read our <Link href="/privacy-policy"> Return Policy</Link> .
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger className=' text-sm md:text-base  font-semibold md:font-medium px-2'>Shiping Policy</AccordionTrigger>
                            <AccordionContent className="w-full relative h-auto px-2   text-primary text-sm">
                                At Markline, we process and dispatch orders within 1–2 business days (excluding holidays). Delivery typically takes 3–4 business days if conditions are smooth; in case of delays, we’ll notify you promptly. Shipping is free on all orders . We provide tracking details once your order is shipped, so you can stay updated. Please ensure your address is accurate to avoid delivery issues. For damaged items or returns, refer to our <Link href={'/return-policy'} className='text-primary font-semibold cursor-pointer'>Return Policy</Link> Return Policy, or reach out to us at <Link className='text-primary font-semibold cursor-pointer' href={'melto:shipping@stylemarkline.com'}></Link> shipping@stylemarkline.com for assistance.
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-3">
                            <AccordionTrigger className=' text-sm md:text-base  font-semibold md:font-medium px-2'>Size Guide</AccordionTrigger>
                            <AccordionContent className="w-full relative h-auto px-2 flex items-center justify-center text-sm text-primary">
                                <img src="/size-guide.png" alt="Markline || Markline || buy online || size Guied" className=' max-w-[300px] md:max-w-[400px] relative h-auto' height={200} width={500} loading='lazy' />
                            </AccordionContent>
                        </AccordionItem>


                        <AccordionItem value="item-4">
                            <AccordionTrigger className=' text-sm md:text-base  font-semibold md:font-medium px-2'> Footwear Care Instructions – Keep Your Markline Shoes Looking New</AccordionTrigger>
                            <AccordionContent className="w-full relative h-auto px-2 flex flex-col gap-3 items-start justify-center text-sm text-primary">

                                <h3 className=' text-sm sm:text-base md:text-lg font-semibold text-primary'>1. General Care Tips</h3>
                                <ul className='text-sm lg:text-sm font-medium text-primary'>
                                    <li>Store your shoes in a cool, dry place away from direct sunlight.</li>
                                    <li>Use a shoe bag or box to protect your footwear from dust and moisture.</li>
                                    <li>Rotate your shoes – don’t wear the same pair every day.</li>
                                </ul>

                                <h3 className=' text-sm sm:text-base md:text-lg font-semibold text-primary'> 2. For Leather Shoes</h3>
                                <ul className='text-sm lg:text-sm font-medium text-primary'>
                                    <li>Clean with a soft, damp cloth to remove surface dirt.</li>
                                    <li>Apply leather conditioner or polish to retain shine and prevent cracking.</li>
                                    <li>Dry naturally if wet – avoid using heaters.</li>
                                </ul>

                                <h3 className=' text-sm sm:text-base md:text-lg font-semibold text-primary'>3. For Synthetic Footwear</h3>
                                <ul className='text-sm lg:text-sm font-medium text-primary'>
                                    <li>Wipe gently with a cloth and mild soap solution.</li>
                                    <li>Do not use harsh chemicals or abrasive tools.</li>
                                    <li>Air dry away from direct heat or sunlight.</li>
                                </ul>

                                <h3 className=' text-sm sm:text-base md:text-lg font-semibold text-primary'>4. For Fabric or Canvas Shoes</h3>
                                <ul className='text-sm lg:text-sm font-medium text-primary'>
                                    <li>Spot clean with a soft brush and mild detergent.</li>
                                    <li>Air dry in the shade to prevent fading.</li>
                                    <li>Use fabric protector spray to prevent stains.</li>
                                </ul>

                                <h3 className=' text-sm sm:text-base md:text-lg font-semibold text-primary'>5. For Heels & Delicate Styles</h3>
                                <ul className='text-sm lg:text-sm font-medium text-primary'>
                                    <li>Handle with care and avoid rough surfaces.</li>
                                    <li>Use separators during storage to prevent scuffing.</li>
                                    <li>Replace worn-out heel caps promptly.</li>
                                </ul>

                                <h3 className=' text-sm sm:text-base md:text-lg font-semibold text-primary'>6. For Kids’ Shoes</h3>
                                <ul className='text-sm lg:text-sm font-medium text-primary'> 
                                    <li>Use child-safe wipes or damp cloth to clean.</li>
                                    <li>Regularly inspect for wear and support.</li>
                                    <li>Clean weekly to maintain hygiene.</li>
                                </ul>

                                <h3 className=' text-sm sm:text-base md:text-lg font-semibold text-primary'>7. Odor & Freshness Maintenance</h3>
                                <ul className='text-sm lg:text-sm font-medium text-primary'> 
                                    <li>Use silica gel or natural deodorizers to absorb moisture.</li>
                                    <li>Allow shoes to breathe after each wear.</li>
                                    <li>Use foot powder or breathable socks for freshness.</li>
                                </ul>

                                <h3 className=' text-sm sm:text-base md:text-lg font-semibold text-primary'>Additional Tips</h3>
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
                            <AccordionTrigger className=' text-sm md:text-base font-semibold md:font-medium px-2 capitalize'>Materials we Used</AccordionTrigger>
                            <AccordionContent className="w-full relative h-auto px-2 flex flex-col text-base text-primary">
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