import React from 'react'
import Occasions from '@/components/Pages/Occasions'
import { getAllCollectionsBaseOnType, getCollectionBaseOnTypeAndOccuation } from '@/Supabase/SupabaseApi';
export async function generateMetadata({ params }) {
  const occasiondata: any[] | null | Error = await getAllCollectionsBaseOnType('occasion', params.collection);

  if (occasiondata instanceof Error) {
    return {
      title: "Collections | Markline",
      description: "Explore our latest footwear collections for men, women, and kids at Markline.",
    };
  }
  const currentCollection = occasiondata?.find(
    (c) => c.slug === params.collection
  );

  if (!currentCollection) {
    return {
      title: "Collections | Markline",
      description:
        "Explore our latest footwear collections for men, women, and kids at Markline.",
    };
  }

  const collectionName =
    currentCollection?.seoTitle?.trim() ||
    currentCollection?.name ||
    "Collection";

  const description =
    currentCollection?.seoDescription?.trim() ||
    `Shop ${currentCollection?.name || "our footwear"
    } at Markline – stylish options for men, women & kids.`;

  // ✅ Ensure only valid image objects
  const ogImages =
    currentCollection?.image_urls
      ?.map((img: string) => {
        try {
          const parsed = JSON.parse(img);
          if (parsed?.image_url && typeof parsed.image_url === "string") {
            return {
              url: parsed.image_url,
              alt: currentCollection?.name || "Markline",
            };
          }
          return null;
        } catch {
          return null;
        }
      })
      .filter((img) => img !== null) || [];

  return {
    title: `${collectionName} | Markline`,
    description,
    keywords: [
      "Markline",
      currentCollection?.name,
      "Men's Footwear",
      "Women's Footwear",
      "Kids Shoes",
      "Sandals",
      "Heels",
      "Casual Shoes",
      "Mules",
    ],
    openGraph: {
      title: `${collectionName} | Markline`,
      description,
      url: `https://shopmarkline.in/shop-by/occasion/${params.collection}`,
      images: ogImages, // ✅ only valid objects
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
      title: `${collectionName} | Markline`,
      description,
    },
    alternates: {
      canonical: `https://shopmarkline.in/shop-by/occasion/${params.collection}`,
    },
  };
}


function page() {
  return (
    <Occasions />
  )
}

export default page