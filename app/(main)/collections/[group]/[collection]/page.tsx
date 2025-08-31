import CategoryL2page from '@/components/Collection/CollectionPage'
import { getAllCollectionsBaseOnGender } from '@/Supabase/SupabaseApi';
import React from 'react'
export async function generateMetadata({ params }) {
  const collections: any[] | Error | null = await getAllCollectionsBaseOnGender(params.group);

  if (collections instanceof Error || !collections) {
    return {
      title: "Collections | Markline",
      description: "Explore our latest footwear collections for men, women, and kids at Markline.",
    };
  }

  const currentCollection = collections.find((c: any) => c.slug === params.group);

  if (!currentCollection) {
    return {
      title: "Collections | Markline",
      description: "Explore our latest footwear collections for men, women, and kids at Markline.",
    };
  }

  const collectionName =
    currentCollection?.seoTitle?.trim() ||
    currentCollection?.name ||
    "Collection";

  const description =
    currentCollection?.seoDescription?.trim() ||
    `Shop ${currentCollection?.name || "our footwear"} at Markline – stylish options for men, women & kids.`;

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
      url: `https://shopmarkline.in/collection/${params.group}`,
      images: currentCollection?.image_urls?.map((img: string) => {
        try {
          const parsed = JSON.parse(img);
          return {
            url: parsed.image_url,
            alt: currentCollection?.name,
          };
        } catch {
          return null;
        }
      }).filter(Boolean),
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
      canonical: `https://shopmarkline.in/collection/${params?.group}`,
    },
  };
}


function page() {
  return (
    <CategoryL2page />
  )
}

export default page