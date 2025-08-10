import React from 'react'
import ProductPage from '@/components/Pages/Product.page'

import { getProductData } from '@/Supabase/SupabaseApi';
import Productspage from '@/components/Products/Products.page';
import { mergeMetadata } from '@/app/layout';

// export async function generateMetadata({ params }) {
//   const product = await getProductData(params.slug);
//   const productName = product.name || "Product";
//   const description = product.seoDescription || product.description || "Discover elegant women's accessories at Markline.";
//   const imageUrl = JSON.parse(product.image_url?.[0] || '{}')?.image_url || "https://marklinefashion.com/default.jpg";

//   return {
//     title: `${productName} | Markline`,
//     description,
//     keywords: ["Markline", productName, "Women's Fashion", "Toe Ring", "Gold Jewelry"],
//     openGraph: {
//       title: productName,
//       description,
//       url: `https://marklinefashion.vercel.app/products/${params.slug}`,
//       images: [
//         {
//           url: imageUrl,
//           alt: productName,
//         },
//       ],
//     },
//     robots: {
//       index: true,
//       follow: true,
//       "max-image-preview": "large",
//       "max-snippet": -1,
//       "max-video-preview": -1,
//     },
//     twitter: {
//       card: "summary_large_image",
//       title: productName,
//       description,
//       images: [imageUrl],
//     },
//     alternates: {
//       canonical: `https://marklinefashion.vercel.app/products/${params.slug}`,
//     },
//   };
// }





// import { Metadata } from "next";

// export async function generateMetadata(
//   { params }: { params: Promise<{ slug: string }> }
// ): Promise<Metadata> {
//   const { slug } = await params;

//   // Map slug to a normalized label
//   const label =
//     slug === "men" ? "Men’s" :
//     slug === "women" ? "Women’s" :
//     slug === "kids" ? "Kids’" :
//     slug;

//   const title = `${label} Footwear Collection for Comfort and Style | Markline`;
//   const description = `Browse Markline's ${label.toLowerCase()} footwear—from sleek sneakers and seasonal sandals to formal wear and casual essentials—crafted with quality, comfort, and everyday style.`;
//   const url = `https://marklinefashion.com/products/${slug}`;

//   return mergeMetadata({
//     title,
//     description,
//     robots: {
//       index: true,
//       follow: true,
//       "max-image-preview": "large",
//       "max-snippet": -1,
//       "max-video-preview": -1,
//     },
//     openGraph: {
//       title,
//       description,
//       type: "website",
//       url,
//     },
//     alternates: {
//       canonical: url,
//     },
//   });
// }



function page() {
  return (
    <>
      <Productspage />
    </>
  )
}

export default page