import React from 'react';
import Cartpage from '@/components/Pages/Cartpage';
import { getAllProductsWithVariants } from '@/Supabase/SupabaseApi';
import { NewProductProps } from '@/types/interfaces';

export const metadata = {
  title: "Cart | Markline",
  description: "Review your shopping cart and proceed to checkout securely at Markline.",
  robots: {
    index: false,
    follow: false,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  openGraph: {
    title: "Cart | Markline",
    description: "Review your shopping cart and proceed to checkout securely at Markline.",
    url: "https://shopmarkline.in/carts",
  },
  alternates: {
    canonical: "https://shopmarkline.in/carts",
  },
};

export default async function Page() {
  let suggestedProducts: NewProductProps[] = [];

  try {
    const res = await getAllProductsWithVariants();
    suggestedProducts = (res?.data || []).slice(0, 10);
  } catch (err) {
    console.error("Error prefetching cart recommendations on server:", err);
  }

  return <Cartpage suggestedProducts={suggestedProducts} />;
}