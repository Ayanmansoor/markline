import React from 'react';
import AboutUsPage from '@/components/About/AboutPage';
export const dynamic = 'force-dynamic';

export const metadata = {
  title: "About Markline | Premium & Comfortable Women's Footwear India",
  description:
    "Learn how Markline is redefining Indian women's footwear by merging modern design with 3mm memory foam comfort. Discover our mission to provide handcrafted, premium quality shoes for the contemporary woman.",
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  openGraph: {
    title: "About Markline | Premium & Comfortable Women's Footwear India",
    description:
      "Learn how Markline is redefining Indian women's footwear by merging modern design with 3mm memory foam comfort. Discover our mission to provide handcrafted, premium quality shoes for the contemporary woman.",
    url: "https://shopmarkline.in/about-us",
  },
  alternates: {
    canonical: `https://shopmarkline.in/about-us`,
  },
};


export default async function AboutUsPageWrapper() {


  return <AboutUsPage />;
}
