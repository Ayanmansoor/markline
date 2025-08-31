import { mergeMetadata } from '@/app/layout';
import CollcetionPage from '@/components/Collections/Collection.page'
import React from 'react'
export const metadata = mergeMetadata({
  title: "Collections - Markline – Men, Women & Kids Footwear Online",
  description:
    "Explore all footwear collections at Markline – men’s casual shoes, women’s heels, sandals, mules & trendy kids shoes. Shop stylish & comfortable footwear online.",
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  openGraph: {
    title: "Collections - Markline – Men, Women & Kids Footwear Online",
    description:
      "Discover Markline’s footwear collections – stylish men’s casual shoes, elegant women’s heels, trendy sandals, chic mules & comfortable kids shoes.",
    url: "https://shopmarkline.in/collections",
  },
  alternates: {
    canonical: "https://shopmarkline.in/collections",
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