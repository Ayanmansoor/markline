import React from 'react'
import BlogsPage from '@/components/Pages/Blogs.page'
import { mergeMetadata } from '@/app/layout'
import { mysupabase } from '@/Supabase/SupabaseConfig'

export const metadata = mergeMetadata({
  title: "Fashion Journal & Style Guides | Markline Footwear",
  description:
    "Explore the Markline Journal for footwear trends, styling guides, leather care tips, and editorial insights.",
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  openGraph: {
    title: "Fashion Journal & Style Guides | Markline Footwear",
    description:
      "Read insightful articles on footwear care, heel styling, wedding season guides, and latest drops by Markline.",
    url: "https://shopmarkline.in/blogs",
  },
  alternates: {
    canonical: "https://shopmarkline.in/blogs",
  },
});

export default async function page() {
  const { data: blogs } = await mysupabase
    .from("blogs")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <BlogsPage initialBlogs={blogs || []} />
  );
}