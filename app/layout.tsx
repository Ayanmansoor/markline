import type { Metadata, Viewport } from "next";
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
import FcmNotificationHandler from "@/components/Common/FcmNotificationHandler";
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
  title: "Women’s Wedges, Heels & Fashion Sandals Online in India | Markline",

  description:
    "Shop stylish wedges, block heels, casual sandals, and festive footwear for women at Markline. Comfortable, lightweight, and elegant designs perfect for office, daily wear, parties, and weddings across India.",

  metadataBase: new URL("https://shopmarkline.in"),

  keywords: [
    // Brand
    "Markline",
    "Markline footwear",
    "Markline women footwear",
    "shopmarkline",

    // Core categories
    "women wedges",
    "wedge sandals for women",
    "platform wedges for women",
    "women block heels",
    "block heels for women",
    "pencil heels for women",
    "stiletto heels for women",
    "kitten heels for women",
    "party heels for women",
    "party wear sandals for women",
    "women heels online India",
    "fashion sandals for women",
    "casual sandals for women",
    "wedding sandals for women",
    "festive sandals for women",

    // Comfort + intent
    "comfortable wedges for women",
    "comfortable block heels for women",
    "lightweight wedge sandals",
    "cushioned sandals for women",
    "daily wear wedges for women",
    "office wear sandals for women",
    "comfortable heels for women",
    "soft footbed sandals women",

    // Occasion & styling
    "office wear heels for women",
    "party wear heels for women",
    "ethnic sandals for women",
    "heels for saree and dress",
    "trendy heels for women",
    "premium women footwear India",

    // Purchase intent
    "buy women wedges online India",
    "buy block heels online India",
    "buy pencil heels online India",
    "buy kitten heels online India",
    "buy party heels online India",
    "buy women sandals online",
    "women footwear online India",
    "women sandals under 1000",
    "affordable women footwear India",
    "best heels for women India",
  ],

  twitter: {
    card: "summary_large_image",
    title: "Women’s Wedges, Heels & Fashion Sandals Online | Markline",
    description:
      "Discover comfortable wedges, block heels, casual sandals, and festive footwear for women at Markline. Lightweight, stylish, and perfect for office, daily wear, and parties.",
    images: ["/opengraph-image.png"],
    site: "@shopmarkline",
  },

  openGraph: {
    title: "Women’s Wedges, Heels & Fashion Sandals Online | Markline",
    description:
      "Shop stylish wedges, block heels, casual sandals, and festive footwear for women at Markline. Comfortable, lightweight, and elegant designs for office, daily wear, parties, and weddings.",
    url: "https://shopmarkline.in/",
    siteName: "Markline",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Markline Women’s Wedges, Heels & Sandals",
      },
    ],
  },

  other: {
    "p:domain_verify": "0cfd1273da4c08cf31f94cac004636fb",
    "facebook-domain-verification": "2mp1pqqmntoax63bh38i4qrywjtivw",
  },
};

export const viewport: Viewport = {
  themeColor: "#007e06ff",
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
    <html lang="en" suppressHydrationWarning>
      <head>
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
              <FcmNotificationHandler />
              <OrderConfirmed />
              <FloatingWhatsApp />
            </CartProvider>
          </WishlistProvider>
        </Provider>
      </body>
    </html>
  );
}
