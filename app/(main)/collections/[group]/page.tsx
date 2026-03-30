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
    title: `${audienceName} | Markline`,
    description,
    keywords: [
      "Markline",
      audienceName,
      "Men's Footwear",
      "Women's Footwear",
      "Kids Shoes",
      "Sandals",
      "Heels",
      "Casual Shoes",
    ],
    openGraph: {
      title: `${audienceName} | Markline`,
      description,
      url: `https://shopmarkline.in/collections/${params.group}`,
      images: [
        {
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
      title: `${audienceName} | Markline`,
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