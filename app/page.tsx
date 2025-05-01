
import Image from "next/image";
import HomePage from "@/components/Pages/Home.page";
import { mergeMetadata } from "./layout";


export const metadata = mergeMetadata({
  title: "Markline Fashion | Premium Shoes, Bags & Accessories",
  description:
    "Discover luxury with Markline Fashion. Shop premium shoes, bags, and accessories that blend elegance with comfort. Redefine your fashion statement today.",
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  openGraph: {
    title: "Markline Fashion | Premium Shoes, Bags & Accessories",
    description:
      "Explore timeless elegance with Markline Fashion. From high-end footwear to luxury bags, elevate your style with every step.",
    url: "https://marklinefashion.com",
  },
  alternates: {
    canonical: `https://marklinefashion.com`,
  },
});


export default function Home() {
  return (
    <>
      <HomePage />
    </>
  );
}
