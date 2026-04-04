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
    title: `${audienceName} | Buy Shoes Online in India | Markline`,
    description,
    keywords: [
      "Markline", audienceName, "Markline footwear",
      // High Volume India Terms
      "buy shoes online India", "footwear online India", "online shoe shopping India", "shoe store India",
      // Women's
      "women's sandals online India", "ladies sandals India", "buy heels online India",
      "platform sandals for women", "block heels women India", "wedge sandals women",
      "mules for women India", "comfortable sandals women", "stylish sandals India",
      "open toe heels India", "slip on sandals women", "women's party heels India",
      "ethnic sandals women", "festive footwear women", "wedding sandals India",
      "office wear sandals women", "women's casual shoes India", "daily wear sandals India",
      // Men's
      "men's shoes online India", "men's formal shoes India", "casual shoes men India",
      "loafers for men India", "men's sneakers online India",
      // Kids
      "kids shoes online India", "children's footwear India",
      // Long-tail High Intent
      "affordable footwear India", "fashionable shoes India", "fast delivery shoes India",
      "stylish shoes under 2000 India", "footwear at best price India",
    ],
    openGraph: {
      title: `${audienceName} | Buy Shoes Online in India | Markline`,
      description,
      url: `https://shopmarkline.in/products/${params.slug}`,
      locale: "en_IN",
      type: "website",
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
      title: `${audienceName} | Buy Shoes Online in India | Markline`,
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
