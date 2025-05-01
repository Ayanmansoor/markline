import React from 'react'
import TrendingPage from '@/components/Pages/Trending.page'
import { mergeMetadata } from '@/app/layout';
export const metadata = mergeMetadata({
  title: "Shop Products | Markline Fashion",
  description:
    "Explore our premium collection of fashion-forward products at Markline Fashion. Discover elegant shoes, bags, and more crafted for modern style.",
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  openGraph: {
    title: "Shop Products | Markline Fashion",
    description:
      "Browse the full range of Markline Fashion products. From stylish footwear to luxury accessories — find your next statement piece.",
    url: "https://marklinefashion.com/products",
  },
  alternates: {
    canonical: `https://marklinefashion.com/products`,
  },
});
function page() {
  return (
    <>
        <TrendingPage/>
    </>
  )
}

export default page