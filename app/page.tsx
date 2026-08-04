import HomePage from "@/components/Pages/Home.page";
import { mergeMetadata } from "./layout";
import { mysupabase } from "@/Supabase/SupabaseConfig";

export const metadata = mergeMetadata({
  title:
    "Markline | Premium & Comfortable Women's Footwear Online India",
  description:
    "Shop Markline for premium women's footwear. Discover modern, comfortable heels and flats handcrafted for the Indian lifestyle. Quality meets ergonomic style. Buy now!",
  keywords: [
    "Markline", "Markline footwear", "Markline shoes", "footwear online India", "buy shoes online India.",
    // High Volume India Terms
    "women's sandals online India", "ladies sandals India", "buy heels online India", "buy heels online India", "comfortable block heels", "wedge sandals for women", "mules for women India", "women's flats online",
    // Women's
    "ethnic sandals for women", "wedding footwear for women",
    "festive footwear India", "office wear sandals for ladies",
    "mules for women India", "comfortable sandals women", "stylish sandals India",
    "ethnic sandals women", "festive footwear women", "wedding sandals India",
    "office wear sandals women", "women's casual shoes India",
    // Long-tail
    "affordable luxury footwear India", "ergonomic comfort shoes", "handcrafted designer footwear", "fast delivery shoes India"
  ],
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  openGraph: {
    title:
      "Markline | Premium & Comfortable Women's Footwear Online India",
    description:
      "Shop Markline for women's footwear. Discover modern, comfortable heels and flats handcrafted for the Indian lifestyle. Quality meets ergonomic style. Buy now!",
    url: "https://shopmarkline.in",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Markline Footwear",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Markline | Premium & Comfortable Women's Footwear Online India",
    description: "Shop premium & comfortable women's footwear at Markline. Discover modern heels, flats & sandals handcrafted for the Indian lifestyle. Quality meets ergonomic style. Buy now!",
  },
  alternates: {
    canonical: "https://shopmarkline.in",
  },
});

export default async function Home() {
  // 1. Fetch banners server-side
  const { data: homebanners = [] } = await mysupabase.from("HomeBanner").select("*");

  // 2. Fetch all collections
  const { data: allcollection = [] } = await mysupabase.from("collection").select("*").eq("type", "ALL");

  // 3. Fetch groups of products
  const { data: groupOfProductsData = [] } = await mysupabase
    .from("group")
    .select(`
          id,
          heading,
          type,
          discription,
          url,
          urlText,
          isActive,
          index,
          products:product (
              *,
              product_variants (
                  *,
              discounts:discount_key (*)
              ) 
          )
      `)
    .order("index", { ascending: true });

  const activeGroupOfProductsData = groupOfProductsData
    ? groupOfProductsData.filter((item: any) => item.isActive !== false)
    : [];

  const initialGroupOfProducts = { data: activeGroupOfProductsData || [] };

  return (
    <>
      <HomePage
        initialBanners={homebanners}
        initialCollections={allcollection}
        initialGroupOfProducts={initialGroupOfProducts}
      />
    </>
  );
}
