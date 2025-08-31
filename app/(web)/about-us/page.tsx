import React from 'react';
import AboutUsPage from '@/components/About/AboutPage';
export const dynamic = 'force-dynamic';

export const metadata = {
  title: "About Us | Markline Footwear – Shoes for Men, Women & Kids",
  description:
    "Markline is India’s fashionable footwear brand offering premium shoes for men, stylish ladies shoes, kids shoes, sandals, heels, bridal shoes & more.",
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  openGraph: {
    title: "About Us | Markline Footwear – Shoes for Men, Women & Kids",
    description:
      "Discover Markline – redefining footwear fashion in India with stylish shoes for men, ladies shoes, kids shoes, sandals for women, bridal shoes & white heels.",
    url: "https://shopmarkline.in/about-us",
  },
  alternates: {
    canonical: `https://shopmarkline.in/about-us`,
  },
};


export default async function AboutUsPageWrapper() {


  return <AboutUsPage />;
}
