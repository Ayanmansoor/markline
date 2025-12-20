import React from "react";

import { getaudience } from "@/Supabase/SupabaseApi";
import Productspage from "@/components/Products/Products.page";

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

function page() {
  return (
    <>
      <Productspage />
    </>
  );
}

export default page;
