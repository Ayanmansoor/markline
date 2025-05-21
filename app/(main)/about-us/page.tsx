import React from 'react';
import AboutUsPage from '@/components/About/AboutPage';
import { getAllProducts } from '@/Supabase/SupabaseApi';

export const dynamic = 'force-dynamic'; // optional for always-updated data

export const metadata = {
  title: "About Us | Markline Fashion – Redefining Elegance",
  description:
    "Learn more about Markline Fashion – a luxury brand dedicated to crafting premium shoes, bags, and accessories with timeless design and impeccable quality.",
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  openGraph: {
    title: "About Us | Markline Fashion – Redefining Elegance",
    description:
      "Markline Fashion blends tradition with modern luxury. Discover our journey, vision, and passion for creating high-end fashion pieces.",
    url: "https://marklinefashion.vercel.app/about",
  },
  alternates: {
    canonical: `https://marklinefashion.vercel.app/about`,
  },
};

export default async function AboutUsPageWrapper() {
  const allproducts = await getAllProducts();
  if (allproducts instanceof Error) {
    console.error("Failed to load products:", allproducts.message);
    return <AboutUsPage allproducts={[]} />;
  }

  return <AboutUsPage allproducts={allproducts} />;
}
