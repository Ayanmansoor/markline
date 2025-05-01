import { mergeMetadata } from '@/app/layout';
import CollcetionPage from '@/components/Collections/Collection.page'
import React from 'react'
export const metadata = mergeMetadata({
  title: "Collections | Markline Fashion – Curated Luxury Pieces & Seasonal Must-Haves",
  description:
    "Discover curated collections from Markline Fashion featuring seasonal must-haves, signature styles, and luxury pieces that define elegance and sophistication.",
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  openGraph: {
    title: "Collections | Markline Fashion – Curated Luxury Pieces & Seasonal Must-Haves",
    description:
      "Explore Markline Fashion’s exclusive collections of premium fashion essentials. From timeless classics to seasonal trends, elevate your wardrobe today.",
    url: "https://marklinefashion.com/collections",
  },
  alternates: {
    canonical: "https://marklinefashion.com/collections",
  },
});

function page() {
  return (
    <>
      <CollcetionPage />
    </>
  )
}

export default page