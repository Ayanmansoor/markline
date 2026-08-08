import React from 'react'
import BlogPage from '@/components/Pages/Blog.page'
import { getblog } from '@/Supabase/SupabaseApi'
import { Metadata } from 'next'

interface PageProps {
  params: Promise<{ slug: string }> | { slug: string };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params);
  const slug = resolvedParams?.slug;
  const blog = slug ? await getblog(slug) : null;

  if (!blog || !blog.title) {
    return {
      title: "Blog | Markline",
      description: "Explore articles from Markline covering footwear, fashion trends, and style guides.",
    };
  }

  const title = blog.seo_title || `${blog.title} | Markline Blog`;
  const description =
    blog.seo_description ||
    blog.seoDescription ||
    (blog.discription ? `${blog.discription.slice(0, 155)}...` : "Read insightful articles on luxury footwear and fashion by Markline.");

  const canonicalUrl = blog.canonical_url || `https://shopmarkline.in/blogs/${slug}`;
  const ogTitle = blog.og_title || blog.seo_title || blog.title;
  const ogDescription = blog.og_description || description;
  const ogImageUrl = blog.og_image || blog.bannerImage || blog.image || "https://shopmarkline.in/default-blog.jpg";

  const twitterTitle = blog.twitter_title || ogTitle;
  const twitterDescription = blog.twitter_description || ogDescription;
  const twitterImageUrl = blog.twitter_image || ogImageUrl;

  const keywords = blog.seo_keywords
    ? blog.seo_keywords.split(',').map((k: string) => k.trim())
    : ["Markline", "Fashion", "Footwear", "Shoes", "Sneakers", "Style Tips", blog.title];

  const index = blog.robots_index !== false;
  const follow = blog.robots_follow !== false;

  return {
    title,
    description,
    keywords,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      type: "article",
      url: canonicalUrl,
      siteName: "Markline",
      publishedTime: blog.created_at,
      images: [
        {
          url: ogImageUrl,
          alt: blog.title || "Markline Journal",
        },
      ],
    },
    robots: {
      index,
      follow,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
    twitter: {
      card: "summary_large_image",
      title: twitterTitle,
      description: twitterDescription,
      images: [twitterImageUrl],
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function page({ params }: PageProps) {
  const resolvedParams = await Promise.resolve(params);
  const slug = resolvedParams?.slug;
  const blog = slug ? await getblog(slug) : null;

  // Ensure plain JSON serializable data for Client Components
  const serializedBlog = blog ? JSON.parse(JSON.stringify(blog)) : null;

  const jsonLd = serializedBlog
    ? {
        "@context": "https://schema.org",
        "@type": serializedBlog.schema_type || "BlogPosting",
        "headline": serializedBlog.seo_title || serializedBlog.title,
        "description": serializedBlog.seo_description || serializedBlog.seoDescription || serializedBlog.discription,
        "image": serializedBlog.og_image || serializedBlog.bannerImage || serializedBlog.image || "https://shopmarkline.in/default-blog.jpg",
        "datePublished": serializedBlog.created_at,
        "dateModified": serializedBlog.created_at,
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": serializedBlog.canonical_url || `https://shopmarkline.in/blogs/${slug}`,
        },
        "author": {
          "@type": "Organization",
          "name": "Markline Atelier",
          "url": "https://shopmarkline.in",
        },
        "publisher": {
          "@type": "Organization",
          "name": "Markline",
          "logo": {
            "@type": "ImageObject",
            "url": "https://shopmarkline.in/logo.png",
          },
        },
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
          }}
        />
      )}
      <BlogPage initialBlog={serializedBlog} slug={slug} />
    </>
  );
}