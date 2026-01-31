import React from 'react'
import ProductPage from '@/components/Pages/Product.page'

import { getProductData } from '@/Supabase/SupabaseApi';

export async function generateMetadata({ params }) {

  const slug = await params?.slug

  const product = await getProductData(slug);


  const productName = product?.name || "Product";
  const description = product?.seoDescription || product?.description || "Discover elegant women's accessories at Markline.";
  const imageUrl = JSON.parse(product?.product_variants[0]?.image_url?.[0] || '{}')?.image_url || "https://marklinefashion.com/default.jpg";


  return {
    title: `${productName} | Markline`,
    description,
    keywords: ["Markline", productName, "Women's Fashion", "Toe Ring", "Gold Jewelry"],
    openGraph: {
      title: productName,
      description,
      url: `https://shopmarkline.in/product/${slug ?? ""}`,
      images: [
        {
          url: imageUrl,
          alt: productName,
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
      title: productName,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: `https://shopmarkline.in/product/${slug ?? ""}`,
    },
  };
}


async function page({ params }) {

  const slug = params?.slug
  const product = await getProductData(slug);


  if (!product) return null;

  const variant = product.product_variants?.[0];

  const imageUrl =
    JSON.parse(variant?.image_url?.[0] || "{}")?.image_url ||
    "https://marklinefashion.com/default.jpg";

  const productUrl = `https://shopmarkline.in/product/${slug ?? ""}`;

  /* =========================
     PRODUCT + OFFER SCHEMA
  ========================= */
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": productUrl,
    name: product.name,
    description:
      product.seoDescription || product.description,
    image: [imageUrl],
    sku: variant?.sku || product.id,
    brand: {
      "@type": "Brand",
      name: "Markline",
    },

    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "INR",
      price: variant?.price || variant?.mrp,
      availability:
        variant?.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",

      /* 🚚 SHIPPING POLICY */
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: "0",
          currency: "INR",
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "IN",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 1,
            maxValue: 2,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 3,
            maxValue: 7,
            unitCode: "DAY",
          },
        },
      },

      /* 🔁 RETURN POLICY */
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "IN",
        returnPolicyCategory:
          "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 7,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/FreeReturn",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema),
        }}
      />


      <ProductPage />
    </>
  )
}

export default page