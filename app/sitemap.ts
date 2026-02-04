import {
  fetchGroupOfProducts,
  fetchGroupOfPRoductss,
  getAllBlogs,
  getAllCollectionsBaseOnGender,

  getProductDataSitemap,
} from "@/Supabase/SupabaseApi";
import { BlogCardProps, ProductsProps } from "@/types/interfaces";
const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default async function sitemap() {
  const data: any = await getProductDataSitemap();
  const womencollections: any = await getAllCollectionsBaseOnGender("WOMEN");
  const blogs: any = await getAllBlogs();
  const allGroup: any = await fetchGroupOfPRoductss()



  let sitemap = [
    { url: `https://shopmarkline.in/about-us` },
    { url: `https://shopmarkline.in/blogs` },
    { url: `https://shopmarkline.in/collections/women` },
    { url: `https://shopmarkline.in/collections/men` },
    { url: `https://shopmarkline.in/collections/kids` },
    { url: `https://shopmarkline.in/collections` },
    { url: `https://shopmarkline.in/new-arrivals` },
    { url: `https://shopmarkline.in/privacy-policy` },
    { url: `https://shopmarkline.in/products/women` },
    { url: `https://shopmarkline.in/return-policy` },
    { url: `https://shopmarkline.in/shiping-policy` },
    { url: `https://shopmarkline.in/trending` },
    { url: `https://shopmarkline.in/products/women` },

  ];

  if (blogs?.length > 0 && blogs) {
    sitemap = sitemap.concat(
      blogs.map((blog: BlogCardProps) => ({
        url: `${NEXT_PUBLIC_BASE_URL}/blogs/${blog.slug}`,
      }))
    );
  }


  if (allGroup?.length > 0 && allGroup) {
    sitemap = sitemap.concat(
      allGroup.map((group: any) => ({
        url: `${NEXT_PUBLIC_BASE_URL}/shop-by/${group?.url}`,
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




  return sitemap;
}
