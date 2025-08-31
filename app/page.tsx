
import HomePage from "@/components/Pages/Home.page";
import { mergeMetadata } from "./layout";


export const metadata = mergeMetadata({
  title: "Buy Shoes Online in India | Sandals, Heels, Mules & Kids Shoes – Markline",
  description:
    "Shop Men’s Shoes, Women’s Sandals, Heels, Mules & Kids Shoes online at Markline. Discover stylish, comfortable & trendy footwear in India with fast delivery.",
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  openGraph: {
    title: "Buy Shoes Online in India | Sandals, Heels, Mules & Kids Shoes – Markline",
    description:
      "Shop Men’s Shoes, Women’s Sandals, Heels, Mules & Kids Shoes online at Markline. Discover stylish, comfortable & trendy footwear in India with fast delivery.",
    url: "https://shopmarkline.in",
  },
  alternates: {
    canonical: "https://shopmarkline.in",
  },
});


export default function Home() {
  return (
    <>
      <HomePage />
    </>
  );
}
