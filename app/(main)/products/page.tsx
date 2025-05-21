import React from 'react'
import Productspage from '@/components/Products/Products.page'
import { mergeMetadata } from '@/app/layout';
import L2Banner from '@/components/Common/L2Banner';
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
    url: "https://marklinefashion.vercel.app/products",
  },
  alternates: {
    canonical: `https://marklinefashion.vercel.app/products`,
  },
});
function page() {
  return (
    <>
      <Productspage />
    </>
  )
}

export default page