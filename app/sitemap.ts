import {
  getAllBlogs,
  getAllCollections,
  getAllProducts,
} from "@/Supabase/SupabaseApi";
import { BlogCardProps, ProductsProps } from "@/types/interfaces";
const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default async function sitemap() {
  const products: any = await getAllProducts();
  const collections: any = await getAllCollections();
  const blogs: any = await getAllBlogs();

  let sitemap = [
    { url: `${NEXT_PUBLIC_BASE_URL}/about-us` },
    { url: `${NEXT_PUBLIC_BASE_URL}/blogs` },
    { url: `${NEXT_PUBLIC_BASE_URL}/collections` },
    { url: `${NEXT_PUBLIC_BASE_URL}/new-arrivals` },
    { url: `${NEXT_PUBLIC_BASE_URL}/privacy-policy` },
    { url: `${NEXT_PUBLIC_BASE_URL}/products` },
    { url: `${NEXT_PUBLIC_BASE_URL}/return-policy` },
    { url: `${NEXT_PUBLIC_BASE_URL}/shiping-policy` },
    { url: `${NEXT_PUBLIC_BASE_URL}/trending` },
  ];

  if (blogs?.length > 0 && blogs) {
    sitemap = sitemap.concat(
      blogs.map((blog: BlogCardProps) => ({
        url: `${NEXT_PUBLIC_BASE_URL}/blogs/${blog.slug}`,
      }))
    );
  }
  if (products?.length > 0 && products) {
    sitemap = sitemap.concat(
      products.map((product: ProductsProps) => ({
        url: `${NEXT_PUBLIC_BASE_URL}/products/${product.slug}`,
      }))
    );
  }
  if (collections?.length > 0 && collections) {
    sitemap = sitemap.concat(
      collections.map((collection: ProductsProps) => ({
        url: `${NEXT_PUBLIC_BASE_URL}/collections/${collection.slug}`,
      }))
    );
  }

  return sitemap;
}
