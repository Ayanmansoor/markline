import { mergeMetadata } from '@/app/layout';
import NewArrival from '@/components/Pages/New-arrival'
import React from 'react'
// import NewArrival from '@/components/Pages/new-arrival'


export const metadata = mergeMetadata({
  title: "New Arrivals | Markline – Latest Men, Women & Kids Footwear",
  description:
    "Shop new arrivals at Markline – discover the latest footwear trends in men’s shoes, women’s heels, sandals, mules & stylish kids shoes. Fresh styles every season.",
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  openGraph: {
    title: "New Arrivals | Markline – Latest Men, Women & Kids Footwear",
    description:
      "Explore Markline’s new arrivals – stylish men’s shoes, elegant women’s heels, trendy sandals, chic mules & comfortable kids shoes. Shop the latest footwear today.",
    url: "https://shopmarkline.in/new-arrivals",
  },
  alternates: {
    canonical: "https://shopmarkline.in/new-arrivals",
  },
});


function page() {
  return (
    <NewArrival />
  )
}

export default page