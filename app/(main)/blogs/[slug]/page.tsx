import React from 'react'
import BlogPage from '@/components/Pages/Blog.page'
import { getblog } from '@/Supabase/SupabaseApi';
export async function generateMetadata({ params }) {
    const slug = params.slug;

    const blog = await getblog(slug);

    if (!blog || !blog.title) {
        return {
            title: "Blog | Markline Fashion",
            description: "Explore articles from Markline Fashion covering footwear, fashion trends, and more.",
        };
    }

    const title = blog.title || "Markline Fashion Blog";
    const description =
        blog.seoDescription ||
        blog.discription?.slice(0, 150) + "..." || "Read insightful articles on footwear and fashion by Markline.";

    const imageUrl = blog.bannerImage || blog.image || "https://marklinefashion.com/default-blog.jpg";

    return {
        title: `${title} | Markline Blog`,
        description,
        keywords: ["Markline", "Fashion", "Shoes", "Sneakers", "Style Tips", title],
        openGraph: {
            title,
            description,
            type: "article",
            url: `https://marklinefashion.com/blogs/${slug}`,
            images: [
                {
                    url: imageUrl,
                    alt: title,
                },
            ],
        },
        robots: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [imageUrl],
        },
        alternates: {
            canonical: `https://marklinefashion.com/blogs/${slug}`,
        },
    };
}
function page() {
    return (
        <>
            <BlogPage />
        </>
    )
}

export default page