import React from 'react'
import BlogsPage from '@/components/Pages/Blogs.page'
import { mergeMetadata } from '@/app/layout';
export const metadata = mergeMetadata({
    title: "Fashion Blog | Markline Fashion – Trends, Tips & Style Guides",
    description:
        "Explore the Markline Fashion Blog for the latest trends, styling tips, and insights into the world of luxury fashion. Stay inspired with our expert fashion guides.",
    robots: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
    },
    openGraph: {
        title: "Fashion Blog | Markline Fashion – Trends, Tips & Style Guides",
        description:
            "Stay up to date with Markline Fashion’s blog featuring fashion inspiration, seasonal guides, and tips for styling luxury pieces.",
        url: "https://marklinefashion.vercel.app/blogs",
    },
    alternates: {
        canonical: `https://marklinefashion.vercel.app/blogs`,
    },
});
function page() {
    return (
        <>
            <BlogsPage />
        </>
    )
}

export default page