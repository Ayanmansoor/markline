
import Image from "next/image";
import HomePage from "@/components/Pages/Home.page";
import { mergeMetadata } from "./layout";


export const metadata = mergeMetadata({
  title: "Buy Women's & Kids' Footwear Online in India | Markline Fashion",
  description:
    "Explore stylish women's and kids' footwear at Markline Fashion. Shop sandals, heels, sneakers & more online. Shipping across India",
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  openGraph: {
    title: "Buy Women's & Kids' Footwear Online in India | Markline Fashion",
    description:
      "Explore stylish women's and kids' footwear at Markline Fashion. Shop sandals, heels, sneakers & more online.  Shipping across India",
    url: "https://marklinefashion.vercel.app",
  },
  alternates: {
    canonical: "https://marklinefashion.vercel.app",
  },
});


export default function Home() {
  return (
    <>
      <HomePage />
    </>
  );
}
