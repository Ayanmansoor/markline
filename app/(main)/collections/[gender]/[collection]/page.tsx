import React from 'react'
import CategoryL2page from '@/components/Collection/CollectionPage'
import { getcollection } from '@/Supabase/SupabaseApi';
import GenderPage from '@/components/gender/GenderPage';



export async function generateMetadata({ params }) {
  const slug = params.slug;


  const data  = await getcollection(params.collection);


  if (!data || !data.seoTitle) {
    return {
      title: "Collection | Markline Fashion",
      description: "Explore elegant collections by Markline Fashion, where tradition meets modern design.",
    };
  }

  const collectionName = data.seoTitle || "Collection";
  const description =
    data.seoDescription ||
    "Discover our curated collection of women's accessories, where elegance and craftsmanship unite.";

  const imageObject = data.image_urls?.[0]
    ? JSON.parse(data.image_urls[0])
    : null;
  const imageUrl = imageObject?.image_url || "https://marklinefashion.vercel.app/default.jpg";

  return {
    title: `${collectionName} Collection | Markline Fashion`,
    description,
    keywords: ["Markline Fashion", collectionName, "Toe Rings", "Women's Jewelry", "Elegant Accessories"],
    openGraph: {
      title: `${collectionName} Collection`,
      description,
      type: "website",
      url: `https://marklinefashion.vercel.app/collections/${params.collection}`,
      images: [
        {
          url: imageUrl,
          alt: `${collectionName} Collection`,
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
      title: `${collectionName} Collection`,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: `https://marklinefashion.vercel.app/collections/${params.collection}`,
    },
  };
}


function Collection() {
  return (
    <>
       <CategoryL2page />
    </>
  )
}

export default Collection