import HomePage from "@/components/Pages/Home.page";
import { mergeMetadata } from "./layout";
import { mysupabase } from "@/Supabase/SupabaseConfig";

export const metadata = mergeMetadata({
  title:
    "Buy Shoes Online in India | Sandals, Heels, Mules & Kids Shoes – Markline",
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
    title:
      "Buy Shoes Online in India | Sandals, Heels, Mules & Kids Shoes – Markline",
    description:
      "Shop Men’s Shoes, Women’s Sandals, Heels, Mules & Kids Shoes online at Markline. Discover stylish, comfortable & trendy footwear in India with fast delivery.",
    url: "https://shopmarkline.in",
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
          products:product (
              *,
              product_variants (
                  *,
              discounts:discount_key (*)
              ) 
          )
      `);

  const initialGroupOfProducts = { data: groupOfProductsData || [] };

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
