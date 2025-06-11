import React from 'react'
import ProductPage from '@/components/Pages/Product.page'

import { getProductData } from '@/Supabase/SupabaseApi';
import Productspage from '@/components/Products/Products.page';
import { mergeMetadata } from '@/app/layout';

// export async function generateMetadata({ params }) {
//   const product = await getProductData(params.slug);
//   const productName = product.name || "Product";
//   const description = product.seoDescription || product.description || "Discover elegant women's accessories at Markline Fashion.";
//   const imageUrl = JSON.parse(product.image_url?.[0] || '{}')?.image_url || "https://marklinefashion.com/default.jpg";

//   return {
//     title: `${productName} | Markline Fashion`,
//     description,
//     keywords: ["Markline Fashion", productName, "Women's Fashion", "Toe Ring", "Gold Jewelry"],
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






export async function generateMetadata({ params }) {
  const slug = params.slug;

  return mergeMetadata({
    title: "Footwear for Men, Women & Kids – Shop Stylish Shoes Online in India | Markline Fashion",
    description:
      "Explore the latest in men’s, kids’, and women’s footwear online in India. Shop trendy casuals, formals, wedding shoes & more at Markline Fashion.",
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
    openGraph: {
      title: "Footwear for Men, Women & Kids – Shop Stylish Shoes Online in India | Markline Fashion",
      description:
        "Explore the latest in men’s, kids’, and women’s footwear online in India. Shop trendy casuals, formals, wedding shoes & more at Markline Fashion.",
      type: "website",
      url: `https://marklinefashion.vercel.app/products/${slug}`,
    },
    alternates: {
      canonical: `https://marklinefashion.vercel.app/products/${slug}`,
    },
  });
}


function page() {
  return (
    <>
      <Productspage />
    </>
  )
}

export default page