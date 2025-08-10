import React from 'react';
import AboutUsPage from '@/components/About/AboutPage';

export const dynamic = 'force-dynamic'; // optional for always-updated data

export const metadata = {
  title: "About Us | Markline – Redefining Elegance",
  description:
    "Learn more about Markline – a luxury brand dedicated to crafting premium shoes, bags, and accessories with timeless design and impeccable quality.",
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  openGraph: {
    title: "About Us | Markline – Redefining Elegance",
    description:
      "Markline blends tradition with modern luxury. Discover our journey, vision, and passion for creating high-end fashion pieces.",
    url: "https://marklinefashion.vercel.app/about-us",
  },
  alternates: {
    canonical: `https://marklinefashion.vercel.app/about-us`,
  },
};

export default async function AboutUsPageWrapper() {
  

  return <AboutUsPage  />;
}
