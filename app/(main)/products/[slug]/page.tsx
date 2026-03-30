import React from "react";

import { getaudience } from "@/Supabase/SupabaseApi";
import Productspage from "@/components/Products/Products.page";
import { mysupabase } from "@/Supabase/SupabaseConfig";

import { AudienceProps } from "@/types/interfaces";

export async function generateMetadata({ params }) {
  const audience: AudienceProps | null = await getaudience(
    `${params.slug}`.toUpperCase()
  );

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
      url: `https://shopmarkline.in/products/${params.slug}`,
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
      canonical: `https://shopmarkline.in/products/${params?.slug}`,
    },
  };
}

async function page({ params }) {
  const { slug } = params;

  // 1. Fetch products server-side
  const { data: allproducts } = await mysupabase
    .from("product")
    .select("*,brands(*),product_variants(*)");

  // 2. Fetch all collections
  const { data: allcollection } = await mysupabase
    .from("collection")
    .select("*")
    .eq("type", "ALL");

  return (
    <>
      <Productspage 
        initialProducts={{ data: allproducts || [] }} 
        initialCollections={{ data: allcollection || [] }} 
      />
    </>
  );
}

export default page;
