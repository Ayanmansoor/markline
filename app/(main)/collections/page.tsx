import { mergeMetadata } from '@/app/layout';
import CollcetionPage from '@/components/Collections/Collection.page'
import { mysupabase } from '@/Supabase/SupabaseConfig';
import React from 'react'
export const metadata = mergeMetadata(
  { 
    title: "Women’s Footwear Collections | Wedges, Heels & Sandals – Markline",
    keywords: ["women footwear collections", "women wedges", "block heels for women", "pencil heels for women", "kitten heels for women", "party wear sandals for women", "casual sandals for women", "wedding sandals for women", "festive sandals for women", "platform wedges for women", "comfortable heels for women", "stylish sandals for women", "women footwear online India", "Markline collections",], robots: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1, },
    openGraph: { 
      title: "Women’s Footwear Collections | Wedges, Heels & Sandals – Markline",

    description: "Shop women’s wedges, block heels, pencil heels, kitten heels, party wear sandals, casual sandals, and wedding footwear at Markline.", 
    url: "https://shopmarkline.in/collections", 
  }, 
    alternates: { canonical: "https://shopmarkline.in/collections", }, 
  
  }

);

async function page() {
  // 1. Fetch collection banners
  const { data: collectionBanner } = await mysupabase
    .from("collectionBanner")
    .select("*")
    .limit(3);

  // 2. Fetch all collections
  const { data: collections } = await mysupabase
    .from("collection")
    .select("*")
    .eq("type", "ALL");

  return (
    <>
      <CollcetionPage
        initialBanners={collectionBanner || []}
        initialCollections={{ data: collections || [] }}
      />
    </>
  )
}

export default page