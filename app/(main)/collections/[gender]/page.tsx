import React from 'react'
import CategoryL2page from '@/components/Collection/CollectionPage'
import { getcollection } from '@/Supabase/SupabaseApi';
import GenderPage from '@/components/gender/GenderPage';
import { mergeMetadata } from '@/app/layout';



export async function generateMetadata({ params }: { params: {
  gender: string; slug: string 
} }) {
  const slug = params.slug;
  const label = params?.gender === 'men' ? "Men’s" : params?.gender === 'women' ? "Women’s" : "Kids’";

  const title = `${label} Footwear Collection – Style, Comfort & Quality | Markline Fashion`;
  const description = `Explore the Markline ${label.toLowerCase()} footwear collection: from stylish sneakers and trendy sandals to formal and casual picks—crafted with quality, comfort, and everyday style.`;

  const url = `https://marklinefashion.com/gender/${params.gender}`;

  return {
    title,
    description,
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
    openGraph: {
      title,
      description,
      type: "website",
      url,
    },
    alternates: {
      canonical: url,
    },
  };
}


function Collection() {
  return (
    <>
     
      <GenderPage />
    </>
  )
}

export default Collection