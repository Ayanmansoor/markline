"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import "swiper/css";
import "swiper/css/effect-fade";
import { getAllBanner } from "@/Supabase/SupabaseApi";

const WHATSAPP_NUMBER = "919769020660";
const WHATSAPP_MESSAGE = encodeURIComponent(
    "Hi! 🎉 I saw your amazing offer on Markline. I'd love to know more and place an order!"
);

const OfferPopupDialog = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [mobileBanners, setMobileBanners] = useState<any[]>([]);

    useEffect(() => {
        // Ensure this runs only on client
        if (typeof window === "undefined") return;

        // Check if popup already shown this session
        const hasSeenPopup = sessionStorage.getItem("markline_popup_seen");
        if (hasSeenPopup === "true") return;

        // Only allow on mobile
        if (window.innerWidth > 768) return;

        let timer: NodeJS.Timeout;

        const initPopup = async () => {
            try {
                const banners = await getAllBanner();

                const filtered = Array.isArray(banners)
                    ? banners.filter(
                        (b: any) => b?.isMobile === true || b?.isMobile === null
                    )
                    : [];

                setMobileBanners(filtered);

                // Mark as seen immediately to prevent double triggers
                sessionStorage.setItem("markline_popup_seen", "true");

                timer = setTimeout(() => {
                    setIsOpen(true);
                }, 3000);
            } catch (error) {
                console.error("Popup banner load failed:", error);
            }
        };

        initPopup();

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        if (typeof window === "undefined") return;
        sessionStorage?.setItem("markline_popup_seen", "true");
    };

    const handleWhatsApp = () => {
        window.open(
            `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`,
            "_blank",
            "noopener,noreferrer"
        );
        // Ensure this runs only on client
        if (typeof window === "undefined") return;

        handleClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
                        onClick={handleClose}
                    />

                    {/* Dialog */}
                    <motion.div
                        key="dialog"
                        initial={{ opacity: 0, scale: 0.88, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.88, y: 50 }}
                        transition={{ type: "spring", damping: 22, stiffness: 300 }}
                        className="fixed inset-0 flex items-center justify-center z-[9999] px-4 pointer-events-none"
                    >
                        <div className="relative w-full max-w-xs bg-white rounded-2xl shadow-2xl overflow-hidden pointer-events-auto">
                            {/* Close button */}
                            <button
                                onClick={handleClose}
                                className="absolute top-2.5 right-2.5 z-20 p-1 rounded-full bg-black/40 hover:bg-black/60 transition-colors"
                            >
                                <X className="w-4 h-4 text-white" />
                            </button>

                            {/* Banner Swiper */}
                            {mobileBanners.length > 0 ? (
                                <div className="relative w-full aspect-[9/14]">
                                    <Swiper
                                        modules={[Autoplay, EffectFade]}
                                        loop={mobileBanners.length > 1}
                                        effect="fade"
                                        fadeEffect={{ crossFade: true }}
                                        autoplay={{ delay: 2500, disableOnInteraction: false }}
                                        className="h-full w-full"
                                    >
                                        {mobileBanners.map((banner, index) => (
                                            <SwiperSlide key={index} className="h-full w-full">
                                                <Link
                                                    href={banner.url || "#"}
                                                    onClick={handleClose}
                                                >
                                                    <Image
                                                        src={banner.image_url}
                                                        alt={banner.name || "Offer Banner"}
                                                        fill
                                                        className="object-cover object-center"
                                                        priority={index === 0}
                                                    />
                                                </Link>
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>

                                    {/* WhatsApp overlay button at bottom */}
                                    <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/70 to-transparent px-4 pt-10 pb-4">
                                        <button
                                            onClick={handleWhatsApp}
                                            className="flex w-full items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] active:scale-95 transition-all text-white font-bold text-xs uppercase py-3 rounded-xl shadow-lg"
                                        >
                                            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.396.014 12.032c0 2.12.556 4.189 1.613 6.011L0 24l6.117-1.605a11.837 11.837 0 005.9 1.604h.005c6.638 0 12.034-5.396 12.038-12.032A11.785 11.785 0 0019.524 3.488z" />
                                            </svg>
                                            Chat on WhatsApp &amp; Claim Offer
                                        </button>

                                    </div>
                                </div>
                            ) : (
                                /* Fallback if no mobile banners loaded */
                                <div className="px-6 py-8 text-center">
                                    <span className="text-4xl">🎉</span>
                                    <h2 className="mt-2 font-bold text-xl text-gray-900">Exclusive Offer!</h2>
                                    <p className="mt-1 text-gray-500 text-sm">
                                        Up to 50% OFF on select footwear. Limited time only!
                                    </p>
                                    <button
                                        onClick={handleWhatsApp}
                                        className="mt-5 flex w-full items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] active:scale-95 transition-all text-white font-bold text-sm uppercase py-3 rounded-xl"
                                    >
                                        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.396.014 12.032c0 2.12.556 4.189 1.613 6.011L0 24l6.117-1.605a11.837 11.837 0 005.9 1.604h.005c6.638 0 12.034-5.396 12.038-12.032A11.785 11.785 0 0019.524 3.488z" />
                                        </svg>
                                        Chat on WhatsApp &amp; Claim Offer
                                    </button>
                                    <button
                                        onClick={handleClose}
                                        className="mt-2 w-full text-xs text-gray-400 hover:text-gray-600 transition-colors py-1"
                                    >
                                        No thanks, continue browsing
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default OfferPopupDialog;
