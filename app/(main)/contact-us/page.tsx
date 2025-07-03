import FeedbackForm from '@/components/Forms/FeedbackForm'
import Link from 'next/link'
import React from 'react'
import { BsLinkedin } from 'react-icons/bs'
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa6'
import { FaPinterestP } from "react-icons/fa";
function page() {
  return (
        <>
            <section className="w-full relative h-full py-10 md:py-20 container grid   grid-cols-1 md:grid-cols-[1fr_1fr]  gap-5 md:gap-10 lg:gap-20 xl:gap-20 px-5  md:px-10   xl:px-20 ">
                    {/* <FeedbackForm /> */}

                    <span className='w-full relative h-auto flex flex-col gap-4 '>

                    <h2 className='text-2xl font-medium text-primary'>
                        Office Address :    
                    </h2>
                    <p className='text-lg font-medium text-primary '>506 , Zabunnisa Apt , 5th Floor , amrut Nagar ,Mumbra Thane 400612 , Maharashtra </p>
                    </span>
                    

                    <div
                        className="w-full gap-3  sticky lg:sticky lg:top-20 h-fit 
            flex flex-col"
                    >
                        <h2 className="text-2xl font-medium text-foreground  ">Customer Care Support</h2>

                        <span className="w-full relative h-auto flex flex-col gap-1 ">
                            <h2 className="w-full text-xl   font-medium  text-fontPrimary  ">
                                Contact :
                            </h2>
                            <div className="w-full relative flex  flex-wrap items-center gap-3 md:gap-5 ">
                                <Link
                                    href={"tel:(+91) 9773141989"}
                                    className="text-lg font-medium  text-fontPrimary "
                                >
                                    (+91) 9702456322
                                </Link>
                            </div>
                        </span>

                        <div className="w-full relative flex  flex-wrap items-center gap-1 md:gap-1 ">
                            <h2 className="w-full text-xl font-medium text-fontPrimary  ">
                                Email :
                            </h2>
                            <Link href={"/"} className="text-lg font-medium text-fontPrimary">
                                customercare@marklinefashion.com
                            </Link>
                        </div>

                        
                        <div className="w-full relative flex  flex-wrap items-center gap-1 md:gap-1 ">
                            <h2 className="w-full text-xl font-medium text-fontPrimary  ">
                                Contact Time: 
                            </h2>
                            <Link href={"/"} className="text-lg font-medium text-fontPrimary">
                                    Monday to Sunday (10:00 AM - 06:00PM)
                            </Link>
                        </div>
                


                        <div className="w-full relative flex  flex-wrap items-center gap-5 mt-3 ">
                            <Link
                                href={"/"}
                                className="text-p18 font-medium bg-primary rounded-full p-2 text-webtext "
                            >
                                <FaFacebook className="text-white text-[25px]" />
                            </Link>
                            <Link
                                href={"https://www.pinterest.com/Marklinefashion"}
                                className="text-p18 font-medium bg-primary p-2 rounded-full text-webtext "
                            >
                                <FaPinterestP className="text-[25px] text-white " />
                            </Link>

                            <Link
                                 href={"https://www.instagram.com/marklinefashion"}
                                className="text-p18 font-medium bg-primary rounded-full p-2 text-webtext "
                            >
                                <FaInstagram className="text-white text-[25px]" />
                            </Link>
                            <Link
                                href={"/"}
                                className="text-p18 font-medium bg-primary p-[10px] rounded-full text-webtext "
                            >
                                <BsLinkedin className="text-[20px] text-white " />
                            </Link>
                            <Link
                                href={"https://www.youtube.com/channel/UCCDnKdMSM4abCTRC2lq0IKA"}
                                className="text-p18 font-medium bg-primary p-2 rounded-full text-webtext "
                            >
                                <FaYoutube className="text-[25px] text-white " />
                            </Link>
                        </div>
                    </div>


            </section>

            <div className='w-full relative h-auto mb-10 border '>

                    <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d235.68776411904867!2d72.87984716642595!3d19.063551814588198!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1751563854461!5m2!1sen!2sin" className='w-full relative h-[500px]' height="450"   loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
            </div>
        </>
  )
}

export default page