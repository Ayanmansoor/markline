
import React from "react";

import { getaudience } from "@/Supabase/SupabaseApi";
import Productspage from "@/components/Products/Products.page";
import { mysupabase } from "@/Supabase/SupabaseConfig";

import { AudienceProps } from "@/types/interfaces";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const audience: AudienceProps | null = await getaudience(
        `${slug}`.toUpperCase()
    );

    const audienceName = audience?.seo_title || "Audience";
    const description =
        audience?.seo_discription ||
        `Shop ${audienceName} at Markline. Modern design meets ergonomic comfort with 3mm memory foam. Handcrafted premium footwear for the Indian lifestyle. Buy now!`

    return {
        title: `${audienceName} | Premium Women's Footwear | Markline India`,
        description,
        keywords: [
            "Markline", audienceName, "cushioned heels for women",
            // High Volume India Terms
            "buy shoes online India", "footwear online India", "online shoe shopping India", "shoe store India",
            // Women's
            "women's sandals online India", "ladies sandals India", "buy heels online India",
            "platform sandals for women", "block heels women India", "wedge sandals women",
            "mules for women India", "comfortable sandals women", "stylish sandals India",
            "open toe heels India", "slip on sandals women", "women's party heels India",
            "ethnic sandals women", "festive footwear women", "wedding sandals India",
            "office wear sandals women", "women's casual shoes India", "daily wear sandals India",
            // Men's

            "affordable footwear India", "fashionable shoes India", "fast delivery shoes India",
            "stylish shoes under 2000 India", "footwear at best price India",
        ],
        openGraph: {
            title: `${audienceName} Online – Premium & Comfortable Footwear  Markline`,
            description: `Experience the perfect blend of style and ease with our ${audienceName} collection. Handcrafted for the modern Indian woman with extra cushioning. Free shipping India-wide!`,
            url: `https://shopmarkline.in/products/${slug}`,
            locale: "en_IN",
            type: "website",
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
            title: `Markline India | Premium ${audienceName} Footwear`,
            description: `Modern design and ergonomic comfort in every step. Discover our handcrafted [Audience Name] range for women.`,
        },
        alternates: {
            canonical: `https://shopmarkline.in/products/${slug}`,
        },
    };
}

async function page({
    params,
    searchParams,
}: {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ page?: string }>;
}) {
    const { slug } = await params;
    const { page } = await searchParams;
    const currentPage = Number(page) || 1;
    const PAGE_SIZE = 16;

    const from = (currentPage - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    // 1. Fetch products server-side with pagination and gender filter
    const { data: products, count } = await mysupabase
        .from("product")
        .select("*,brands(*),collection(*),product_variants(*,discounts:discount_key(*))", { count: "exact" })
        .eq("gender", slug.toUpperCase())
        .order("created_at", { ascending: false })
        .range(from, to);

    // 2. Fetch all collections
    const { data: allcollection } = await mysupabase
        .from("collection")
        .select("*")
        .eq("type", "ALL");

    return (
        <>
            <Productspage
                initialProducts={{ data: products || [] }}
                initialCollections={{ data: allcollection || [] }}
                totalCount={count || 0}
                currentPage={currentPage}
                pageSize={PAGE_SIZE}
            />
        </>
    );
}

export default page;
