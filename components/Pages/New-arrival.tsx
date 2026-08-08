'use client'
import React, { useRef } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from 'react-query'
import { getAllNewArrivalProducts } from '@/Supabase/SupabaseApi'
import ProductCardSkeleton from '../Skeleton/ProductCardSkeleton'
import ProductCard from '../Common/ProductCard'
import { NewProductProps } from '@/types/interfaces'
import Image from 'next/image'
import Link from 'next/link'
import {
  Sparkles,
  ArrowDown,
  ShieldCheck,
  Truck,
  RotateCcw,
  PhoneCall,
  ChevronRight,
  ChevronLeft,
  Gem,
  ShoppingBag,
  Mail
} from 'lucide-react'

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/free-mode'
import { Navigation, Pagination, FreeMode, Autoplay } from 'swiper/modules'

export interface NewArrivalProps {
  initialProducts?: { data: NewProductProps[] };
}

const NewArrival: React.FC<NewArrivalProps> = ({ initialProducts }) => {
  const swiperRef = useRef<any>(null);

  const {
    data: allproducts = initialProducts || { data: [] },
    isLoading: isLoadingProducts,
  } = useQuery<{ data: NewProductProps[] }>({
    queryKey: ["new-arrivals"],
    queryFn: getAllNewArrivalProducts,
    initialData: initialProducts,
    staleTime: 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const productsList = allproducts?.data || [];

  const scrollToSlider = () => {
    const el = document.getElementById('collection-slider');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="w-full bg-[#FCFCFC] text-slate-900 overflow-x-hidden font-sans selection:bg-black selection:text-white">
      {/* 1. Ultra-Luxury Hero Section */}
      <section className="relative w-full min-h-[75vh] sm:min-h-[85vh] lg:min-h-[92vh] flex items-center justify-center overflow-hidden bg-black text-white px-3 sm:px-6">
        {/* Background Image with Cinematic Luxury Grading */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/luxury_editorial_hero.png"
            alt="Markline Luxury High-Fashion Campaign"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-65 scale-105 transition-transform duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/65" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/20 to-black/80" />
        </div>

        {/* Hero Editorial Content */}
        <div className="relative z-10 text-center max-w-5xl mx-auto flex flex-col items-center pt-12 pb-10 sm:pt-16 sm:pb-14">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-[11px] sm:text-xs md:text-sm tracking-wide text-white/90 mb-3 sm:mb-6 font-medium"
          >
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-300 animate-pulse" />
            <span>Markline Atelier • 2026 Collection</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl xs:text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-white tracking-tight leading-[0.94] mb-3 sm:mb-6 drop-shadow-2xl"
          >
            The New <br />
            <span className="font-light italic tracking-normal font-serif text-slate-200">
              Arrivals
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-xs sm:text-sm md:text-base lg:text-lg text-white/80 max-w-xl sm:max-w-2xl font-light tracking-wide leading-relaxed mb-6 sm:mb-10 px-2"
          >
            Where avant-garde Italian minimalism meets bespoke artisan footwear. Sculpted lines, ergonomic dual-density footbeds, and timeless silhouette precision.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 w-full sm:w-auto px-4 sm:px-0"
          >
            <button
              onClick={scrollToSlider}
              className="w-full sm:w-auto px-6 sm:px-10 py-3 sm:py-4 bg-white text-black text-xs sm:text-sm font-semibold tracking-wide hover:bg-black hover:text-white border border-white transition-all duration-300 shadow-2xl hover:scale-105 active:scale-95 cursor-pointer text-center rounded-sm"
            >
              Explore New Drops
            </button>

            <a
              href="#editorial-story"
              className="w-full sm:w-auto px-6 sm:px-10 py-3 sm:py-4 bg-transparent text-white text-xs sm:text-sm font-medium tracking-wide border border-white/40 hover:border-white hover:bg-white/10 transition-all duration-300 backdrop-blur-sm text-center rounded-sm"
            >
              The Lookbook
            </a>
          </motion.div>
        </div>

        {/* Floating Scroll Indicator */}
        <button
          onClick={scrollToSlider}
          className="absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-10 text-white/60 hover:text-white flex flex-col items-center gap-1 sm:gap-1.5 transition-colors group cursor-pointer"
        >
          <span className="text-[10px] tracking-wider font-medium">Scroll</span>
          <ArrowDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-bounce group-hover:text-amber-300" />
        </button>
      </section>

      {/* 2. Luxury Service Highlights Ticker */}
      <div className="w-full bg-slate-900 text-white border-y border-slate-800 py-3 sm:py-4 px-2 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 text-center text-[11px] sm:text-xs md:text-sm font-medium tracking-wide">
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-slate-300 p-1">
            <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
            <span className="truncate">2-Day Priority Dispatch</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-slate-300 p-1">
            <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
            <span className="truncate">100% Handcrafted Quality</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-slate-300 p-1">
            <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
            <span className="truncate">7-Day Easy Exchange</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-slate-300 p-1">
            <Gem className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
            <span className="truncate">Ergonomic Comfort Soles</span>
          </div>
        </div>
      </div>

      {/* 3. Editorial Campaign Story Spotlight */}
      <section id="editorial-story" className="w-full py-10 sm:py-16 lg:py-28 px-3 sm:px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 lg:gap-16 items-center">
          {/* Left: Luxury Editorial Visual */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full h-[260px] xs:h-[320px] sm:h-[400px] md:h-[480px] lg:h-[560px] xl:h-[620px] rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border border-slate-200 group bg-slate-100"
          >
            <Image
              src="/luxury_editorial_duo.png"
              alt="Markline Spring Summer Runway Editorial"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-top transition-transform duration-1000 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-90" />
            
            <div className="absolute bottom-3 sm:bottom-6 left-3 sm:left-6 right-3 sm:right-6 text-white">
              <span className="inline-block px-2.5 sm:px-3 py-0.5 sm:py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] sm:text-xs tracking-wide font-medium mb-1 sm:mb-2">
                Look 01 • Sculptural Mules & Stilettos
              </span>
              <h4 className="text-sm sm:text-xl md:text-2xl font-bold tracking-tight font-serif italic">
                Contemporary Architecture in Footwear
              </h4>
            </div>
          </motion.div>

          {/* Right: Editorial Narrative */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-3 sm:gap-6 lg:gap-8"
          >
            <div className="flex items-center gap-2 text-xs tracking-wide font-semibold text-amber-700">
              <span className="w-6 sm:w-8 h-px bg-amber-700"></span>
              <span>The Atelier Narrative</span>
            </div>

            <h2 className="text-xl xs:text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-[1.1]">
              Sculpted Form, <br />
              <span className="font-serif italic font-normal text-slate-700">
                Uncompromising Comfort
              </span>
            </h2>

            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-slate-600 font-light leading-relaxed">
              Every creation in Markline&apos;s new arrivals collection embodies a dialogue between minimalist geometry and everyday luxury. Designed for effortless transitions from dayboardrooms to evening soirees, each pair features our signature dual-density memory cushioning wrapped in supple, cruelty-free leather.
            </p>

            {/* Quality Attribute Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4 pt-1 sm:pt-2">
              <div className="p-3 sm:p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                <span className="text-xs font-semibold text-slate-400 block mb-0.5 sm:mb-1">
                  Crafted Materials
                </span>
                <p className="text-xs sm:text-sm font-semibold text-slate-800">
                  Premium Supple Vegan Leather & Rich Gold Accents
                </p>
              </div>

              <div className="p-3 sm:p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                <span className="text-xs font-semibold text-slate-400 block mb-0.5 sm:mb-1">
                  Ergonomics
                </span>
                <p className="text-xs sm:text-sm font-semibold text-slate-800">
                  Arch-Contoured Footbeds with Zero Break-in Period
                </p>
              </div>
            </div>

            <div className="pt-1 sm:pt-2">
              <button
                onClick={scrollToSlider}
                className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold tracking-wide text-slate-900 border-b-2 border-slate-900 pb-0.5 sm:pb-1 hover:text-amber-700 hover:border-amber-700 transition-colors cursor-pointer"
              >
                <span>Shop New Arrivals</span>
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. Product Collection Slider (Swiper) */}
      <section id="collection-slider" className="w-full pt-6 sm:pt-10 pb-12 sm:pb-20 lg:pb-28 px-3 sm:px-6 lg:px-12 max-w-7xl mx-auto scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 border-b border-slate-200 pb-3 sm:pb-6 mb-4 sm:mb-8">
          <div>
            <span className="text-xs font-semibold text-amber-700 block mb-0.5 sm:mb-1">
              Seasonal Capsule Drop
            </span>
            <h3 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">
              Curated New Arrivals
            </h3>
          </div>

          {/* Navigation Controls & Product Count */}
          <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4 w-full sm:w-auto">
            <div className="text-[11px] sm:text-sm text-slate-500 font-medium">
              Showing <strong className="text-slate-900 font-bold">{productsList.length}</strong> creations
            </div>

            {/* Slider Navigation Arrows */}
            {productsList.length > 0 && (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={() => swiperRef.current?.slidePrev()}
                  aria-label="Previous Slide"
                  className="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border border-slate-300 bg-white hover:bg-slate-900 hover:text-white hover:border-slate-900 text-slate-700 flex items-center justify-center transition-all duration-300 shadow-sm cursor-pointer active:scale-90"
                >
                  <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                </button>
                <button
                  onClick={() => swiperRef.current?.slideNext()}
                  aria-label="Next Slide"
                  className="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border border-slate-300 bg-white hover:bg-slate-900 hover:text-white hover:border-slate-900 text-slate-700 flex items-center justify-center transition-all duration-300 shadow-sm cursor-pointer active:scale-90"
                >
                  <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Swiper Product Carousel */}
        {isLoadingProducts ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-6">
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
          </div>
        ) : productsList.length > 0 ? (
          <div className="w-full relative">
            <Swiper
              onBeforeInit={(swiper) => {
                swiperRef.current = swiper;
              }}
              modules={[Navigation, Pagination, FreeMode, Autoplay]}
              spaceBetween={10}
              slidesPerView={1.2}
              freeMode={true}
              breakpoints={{
                360: {
                  slidesPerView: 1.35,
                  spaceBetween: 12,
                },
                480: {
                  slidesPerView: 1.75,
                  spaceBetween: 14,
                },
                640: {
                  slidesPerView: 2.25,
                  spaceBetween: 16,
                },
                768: {
                  slidesPerView: 3,
                  spaceBetween: 18,
                },
                1024: {
                  slidesPerView: 4,
                  spaceBetween: 22,
                },
                1280: {
                  slidesPerView: 4,
                  spaceBetween: 26,
                },
              }}
              className="mySwiper w-full !pb-3 sm:!pb-6"
            >
              {productsList.map((product: NewProductProps, index: number) => (
                <SwiperSlide key={product.id || index} className="!h-auto">
                  <div className="group relative h-full">
                    <ProductCard
                      className="h-[260px] xs:h-[300px] sm:h-[350px] md:h-[390px] lg:h-[430px]"
                      product={product}
                      url="product"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center w-full py-12 sm:py-20 px-3 text-center bg-white border border-dashed border-slate-200 rounded-xl sm:rounded-3xl">
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-slate-100 flex items-center justify-center mb-2 sm:mb-4 text-slate-400">
              <ShoppingBag className="w-5 h-5 sm:w-7 sm:h-7" />
            </div>
            <h4 className="text-base sm:text-xl font-bold text-slate-900 mb-1">No New Arrivals Found</h4>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md">
              Our atelier is preparing the next runway drops. Products with new arrival status will automatically appear here once released.
            </p>
          </div>
        )}
      </section>

      {/* 5. High-Fashion Craftsmanship & Material Spotlight */}
      <section className="w-full bg-slate-900 text-white py-12 sm:py-20 lg:py-28 px-3 sm:px-6 lg:px-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          <div>
            <span className="text-xs text-amber-400 font-semibold block mb-1.5 sm:mb-2">
              Atelier Craftsmanship
            </span>
            <h2 className="text-xl xs:text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-3 sm:mb-6">
              The Standard of <br />
              <span className="font-serif italic font-normal text-slate-300">
                Precision Handcrafting
              </span>
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-slate-400 font-light leading-relaxed mb-6 sm:mb-8">
              Every single pair undergoes over 40 meticulous stages of manual crafting, from precision laser cutting to multi-layer reinforced sole assembly. We balance high-fashion runway allure with real-world walking resilience.
            </p>

            <div className="space-y-3 sm:space-y-5">
              <div className="flex items-start gap-2.5 sm:gap-4">
                <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/10 text-amber-300 font-bold text-xs sm:text-sm flex items-center justify-center shrink-0">
                  01
                </span>
                <div>
                  <h4 className="font-bold text-white text-xs sm:text-base mb-0.5">Sculpted Weight Distribution</h4>
                  <p className="text-[11px] sm:text-xs md:text-sm text-slate-400 leading-relaxed">
                    Engineered heel geometry that distributes ground reaction force away from the ball of your foot.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 sm:gap-4">
                <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/10 text-amber-300 font-bold text-xs sm:text-sm flex items-center justify-center shrink-0">
                  02
                </span>
                <div>
                  <h4 className="font-bold text-white text-xs sm:text-base mb-0.5">Dual-Layer Memory Cloud Foam</h4>
                  <p className="text-[11px] sm:text-xs md:text-sm text-slate-400 leading-relaxed">
                    Proprietary responsive cushioning that adapts to your unique foot contour for all-day wear.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 sm:gap-4">
                <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/10 text-amber-300 font-bold text-xs sm:text-sm flex items-center justify-center shrink-0">
                  03
                </span>
                <div>
                  <h4 className="font-bold text-white text-xs sm:text-base mb-0.5">Eco-Luxe Vegan Leather</h4>
                  <p className="text-[11px] sm:text-xs md:text-sm text-slate-400 leading-relaxed">
                    High-grade microfiber selected for its buttery hand-feel, water resistance, and sustainable durability.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative w-full h-[220px] xs:h-[280px] sm:h-[380px] md:h-[460px] lg:h-[540px] rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border border-white/10">
            <Image
              src="/luxury_artisan_craft.png"
              alt="Markline Artisan Craftsmanship Details"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* 6. VIP Style Concierge & Fit Consultation Card */}
      <section className="w-full py-10 sm:py-16 lg:py-24 px-3 sm:px-6 max-w-5xl mx-auto">
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-black text-white rounded-xl sm:rounded-3xl p-5 sm:p-10 lg:p-12 shadow-2xl text-center relative overflow-hidden border border-slate-700">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-[10px] sm:text-xs font-medium tracking-wide mb-2 sm:mb-4">
            <PhoneCall className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>Markline Style Concierge</span>
          </div>

          <h3 className="text-lg xs:text-xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-2 sm:mb-4">
            Need Guidance on Size or Styling?
          </h3>
          <p className="text-[11px] sm:text-sm md:text-base text-slate-300 max-w-xl mx-auto font-light leading-relaxed mb-5 sm:mb-8 px-1">
            Our dedicated stylists are available 7 days a week (10:00 AM – 06:00 PM IST) to assist with fit consultations, sizing, and personalized fashion pairing.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-4 w-full sm:w-auto">
            <Link
              href="tel:+919703456322"
              className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 bg-white text-slate-900 rounded-full text-xs sm:text-sm font-semibold tracking-wide hover:bg-amber-300 transition-colors text-center shadow-lg"
            >
              Call +91 9703456322
            </Link>
            <Link
              href="tel:+919769020660"
              className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 bg-slate-800 text-white border border-slate-600 rounded-full text-xs sm:text-sm font-semibold tracking-wide hover:bg-slate-700 transition-colors text-center"
            >
              Call +91 9769020660
            </Link>
            <Link
              href="mailto:stylemarkline@gmail.com"
              className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 bg-transparent text-white border border-white/40 rounded-full text-xs sm:text-sm font-semibold tracking-wide hover:bg-white/10 transition-colors text-center inline-flex items-center justify-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email Stylist</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default NewArrival;