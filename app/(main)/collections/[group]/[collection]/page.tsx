
import CategoryL2page from '@/components/Collection/CollectionPage'
import { getAllCollectionsBaseOnGender, getaudience } from '@/Supabase/SupabaseApi';
import { mysupabase } from '@/Supabase/SupabaseConfig';
import { AudienceProps } from '@/types/interfaces';
import React from 'react'

export async function generateMetadata({ params }: { params: Promise<{ collection: string, group: string }> }) {
    const resolvedParams = await params;
    const collectionsSlug = `${resolvedParams.collection}`
    const groupSlug = `${resolvedParams.group}`

    const audience: AudienceProps | null = await getaudience(`${resolvedParams.group}`.toUpperCase());


    const audienceName = audience?.seo_title || "Audience";
    const description =
        audience?.seo_discription ||
        `Explore Markline footwear collections – ${collectionsSlug} shoes for men, women & kids.`;
    return {
        title: `${audienceName} | Buy Shoes Online India | Markline`,
        description,
        keywords: [
            "Markline", audienceName, collectionsSlug, "Markline footwear",
            // High Volume India Terms
            "buy shoes online India", "footwear online India", "online shoe shopping India",
            // Women's
            "women's sandals online India", "ladies sandals India", "buy heels online India",
            "platform sandals for women", "block heels women India", "wedge sandals women",
            "mules for women India", "comfortable sandals women", "stylish sandals India",
            "ethnic sandals women", "festive footwear women", "wedding sandals India",
            "office wear sandals women", "women's casual shoes India", "open toe heels India",

            "affordable footwear India", "fashionable shoes India", "fast delivery shoes India",
            "stylish shoes under 2000 India",
        ],
        openGraph: {
            title: `${audienceName} | Buy Shoes Online India | Markline`,
            description,
            url: `https://shopmarkline.in/collections/${groupSlug}/${collectionsSlug}`,
            locale: "en_IN",
            type: "website",
            images: [
                {
                    url: "/opengraph-image.png",
                    width: 1200,
                    height: 630,
                    alt: audienceName,
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
            title: `${audienceName} | Buy Shoes Online India | Markline`,
            description,
        },
        alternates: {
            canonical: `https://shopmarkline.in/collections/${groupSlug}/${collectionsSlug}`,
        },
    };
}

async function page({
    params,
    searchParams,
}: {
    params: Promise<{ collection: string; group: string }>;
    searchParams: Promise<{ page?: string }>;
}) {
    const { collection, group } = await params;
    const { page } = await searchParams;
    const currentPage = Number(page) || 1;
    const PAGE_SIZE = 16;

    const from = (currentPage - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    // 1. Fetch collection details based on slug to get ID
    const { data: collectionData } = await mysupabase
        .from("collection")
        .select("id")
        .eq("slug", collection)
        .single();

    let products: any[] = [];
    let count = 0;

    if (collectionData) {
        // 2. Fetch products for that collection with pagination
        const { data, count: totalCount } = await mysupabase
            .from("product")
            .select("*,brands(*),collection(*),product_variants(*,discounts:discount_key(*))", { count: "exact" })
            .eq("collection_key", collectionData.id)
            .order("created_at", { ascending: false })
            .range(from, to);

        products = data || [];
        count = totalCount || 0;
    }

    // 3. Fetch all collections for the gender to pass to client component
    const { data: allcollection } = await mysupabase
        .from("collection")
        .select("*")
        .eq("gender", group.toUpperCase());

    return (
        <CategoryL2page
            initialProducts={products}
            initialCollections={{ data: allcollection || [] }}
            totalCount={count}
            currentPage={currentPage}
            pageSize={PAGE_SIZE}
        />
    )
}

export default page
