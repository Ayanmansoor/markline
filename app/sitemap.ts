import {
  getAllBlogs,
  getAllCollectionsBaseOnGender,
  getProductDataSitemap,
} from "@/Supabase/SupabaseApi";
import { BlogCardProps, ProductsProps } from "@/types/interfaces";

const BASE_URL = "https://shopmarkline.in";

export default async function sitemap() {
  const products: any = await getProductDataSitemap();
  const womenCollections: any = await getAllCollectionsBaseOnGender("WOMEN");
  const blogs: any = await getAllBlogs();

  const staticRoutes = [
    { url: `${BASE_URL}/`, lastModified: new Date() },
    { url: `${BASE_URL}/about-us`, lastModified: new Date() },
    { url: `${BASE_URL}/contact-us`, lastModified: new Date() },
    { url: `${BASE_URL}/blogs`, lastModified: new Date() },
    { url: `${BASE_URL}/collections`, lastModified: new Date() },
    { url: `${BASE_URL}/collections/women`, lastModified: new Date() },
    { url: `${BASE_URL}/products/women`, lastModified: new Date() },
    { url: `${BASE_URL}/shipping-policy`, lastModified: new Date() },
    { url: `${BASE_URL}/return-policy`, lastModified: new Date() },
    { url: `${BASE_URL}/claim-policy`, lastModified: new Date() },
    { url: `${BASE_URL}/privacy-policy`, lastModified: new Date() },
    { url: `${BASE_URL}/terms-condition`, lastModified: new Date() },
    { url: `${BASE_URL}/llms.txt`, lastModified: new Date() },
  ];

  let dynamicRoutes: { url: string; lastModified?: Date }[] = [];

  // Add active products
  if (Array.isArray(products) && products.length > 0) {
    const productEntries = products
      .filter((p: ProductsProps) => p && p.slug)
      .map((product: ProductsProps) => ({
        url: `${BASE_URL}/product/${product.slug}`,
        lastModified: product.created_at ? new Date(product.created_at) : new Date(),
      }));
    dynamicRoutes = dynamicRoutes.concat(productEntries);
  }

  // Add women collections
  if (Array.isArray(womenCollections) && womenCollections.length > 0) {
    const collectionEntries = womenCollections
      .filter((c: any) => c && c.slug)
      .map((collection: any) => ({
        url: `${BASE_URL}/collections/women/${collection.slug}`,
        lastModified: new Date(),
      }));
    dynamicRoutes = dynamicRoutes.concat(collectionEntries);
  }

  // Add published blogs
  if (Array.isArray(blogs) && blogs.length > 0) {
    const blogEntries = blogs
      .filter((b: BlogCardProps) => b && b.slug && b.status !== "draft")
      .map((blog: BlogCardProps) => ({
        url: `${BASE_URL}/blogs/${blog.slug}`,
        lastModified: blog.created_at ? new Date(blog.created_at) : new Date(),
      }));
    dynamicRoutes = dynamicRoutes.concat(blogEntries);
  }

  return [...staticRoutes, ...dynamicRoutes];
}
