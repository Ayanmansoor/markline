import React from 'react'
import BlogsPage from '@/components/Pages/Blogs.page'
import { mergeMetadata } from '@/app/layout';
export const metadata = mergeMetadata({
    title: "Fashion Blog | Markline – Trends, Tips & Style Guides",
    description:
        "Explore the Markline Blog for the latest trends, styling tips, and insights into the world of luxury fashion. Stay inspired with our expert fashion guides.",
    robots: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
    },
    openGraph: {
        title: "Fashion Blog | Markline – Trends, Tips & Style Guides",
        description:
            "Stay up to date with Markline’s blog featuring fashion inspiration, seasonal guides, and tips for styling luxury pieces.",
        url: "https://shopmarkline.in/blogs",
    },
    alternates: {
        canonical: `https://shopmarkline.in/blogs`,
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