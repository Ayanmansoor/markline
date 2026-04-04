import type { Metadata } from "next";
import localFont from "next/font/local";
import Navbar from "@/components/Common/Navbar";
import { Noto_Sans, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/Contexts/Cart.context";
import Provider from "./Provider";
import Footer from "@/components/Common/Footer";
import { WishlistProvider } from "@/Contexts/wishlist";
import { GoogleTagManager } from "@next/third-parties/google";
import Subcribes from "@/components/Common/Subcribes ";
import Head from "next/head";
import OrderConfirmed from "@/components/Common/OrderConfirm";
import { Toaster } from "@/components/ui/sonner";
import Header from "@/components/Common/Header";
import { mysupabase } from "@/Supabase/SupabaseConfig";
import Script from "next/script";
import FloatingWhatsApp from "@/components/Common/FloatingWhatsApp";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jakarta",
});

const noto = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto",
});

export const metadata: Metadata = {
  title: "Markline | Buy Stylish Shoes, Sandals & Heels Online in India",
  description:
    "Shop Markline for trendy & comfortable footwear online in India. Explore women's sandals, block heels, platform wedges, mules, men's formal shoes, sneakers & kids shoes with fast delivery across India.",

  metadataBase: new URL("https://shopmarkline.in"),

  keywords: [
    // Brand
    "Markline", "Markline shoes", "Markline footwear", "shopmarkline",
    // High Volume Head Terms
    "buy shoes online India", "footwear online India", "shoe store India", "online shoe shopping India",
    // Women's
    "women's sandals online", "ladies sandals India", "women's heels online India", "buy heels online India",
    "women's footwear India", "girls shoes online", "platform sandals for women", "block heels for women",
    "wedge sandals for women", "mules for women India", "women's casual shoes India",
    "comfortable sandals for women", "stylish sandals for women", "women's party heels India",
    "open toe sandals women", "slip on sandals women India", "ethnic sandals for women",
    // Men's
    "men's shoes online India", "men's formal shoes India", "casual shoes for men India",
    "men's sneakers India", "loafers for men India", "men's footwear online",
    // Kids
    "kids shoes online India", "children's footwear India",
    // Long-tail High Intent
    "buy women's sandals online at best price", "comfortable block heels for daily wear",
    "platform wedge sliders women India", "affordable women's shoes India",
    "fashionable footwear online India", "stylish shoes under 2000 India",
    "women's footwear with fast delivery India",
    // Seasonal/Occasion
    "festive footwear India", "wedding sandals women", "office wear sandals women",
    "casual footwear India", "daily wear shoes India",
  ],

  twitter: {
    card: "summary_large_image",
    title: "Markline | Buy Stylish Shoes, Sandals & Heels Online in India",
    description:
      "Shop Markline for trendy & comfortable footwear online in India. Explore women's sandals, block heels, platform wedges, mules, men's formal shoes, sneakers & kids shoes with fast delivery across India.",
    images: "/opengraph-image.png",
    site: "@shopmarkline",
  },

  openGraph: {
    title: "Markline | Buy Stylish Shoes, Sandals & Heels Online in India",
    description:
      "Shop Markline for trendy & comfortable footwear online in India. Explore women's sandals, block heels, platform wedges, mules, men's formal shoes, sneakers & kids shoes with fast delivery across India.",
    images: [
      {
        url: "/opengraph-image.png",
        width: 4800,
        height: 2520,
        alt: "Markline | Stylish Shoes, Sandals & Heels Online in India",
      },
    ],
    url: "https://shopmarkline.in/",
    locale: "en_IN",
    siteName: "Markline",
    type: "website",
  },

  other: {
    "p:domain_verify": "0cfd1273da4c08cf31f94cac004636fb",
    "facebook-domain-verification": "2mp1pqqmntoax63bh38i4qrywjtivw",
  },
};

// skdfhksdhksjdfh

export function mergeMetadata(pageMetadata: Metadata): Metadata {
  return {
    ...metadata,
    ...pageMetadata,
    openGraph: {
      ...metadata.openGraph,
      ...pageMetadata.openGraph,
      images: metadata.openGraph?.images,
    },
    twitter: {
      ...metadata.twitter,
      ...pageMetadata.twitter,
      images: metadata.twitter?.images, // Always use global Twitter images
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch global header data server-side
  const { data: headerData } = await mysupabase
    .from("header")
    .select("*");

  return (
    // <html lang="en">

    //   <body
    //     className={`${geistSans.variable} ${geistMono.variable} ${jakarta.variable} ${noto.variable} antialiased`}
    //   >
    //     <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_TAGMANAGER||""}/>
    //     <Provider>
    //       <WishlistProvider>
    //         <CartProvider>
    //             <Navbar />
    //               {children}
    //             <Subcribes/>
    //             <Footer />
    //             <Toaster/>
    //          <OrderConfirmed/>
    //         </CartProvider>
    //       </WishlistProvider>
    //     </Provider>
    //   </body>
    // </html>
    <html lang="en">
      <head>
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
        >
          {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${process.env.NEXT_PUBLIC_META_PIXEL_ID}');
          fbq('track', 'PageView');
          `}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Markline",
              url: "https://shopmarkline.in",
              logo: "https://shopmarkline.in/markline-logo.webp",
              contactPoint: [
                {
                  "@type": "ContactPoint",
                  telephone: "+91-9769020660",
                  contactType: "customer support",
                  areaServed: "IN",
                  availableLanguage: ["English", "Hindi"],
                },
              ],
              sameAs: [
                "https://www.instagram.com/shopmarkline",
                "https://www.facebook.com/shopmarkline",
                "https://in.pinterest.com/shopmarkline",
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${jakarta.variable} ${noto.variable} antialiased`}
      >
        <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_TAGMANAGER || ""} />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none", visibility: "hidden" }}
            src={`https://www.facebook.com/tr?id='${process.env.NEXT_PUBLIC_META_PIXEL_ID}'&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>

        <Provider>
          <WishlistProvider>
            <CartProvider>
              <Header initialData={headerData || []} />
              <Navbar />
              {children}
              <Subcribes />
              <Footer />
              <Toaster />
              <OrderConfirmed />
              <FloatingWhatsApp />
            </CartProvider>
          </WishlistProvider>
        </Provider>
      </body>
    </html>
  );
}
