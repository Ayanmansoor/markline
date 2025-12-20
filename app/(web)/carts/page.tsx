import React from 'react'
import Cartpage from '@/components/Pages/Cartpage';
export const metadata = {
    title: "Cart | Markline",
    description: "",
    robots: {
        index: false,
        follow: false,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
    },
    openGraph: {
        title: "Cart | Markline",
        description: "",
        url: "https://shopmarkline.in/cart",
    },
    alternates: {
        canonical: "https://shopmarkline.in/cart",
    },
};

function page() {
    return (
        <Cartpage />
    )
}

export default page