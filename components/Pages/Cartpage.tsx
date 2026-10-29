'use client';

import React from 'react';
import CartSection from '../Common/CartSection';
import CarouselProduct from '../Product/CarouselProduct';
import { NewProductProps } from '@/types/interfaces';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

interface CartpageProps {
  suggestedProducts?: NewProductProps[];
}

function Cartpage({ suggestedProducts = [] }: CartpageProps) {
  return (
    <div className="w-full flex flex-col gap-12 pb-16">
      <CartSection />

      {/* Server-Prefetched Cross-Sell Recommendations */}
      {suggestedProducts && suggestedProducts.length > 0 && (
        <section className="w-full container mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500" />
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                You May Also Like
              </h2>
            </div>
            <Link
              href="/products/women"
              className="text-xs sm:text-sm font-semibold text-primary hover:text-black flex items-center gap-1 group transition-colors"
            >
              <span>Explore All</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="w-full overflow-hidden">
            <CarouselProduct url="product" product={suggestedProducts} />
          </div>
        </section>
      )}
    </div>
  );
}

export default Cartpage;