import { mergeMetadata } from '@/app/layout';
import NewArrival from '@/components/Pages/New-arrival'
import React from 'react'
// import NewArrival from '@/components/Pages/new-arrival'


export const metadata = mergeMetadata({
  title: "New Arrivals | Markline Fashion – Latest in Luxury Footwear & Accessories",
  description:
    "Stay ahead of trends with the latest arrivals at Markline Fashion. Shop fresh styles in premium shoes, bags, and more – just landed.",
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  openGraph: {
    title: "New Arrivals | Markline Fashion – Latest in Luxury Footwear & Accessories",
    description:
      "Explore the newest additions to Markline Fashion’s luxury collection. Discover cutting-edge fashion crafted for elegance and comfort.",
    url: "https://marklinefashion.vercel.app/new-arrivals",
  },
  alternates: {
    canonical: `https://marklinefashion.vercel.app/new-arrivals`,
  },
});
function page() {
  return (
    <NewArrival/>
  )
}

export default page