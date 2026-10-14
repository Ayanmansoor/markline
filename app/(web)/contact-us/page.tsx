import Link from 'next/link'
import React from 'react'
import { Metadata } from 'next'
import { BsWhatsapp } from 'react-icons/bs'
import { FaFacebook, FaInstagram } from 'react-icons/fa6'
import { FaPinterestP } from 'react-icons/fa'
import { Gift, Phone, Mail, Clock, MapPin } from 'lucide-react'

export const metadata: Metadata = {
    title: 'Contact Us | Bulk Inquiry for Corporate Gifting | Markline',
    description: 'Get in touch with Markline for customer support, office inquiries, and bulk inquiries for corporate gifting. Call +91 9702456322.',
}

function page() {
    return (
        <>
            <section className="w-full relative h-full py-10 md:py-20 container grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-8 md:gap-10 lg:gap-16 xl:gap-20 px-5 md:px-10 xl:px-20">

                {/* Left Column: Office Address & Corporate Gifting Section */}
                <div className='w-full relative h-auto flex flex-col gap-8'>
                    <div className='flex flex-col gap-2'>
                        <div className='flex items-center gap-2 text-primary'>
                            <MapPin size={20} />
                            <h2 className='text-2xl font-bold text-primary'>
                                Office Address :
                            </h2>
                        </div>
                        <p className='text-base md:text-lg font-medium text-gray-700 leading-relaxed pl-7'>
                            ROOM NO 165 INDRA NAGAR , NR-BARMA SHEEL RAILWAY LINE , KURLA EAST , NEHRU NAGAR , MUMBAI 400024
                        </p>
                    </div>

                    {/* Bulk Inquiry For Corporate Gifting Card */}
                    <div className='w-full p-6 md:p-7 bg-gradient-to-br from-amber-50/50 via-white to-emerald-50/30 border border-gray-200 rounded-2xl shadow-sm flex flex-col gap-4'>
                        <div className='flex items-center gap-3'>
                            <div className='w-11 h-11 rounded-xl bg-black text-white flex items-center justify-center shrink-0 shadow-md'>
                                <Gift size={22} />
                            </div>
                            <div>
                                <span className='text-[10px] font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full'>
                                    Corporate & Wholesale
                                </span>
                                <h3 className='text-xl md:text-2xl font-bold text-gray-900 mt-1 leading-tight'>
                                    Bulk Inquiry For Corporate Gifting
                                </h3>
                            </div>
                        </div>

                        <p className='text-sm text-gray-600 leading-relaxed'>
                            Looking for corporate gifting, employee packages, festive hampers, or custom bulk orders? Partner with Markline for premium footwear packages with dedicated wholesale pricing and swift fulfillment.
                        </p>

                        <div className='flex flex-col sm:flex-row gap-3 pt-2'>
                            <Link
                                href='tel:+919702456322'
                                className='flex-1 inline-flex items-center justify-center gap-2 bg-black text-white px-5 py-3 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-all active:scale-[0.98]'
                            >
                                <Phone size={16} />
                                <span>+91 9702456322</span>
                            </Link>
                            <Link
                                href='https://wa.me/919702456322?text=Hello%20Markline%2C%20I%20have%20a%20bulk%20inquiry%20for%20corporate%20gifting'
                                target='_blank'
                                rel='noopener noreferrer'
                                className='flex-1 inline-flex items-center justify-center gap-2 bg-emerald-600 text-white px-5 py-3 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-all active:scale-[0.98]'
                            >
                                <BsWhatsapp size={16} />
                                <span>Chat on WhatsApp</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Right Column: Customer Care Support */}
                <div className="w-full gap-5 sticky lg:sticky lg:top-20 h-fit flex flex-col bg-gray-50/60 p-6 md:p-8 rounded-2xl border border-gray-100">
                    <h2 className="text-2xl font-bold text-foreground">Customer Care Support</h2>

                    <div className="w-full relative flex flex-col gap-1">
                        <div className='flex items-center gap-2 text-fontPrimary'>
                            <Phone size={16} className='text-gray-500' />
                            <h3 className="text-base font-semibold text-fontPrimary">
                                Customer Support Contact :
                            </h3>
                        </div>
                        <div className="w-full relative flex flex-wrap items-center gap-3 pl-6">
                            <Link
                                href="tel:(+91)9703456322"
                                className="text-base md:text-lg font-medium text-fontPrimary hover:underline"
                            >
                                (+91) 9703456322
                            </Link>
                            <span className='text-gray-400'>/</span>
                            <Link
                                href="tel:(+91)9769020660"
                                className="text-base md:text-lg font-medium text-fontPrimary hover:underline"
                            >
                                (+91) 9769020660
                            </Link>
                        </div>
                    </div>

                    {/* Dedicated Corporate Gifting Support line */}
                    <div className="w-full relative flex flex-col gap-1 pt-3 border-t border-gray-200/60">
                        <div className='flex items-center gap-2 text-fontPrimary'>
                            <Gift size={16} className='text-emerald-700' />
                            <h3 className="text-base font-semibold text-gray-900">
                                Bulk Inquiry For Corporate Gifting :
                            </h3>
                        </div>
                        <div className="w-full relative flex flex-wrap items-center gap-3 pl-6">
                            <Link
                                href="tel:+919702456322"
                                className="text-base md:text-lg font-bold text-black hover:underline"
                            >
                                +91 9702456322
                            </Link>
                            <Link
                                href="https://wa.me/919702456322?text=Hello%20Markline%2C%20I%20have%20a%20bulk%20inquiry%20for%20corporate%20gifting"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-semibold hover:bg-emerald-200 transition-colors"
                            >
                                <BsWhatsapp size={12} />
                                <span>WhatsApp Us</span>
                            </Link>
                        </div>
                    </div>

                    <div className="w-full relative flex flex-col gap-1 pt-3 border-t border-gray-200/60">
                        <div className='flex items-center gap-2 text-fontPrimary'>
                            <Mail size={16} className='text-gray-500' />
                            <h3 className="text-base font-semibold text-fontPrimary">
                                Email :
                            </h3>
                        </div>
                        <div className='pl-6'>
                            <Link href="mailto:stylemarkline@gmail.com" className="text-base md:text-lg font-medium text-fontPrimary hover:underline">
                                stylemarkline@gmail.com
                            </Link>
                        </div>
                    </div>

                    <div className="w-full relative flex flex-col gap-1 pt-3 border-t border-gray-200/60">
                        <div className='flex items-center gap-2 text-fontPrimary'>
                            <Clock size={16} className='text-gray-500' />
                            <h3 className="text-base font-semibold text-fontPrimary">
                                Contact Time :
                            </h3>
                        </div>
                        <p className="text-base md:text-lg font-medium text-fontPrimary pl-6">
                            Monday to Sunday (10:00 AM - 06:00 PM)
                        </p>
                    </div>

                    <div className="w-full relative flex flex-wrap items-center gap-4 mt-2 pt-3 border-t border-gray-200/60">
                        <Link
                            href="https://www.facebook.com/shopmarkline"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Facebook"
                            className="bg-primary rounded-full p-2.5 text-white hover:bg-gray-800 transition-colors"
                        >
                            <FaFacebook className="text-[20px]" />
                        </Link>
                        <Link
                            href="https://in.pinterest.com/shopmarkline"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Pinterest"
                            className="bg-primary p-2.5 rounded-full text-white hover:bg-gray-800 transition-colors"
                        >
                            <FaPinterestP className="text-[20px]" />
                        </Link>
                        <Link
                            href="https://www.instagram.com/shopmarkline"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram"
                            className="bg-primary rounded-full p-2.5 text-white hover:bg-gray-800 transition-colors"
                        >
                            <FaInstagram className="text-[20px]" />
                        </Link>
                    </div>
                </div>

            </section>

            <div className='w-full relative h-auto mb-10 border'>
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d235.68776411904867!2d72.87984716642595!3d19.063551814588198!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1751563854461!5m2!1sen!2sin"
                    className='w-full relative h-[450px] md:h-[500px]'
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Markline Office Location Map"
                />
            </div>
        </>
    )
}

export default page