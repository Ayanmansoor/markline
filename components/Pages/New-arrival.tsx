'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { useQuery } from 'react-query'
import { getAllProductsWithVariants } from '@/Supabase/SupabaseApi'
import ProductCardSkeleton from '../Skeleton/ProductCardSkeleton'
import ProductCard from '../Common/ProductCard'
import { NewProductProps } from '@/types/interfaces'
import Image from 'next/image'

export interface NewArrivalProps {
    initialProducts?: { data: NewProductProps[] };
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const NewArrival: React.FC<NewArrivalProps> = ({ initialProducts }) => {

    const {
        data: allproducts = initialProducts || { data: [] },
        isLoading: isLoadingProducts,
    } = useQuery<{ data: NewProductProps[] }>({
        queryKey: ["products"],
        queryFn: getAllProductsWithVariants,
        initialData: initialProducts,
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });

    return (
        <main className="w-full bg-white overflow-hidden">
            {/* Hero Section - Editorial Campaign */}
            <section className="relative w-full h-[70vh] md:h-[85vh] flex items-center justify-center overflow-hidden bg-black">
                {/* <video
                    autoPlay
                    muted
                    loop
                    className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105"
                >
                    <source src="/advertise-one.mp4" type="video/mp4" />
                </video> */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />

                <div className="relative z-10 text-center px-5 max-w-4xl">
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-white/80 uppercase tracking-[0.4em] text-xs md:text-sm font-bold mb-4"
                    >
                        Spring Summer 2025
                    </motion.p>
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="text-5xl md:text-8xl font-bold text-white mb-8 tracking-tighter"
                    >
                        NEW ARRIVALS
                    </motion.h1>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.6 }}
                    >
                        <button className="px-10 py-4 bg-white text-black text-sm font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors duration-300">
                            Explore Collection
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* Campaign Highlight - Big Image Editorial */}
            <section className="w-full py-20 lg:py-32 px-5 lg:px-20 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative h-[250px] md:h-[300px] lg:h-[500px] 2xl:h-[650px] rounded-sm overflow-hidden shadow-2xl"
                    >
                        <Image
                            src="/jj_ss25_web_03022025.webp"
                            alt="Collection Editorial"
                            fill
                            className="object-cover"
                            priority
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="flex flex-col gap-8"
                    >
                        <span className="text-secondary tracking-[0.3em] font-bold uppercase text-sm">The Season&apos;s Narrative</span>
                        <h2 className="text-4xl md:text-6xl font-semibold text-primary leading-tight">Authenticity in Every Stitch</h2>
                        <p className="text-lg text-gray-500 leading-relaxed font-light">
                            Experience Markline&apos;s latest drops where heritage craftsmanship meets contemporary silhouettes. This season, we focus on tactile textures and refined details that speak to the modern individual. Each piece is meticulously designed to elevate your personal style with distinction.
                        </p>
                        <hr className="w-20 border-t-2 border-secondary" />
                    </motion.div>
                </div>
            </section>

            {/* Product Collection - Boutique Grid */}
            <section className="w-full py-10 pb-20 px-5 lg:px-20 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
                    <div className="flex flex-col gap-2">
                        <span className="text-sm font-bold text-secondary uppercase tracking-widest">Markline Selects</span>
                        <h3 className="text-3xl md:text-5xl font-semibold text-primary">Fresh Picks for You</h3>
                    </div>
                </div>

                {isLoadingProducts ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        <ProductCardSkeleton />
                        <ProductCardSkeleton />
                        <ProductCardSkeleton />
                        <ProductCardSkeleton />
                    </div>
                ) : (
                    allproducts?.data?.length > 0 ? 
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-50px" }}
                            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-12 gap-x-6"
                        >
                            {allproducts?.data?.map((product: NewProductProps, index: number) => (
                                <motion.div key={product.id || index} variants={itemVariants}>
                                    <ProductCard
                                        className="h-[280px] sm:h-[350px] md:h-[400px] lg:h-[450px]"
                                        product={product}
                                        url="product"
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                        :
                        <div className='flex items-center justify-center w-full relative h-[200px]  '>
                            <p className='text-lg font-medium text-primary'>No Products Available</p>
                        </div>
                )}
            </section>

            {/* Quote / Editorial Filler */}
            <section className="bg-gray-50 py-24 text-center">
                <div className="max-w-3xl mx-auto px-5">
                    <h4 className="text-2xl md:text-3xl font-light italic text-gray-600 leading-snug">
                        Elegance is not about being noticed, but about being remembered.
                    </h4>
                </div>
            </section>
        </main>
    )
}

export default NewArrival;