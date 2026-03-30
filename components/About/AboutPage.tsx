'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { useQuery } from 'react-query';
import { getAllProductsWithVariants } from '@/Supabase/SupabaseApi';
import CategoriesSection from '../Common/CategoriesSection';
import CarouselProduct from '../Product/CarouselProduct';
import { NewProductProps } from '@/types/interfaces';
import ProductCardSkeleton from '../Skeleton/ProductCardSkeleton';

const JourneySection = ({
  title,
  subtitle,
  content,
  image,
  video,
  reversed = false
}: {
  title: string,
  subtitle: string,
  content: string,
  image?: string,
  video?: string,
  reversed?: boolean
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`flex flex-col ${reversed ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-10 lg:gap-20 py-16 lg:py-24 border-b border-gray-100 last:border-0`}
    >
      {/* Visual Content */}
      <div className="w-full md:w-1/2 relative h-[400px] lg:h-[550px] overflow-hidden rounded-2xl group text-primary">
        {video ? (
          <video
            autoPlay
            muted
            loop
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          >
            <source src={video} type="video/mp4" />
          </video>
        ) : (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        )}
        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-300" />
      </div>

      {/* Text Content */}
      <div className="w-full md:w-1/2 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <span className="text-secondary tracking-[0.3em] uppercase text-sm font-semibold">{subtitle}</span>
          <h2 className="text-3xl lg:text-5xl font-semibold text-primary leading-tight">{title}</h2>
        </div>
        <p className="text-lg text-gray-500 leading-relaxed font-light">
          {content}
        </p>
      </div>
    </motion.div>
  )
}

function AboutUsPage() {
  const {
    data: allproducts = { data: [] },
    isLoading: isLoadingProducts,
  } = useQuery<{ data: NewProductProps[] }>({
    queryKey: ["products"],
    queryFn: getAllProductsWithVariants,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return (
    <main className="w-full bg-white">
      {/* Hero Section */}
      <section className="w-full min-h-[60vh] flex flex-col items-center justify-center text-center px-5 lg:px-20 pt-32 pb-20 bg-[#F9F9F9]">
        <motion.span
          initial={{ opacity: 0, letterSpacing: "1em" }}
          animate={{ opacity: 1, letterSpacing: "0.5em" }}
          transition={{ duration: 1.5 }}
          className="text-secondary uppercase text-sm font-bold text-primary mb-6 block"
        >
          Since 1998
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-5xl md:text-7xl lg:text-9xl font-bold text-primary mb-10 tracking-tighter"
        >
          MARKLINE
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="max-w-2xl text-lg md:text-xl text-gray-600 font-light leading-relaxed"
        >
          Redefining every step you take through a blend of timeless elegance and modern everyday comfort.
        </motion.p>
      </section>

      {/* Journey Zig-Zag */}
      <section className="max-w-7xl mx-auto px-5 lg:px-10 overflow-hidden">
        <JourneySection
          subtitle="Our Roots"
          title="The Mumbai Beginning"
          content="Founded in 1998 in the heart of Mumbai, Markline began as a small, passionate venture driven by a simple but bold vision: to redefine the everyday footwear experience. What started in a humble studio has evolved into a nationwide movement, staying true to our roots while constantly innovating for the future."
          image="/about-image.png"
        />

        <JourneySection
          subtitle="The Vision"
          title="Bridging the Gap"
          content="We saw a world where style usually came at the cost of wearability. Markline was created to bridge that divide—offering footwear that doesn't just follow trends but elevates them. Every pair is meticulously designed to offer premium luxury aesthetics alongside the comfort you count on for your everyday hustle."
          image="/markline-checkout-logo.png"
          reversed
        />

        <JourneySection
          subtitle="Movement"
          title="Mark Your Way"
          content="Markline is more than a footwear brand—it's a statement of individuality. Our collections are designed for the modern lifestyle: versatile enough for city streets, boardrooms, or weekend escapes. We empower you to walk your own path with purpose, offering the confidence to stand out and the comfort to keep moving."
          image="/collectionsection.png"
        />

        <JourneySection
          subtitle="Craftsmanship"
          title="Quality Without Compromise"
          content="Every Markline shoe is a reflection of our commitment to responsible craftsmanship. From refined finishes to breathable materials, we take a forward-thinking approach to fashion. Design with soul, comfort you can feel, and quality that lasts—that is the Markline promise."
          video="about-video.mp4"
          reversed
        />
      </section>

      {/* Vision & Mission Grid */}
      <section className="w-full bg-secondary py-24 px-5 lg:px-20 text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-32">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-6"
          >
            <h3 className="text-3xl font-bold italic tracking-wider text-primary">Our Vision</h3>
            <p className="text-lg opacity-80 font-light leading-relaxed text-primary">
              To craft high-quality, stylish, and comfortable footwear that empowers individuals to express their identity. We are committed to delivering timeless designs, embracing sustainability, and staying rooted in the evolving needs of our customers across the globe.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-6"
          >
            <h3 className="text-3xl font-bold italic tracking-wider text-primary">Our Mission</h3>
            <p className="text-lg opacity-80 font-light leading-relaxed text-primary">
              We craft premium footwear that empowers every individual to express themselves with confidence. We&apos;re committed to timeless design, sustainable choices, and staying in tune with the ever-evolving lives of our customers, ensuring every step is a statement.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <div className="py-20 bg-white">
        {isLoadingProducts ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 max-w-7xl mx-auto px-5 lg:px-10">
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
          </div>
        ) : (
          allproducts?.data.length > 0 && (
            <div className="max-w-7xl mx-auto">
              <CategoriesSection title="Experience Markline" url="" >
                <CarouselProduct
                  product={allproducts.data}
                  url="product"
                  css="sm:max-w-[500px]"
                  productsCardCss="h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px]"
                />
              </CategoriesSection>
            </div>
          )
        )}
      </div>

      {/* Quote / Footer Statement */}
      <section className="w-full py-32 text-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="max-w-4xl mx-auto px-5"
        >
          <p className="text-2xl md:text-4xl font-semibold text-primary leading-tight">
            At Markline, we don&apos;t just make shoes — we help you <span className="italic border-b-2 border-secondary">mark your way.</span>
          </p>
        </motion.div>
      </section>
    </main>
  )
}

export default AboutUsPage