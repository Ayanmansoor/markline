import React from 'react'
import CategoryL2page from '@/components/Collection/CollectionPage'
import { getcollection } from '@/Supabase/SupabaseApi';
import GenderPage from '@/components/gender/GenderPage';
import { mergeMetadata } from '@/app/layout';



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
      url: `https://marklinefashion.vercel.app/gender/${slug}`,
    },
    alternates: {
      canonical: `https://marklinefashion.vercel.app/gender/${slug}`,
    },
  });
}

function Collection() {
  return (
    <>
     
      <GenderPage />
    </>
  )
}

export default Collection