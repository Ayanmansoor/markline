
import React from 'react'
import TrendingPage from '@/components/Pages/Trending.page'
import { mergeMetadata } from '@/app/layout';
export const metadata = mergeMetadata({
  title: "Shop Products | Markline",
  description:
    "Explore our premium collection of fashion-forward products at Markline. Discover elegant shoes, bags, and more crafted for modern style.",
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  openGraph: {
    title: "Shop Products | Markline",
    description:
      "Browse the full range of Markline products. From stylish footwear to luxury accessories — find your next statement piece.",
    url: "https://shopmarkline.in/products",
  },
  alternates: {
    canonical: `https://shopmarkline.in/products`,
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