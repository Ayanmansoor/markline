import { mergeMetadata } from '@/app/layout';
import GenderPage from '@/components/gender/GenderPage'
import { getaudience } from '@/Supabase/SupabaseApi';
import { mysupabase } from '@/Supabase/SupabaseConfig';
import { AudienceProps } from '@/types/interfaces';
import React from 'react'


export async function generateMetadata({ params }) {
  const audience: AudienceProps | null = await getaudience(`${params.group}`.toUpperCase());


  const audienceName = audience?.seo_title || "Audience";
  const description =
    audience?.seo_discription ||
    "Explore Markline footwear collections – stylish shoes for men, women & kids.";

  return {
    title: `${audienceName} | Buy Shoes Online India | Markline`,
    description,
    keywords: [
      "Markline", audienceName, "Markline footwear",
      // High Volume India Terms
      "buy shoes online India", "footwear online India", "online shoe shopping India",
      // Women's
      "women's sandals online India", "ladies sandals India", "buy heels online India",
      "platform sandals for women", "block heels women India", "wedge sandals women",
      "mules for women India", "comfortable sandals women", "stylish sandals India",
      "ethnic sandals women", "festive footwear women", "wedding sandals India",
      "office wear sandals women", "women's casual shoes India",
      // Men's
      "men's shoes online India", "men's formal shoes India", "casual shoes men India",
      "loafers for men India", "men's sneakers online India",
      // Kids
      "kids shoes online India", "children's footwear India",
      // Long-tail
      "affordable footwear India", "fashionable shoes India", "fast delivery shoes India",
    ],
    openGraph: {
      title: `${audienceName} | Buy Shoes Online India | Markline`,
      description,
      url: `https://shopmarkline.in/collections/${params.group}`,
      locale: "en_IN",
      type: "website",
      images: [
        {
          url: "/opengraph-image.png",
          width: 1200,
          height: 630,
          alt: audienceName,
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
      title: `${audienceName} | Buy Shoes Online India | Markline`,
      description,
    },
    alternates: {
      canonical: `https://shopmarkline.in/collections/${params?.group}`,
    },
  };
}


async function page({ params }) {
  const { group } = params;
  const gender = `${group}`.toUpperCase();

  // 1. Fetch collections based on gender server-side
  const { data: collections } = await mysupabase
    .from("collection")
    .select("*")
    .eq("gender", gender);

  // 2. Fetch all products for that gender server-side
  const { data: products } = await mysupabase
    .from("product")
    .select("*,brands(*),product_variants(*)")
    .eq("gender", gender);

  return (
    <>
      <GenderPage 
        initialCollections={{ data: collections || [] }} 
        initialProducts={{ data: products || [] }} 
      />
    </>
  )
}

export default page