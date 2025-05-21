import React from 'react'
import ProductPage from '@/components/Pages/Product.page'

import { getProductData } from '@/Supabase/SupabaseApi';

export async function generateMetadata({ params }) {
  const product = await getProductData(params.slug);
  const productName = product.name || "Product";
  const description = product.seoDescription || product.description || "Discover elegant women's accessories at Markline Fashion.";
  const imageUrl = JSON.parse(product.image_url?.[0] || '{}')?.image_url || "https://marklinefashion.com/default.jpg";

  return {
    title: `${productName} | Markline Fashion`,
    description,
    keywords: ["Markline Fashion", productName, "Women's Fashion", "Toe Ring", "Gold Jewelry"],
    openGraph: {
      title: productName,
      description,
      url: `https://marklinefashion.vercel.app/products/${params.slug}`,
      images: [
        {
          url: imageUrl,
          alt: productName,
        },
      ],
    },
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
    twitter: {
      card: "summary_large_image",
      title: productName,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: `https://marklinefashion.vercel.app/products/${params.slug}`,
    },
  };
}


function page() {
  return (
    <>
    <ProductPage/>
    </>
  )
}

export default page