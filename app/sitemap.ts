import {
  getAllBlogs,
  getAllCollections,
  getAllCollectionsBaseOnGender,
  getAllCollectionsBaseOnTypeForSeo,
  getAllProductsWithVariants,
  getProductDataSitemap,
} from "@/Supabase/SupabaseApi";
import { BlogCardProps, ProductsProps } from "@/types/interfaces";
const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default async function sitemap() {
  const data: any = await getProductDataSitemap();
  const womencollections: any = await getAllCollectionsBaseOnGender("WOMEN");
  const mencollections: any = await getAllCollectionsBaseOnGender("MEN");
  const blogs: any = await getAllBlogs();
  const occasionCollection: any = await getAllCollectionsBaseOnTypeForSeo(
    "occasion"
  );


  let sitemap = [
    { url: `${NEXT_PUBLIC_BASE_URL}/about-us` },
    { url: `${NEXT_PUBLIC_BASE_URL}/blogs` },
    { url: `${NEXT_PUBLIC_BASE_URL}/collections/women` },
    { url: `${NEXT_PUBLIC_BASE_URL}/collections/men` },
    { url: `${NEXT_PUBLIC_BASE_URL}/collections/kids` },
    { url: `${NEXT_PUBLIC_BASE_URL}/collections` },
    { url: `${NEXT_PUBLIC_BASE_URL}/new-arrivals` },
    { url: `${NEXT_PUBLIC_BASE_URL}/privacy-policy` },
    { url: `${NEXT_PUBLIC_BASE_URL}/products/women` },
    { url: `${NEXT_PUBLIC_BASE_URL}/products/men` },
    { url: `${NEXT_PUBLIC_BASE_URL}/products/kids` },
    { url: `${NEXT_PUBLIC_BASE_URL}/return-policy` },
    { url: `${NEXT_PUBLIC_BASE_URL}/shiping-policy` },
    { url: `${NEXT_PUBLIC_BASE_URL}/trending` },
    { url: `${NEXT_PUBLIC_BASE_URL}/user` },

    { url: `${NEXT_PUBLIC_BASE_URL}/products/women` },
    { url: `${NEXT_PUBLIC_BASE_URL}/products/men` },
    { url: `${NEXT_PUBLIC_BASE_URL}/products/kids` },
  ];

  if (blogs?.length > 0 && blogs) {
    sitemap = sitemap.concat(
      blogs.map((blog: BlogCardProps) => ({
        url: `${NEXT_PUBLIC_BASE_URL}/blogs/${blog.slug}`,
      }))
    );
  }
  if (data?.length > 0 && data) {
    sitemap = sitemap.concat(
      data.map((product: ProductsProps) => ({
        url: `${NEXT_PUBLIC_BASE_URL}/product/${product.slug}`,
      }))
    );
  }
  if (womencollections?.length > 0 && womencollections) {
    sitemap = sitemap.concat(
      womencollections.map((collection: ProductsProps) => ({
        url: `${NEXT_PUBLIC_BASE_URL}/collections/women/${collection.slug}`,
      }))
    );
  }

  if (mencollections?.length > 0 && mencollections) {
    sitemap = sitemap.concat(
      mencollections.map((collection: ProductsProps) => ({
        url: `${NEXT_PUBLIC_BASE_URL}/collections/men/${collection.slug}`,
      }))
    );
  }

  // if (mencollections?.length > 0 && mencollections) {
  //   sitemap = sitemap.concat(
  //     occasionCollection.map((occasion: ProductsProps) => ({
  //       url: `${NEXT_PUBLIC_BASE_URL}/occasion/${occasion.slug}`,
  //     }))
  //   );
  // }

  return sitemap;
}
