import React from 'react'
import ProductPage from '@/components/Pages/Product.page'

import { getProductData } from '@/Supabase/SupabaseApi';
import { safeJsonParse } from '@/lib/utils';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {

  const { slug } = await params

  const product = await getProductData(slug);


  const productName = product?.name || "Product";
  const description = product?.seoDescription || product?.description || "Discover elegant women's accessories at Markline.";
  const imageUrl = safeJsonParse(product?.product_variants?.[0]?.image_url?.[0])?.image_url || "https://marklinefashion.com/default.jpg";


  const keywords = product?.keywords && product.keywords.length > 0
    ? product.keywords
    : [
      // Brand + Product
      "Markline", productName, "Markline footwear", "buy shoes online India",
      // Women's category
      "women's footwear India", "ladies sandals online", "buy heels online India",
      "women's sandals online", "platform sandals women", "block heels women India",
      "wedge sandals women India", "mules for women", "slip on sandals India",
      "comfortable sandals for women", "stylish sandals India", "open toe heels women",
      // Men's category
      "men's shoes online India", "casual shoes men India", "men's formal shoes",
      // Kids
      "kids shoes India", "children footwear online India",
      // High intent long-tail
      "buy footwear online India", "online shoe shopping India", "footwear at best price India",
      "affordable women's shoes India", "fashionable shoes India", "fast delivery shoes India",
      // Occasion
      "office wear sandals women", "wedding footwear India", "daily wear shoes India",
      "festive sandals India", "party heels women India",
    ];

  return {
    title: `${productName} | Buy Online in India | Markline`,
    description,
    keywords,
    openGraph: {
      title: `${productName} | Buy Online in India | Markline`,
      description,
      url: `https://shopmarkline.in/product/${slug ?? ""}`,
      locale: "en_IN",
      type: "website",
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
      title: `${productName} | Buy Online in India | Markline`,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: `https://shopmarkline.in/product/${slug ?? ""}`,
    },
  };
}


async function page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductData(slug);

  if (!product) return null;

  const variant = product.product_variants?.[0];

  // 1. Calculate the actual selling price
  const basePrice = variant?.price || 0;
  const discountPercent = variant?.discounts?.discount_persent || 0;
  const finalPrice = discountPercent > 0
    ? (basePrice - (basePrice * discountPercent) / 100).toFixed(2)
    : basePrice;

  // 2. Parse Image URL safely
  const imageUrl =
    safeJsonParse(variant?.image_url?.[0])?.image_url ||
    "https://marklinefashion.com/default.jpg";

  const productUrl = `https://shopmarkline.in/product/${slug ?? ""}`;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": productUrl,
    name: product.name,
    description: product.seoDescription || product.description,
    image: [imageUrl],
    sku: variant?.sku || product.id.toString(),
    brand: {
      "@type": "Brand",
      name: "Markline",
    },
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "INR",
      price: finalPrice, // Now reflects the actual 25% off price
      // priceValidUntil: variant?.discounts?.discount_end || "2026-12-31", // Essential for sales
      availability:
        variant?.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
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
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "IN",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
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
      <ProductPage initialProduct={product} />
    </>
  )
}

export default page