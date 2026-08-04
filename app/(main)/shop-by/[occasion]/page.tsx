
import React from 'react'
import Occasions from '@/components/Pages/Occasions'
import { mysupabase } from '@/Supabase/SupabaseConfig';
import { getAllCollectionsBaseOnType, getCollectionBaseOnTypeAndOccuation } from '@/Supabase/SupabaseApi';
export async function generateMetadata({ params }: { params: Promise<{ occasion: string }> }) {
    const { occasion } = await params;

    const occasiondata: any[] | null | Error = await getCollectionBaseOnTypeAndOccuation('occasion', occasion);

    const currentCollection = Array.isArray(occasiondata) ? occasiondata?.[0] : null;

    const collectionName =
        currentCollection?.seoTitle?.trim() ||
        currentCollection?.name ||
        `${occasion.charAt(0).toUpperCase() + occasion.slice(1)} Footwear`;

    const description =
        currentCollection?.seoDescription?.trim() ||
        `Shop ${collectionName} footwear online at Markline India. Explore stylish sandals, heels, block heels, wedges & mules for women, men & kids. Fast delivery across India.`;

    const ogImages =
        currentCollection?.image_urls
            ?.map((img: string) => {
                try {
                    const parsed = JSON.parse(img);
                    if (parsed?.image_url && typeof parsed.image_url === "string") {
                        return { url: parsed.image_url, alt: collectionName };
                    }
                    return null;
                } catch {
                    return null;
                }
            })
            .filter(Boolean) || [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: collectionName }];

    return {
        title: `${collectionName} | Buy Shoes Online in India | Markline`,
        description,
        keywords: [
            // Brand + Context
            "Markline", collectionName, "Markline footwear", occasion,
            // Occasion-specific
            `${occasion} footwear India`, `${occasion} sandals women`, `${occasion} shoes India`,
            `${occasion} heels India`, `buy ${occasion} shoes online India`,
            // High Volume India Terms
            "buy shoes online India", "footwear online India", "online shoe shopping India",
            // Women's
            "women's sandals online India", "ladies sandals India", "buy heels online India",
            "platform sandals for women", "block heels women India", "wedge sandals women",
            "mules for women India", "comfortable sandals women", "stylish sandals India",
            "ethnic sandals women", "festive footwear women India", "wedding sandals India",
            "office wear sandals women", "party heels women India", "open toe heels India",
            // Men's
            "men's shoes online India", "casual shoes for men India", "men's formal shoes India",
            // Kids
            "kids shoes online India", "children's footwear India",
            // Long-tail High Intent
            "affordable footwear India", "fashionable shoes India", "fast delivery shoes India",
            "stylish shoes under 2000 India", "footwear at best price India",
        ],
        openGraph: {
            title: `${collectionName} | Buy Shoes Online in India | Markline`,
            description,
            url: `https://shopmarkline.in/shop-by/${occasion}`,
            locale: "en_IN",
            type: "website",
            images: ogImages,
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
            title: `${collectionName} | Buy Shoes Online in India | Markline`,
            description,
        },
        alternates: {
            canonical: `https://shopmarkline.in/shop-by/${occasion}`,
        },
    };
}


async function page({ params }: { params: Promise<{ occasion: string }> }) {
    // 1. Fetch all collections server-side
    const { data: allcollection } = await mysupabase
        .from("collection")
        .select("*")
        .eq("type", "ALL");

    // 2. Fetch Best Sellers server-side
    const { data: groupOfProductsData } = await mysupabase
        .from("group")
        .select(`
        id,
        heading,
        type,
        discription,
        url,
        urlText,
        isActive,
        index,
        products:product (
            *,
            product_variants (
                *,
            discounts:discount_key (*)
            ) 
        )
    `)
        .eq("type", "BEST_SELLER")
        .order("index", { ascending: true });

    const activeGroupOfProductsData = groupOfProductsData
        ? groupOfProductsData.filter((item: any) => item.isActive !== false)
        : [];

    return (
        <Occasions
            initialCollections={{ data: allcollection || [] }}
            initialGroupOfProducts={{ data: activeGroupOfProductsData || [] }}
        />
    )
}

export default page
