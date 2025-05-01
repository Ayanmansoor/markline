import React from 'react'
import AboutUsPage from '@/components/About/AboutPage'
import { mergeMetadata } from '@/app/layout';
export const metadata = mergeMetadata({
  title: "About Us | Markline Fashion – Redefining Elegance",
  description:
    "Learn more about Markline Fashion – a luxury brand dedicated to crafting premium shoes, bags, and accessories with timeless design and impeccable quality.",
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  openGraph: {
    title: "About Us | Markline Fashion – Redefining Elegance",
    description:
      "Markline Fashion blends tradition with modern luxury. Discover our journey, vision, and passion for creating high-end fashion pieces.",
    url: "https://marklinefashion.com/about",
  },
  alternates: {
    canonical: `https://marklinefashion.com/about`,
  },
});
function page() {
  return (
    <AboutUsPage />
  )
}

export default page