import type { Metadata } from "next";
import localFont from "next/font/local";
import Navbar from "@/components/Common/Navbar";
import { Noto_Sans, Plus_Jakarta_Sans } from 'next/font/google';
import "./globals.css";
import { CartProvider } from "@/Contexts/Cart.context";
import Provider from "./Provider";
import Footer from "@/components/Common/Footer";
import { WishlistProvider } from "@/Contexts/wishlist";
import { GoogleTagManager } from '@next/third-parties/google'
import Subcribes from "@/components/Common/Subcribes ";
import Head from 'next/head';
import OrderConfirmed from "@/components/Common/OrderConfirm";
import { Toaster } from "@/components/ui/sonner";
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
  title: "Markline | Elegance in Every Step",
  description: "Markline brings you luxurious footwear and fashion accessories crafted for elegance, comfort, and confidence. Step into your style with our premium collections.",
  metadataBase: new URL("https://marklinefashion.vercel.app/"),
  twitter: {
    card: "summary_large_image",
    title: "Markline | Luxury Footwear & Accessories",
    description: "Discover timeless style with Markline – premium shoes, bags, and accessories for modern elegance.",
    images: "/opengraph-image.png",
    site: "@marklinefashion",
  },
  openGraph: {
    title: "Markline | Elegance in Every Step",
    description: "Luxury fashion brand offering high-end footwear, bags, and accessories designed to elevate your style with sophistication and flair.",
    images: [
      {
        // new new adsdg
        url: "/opengraph-image.png",
        width: 4800,
        height: 2520,
        alt: "Markline - Luxury Footwear & Accessories",
      },
    ],
    url: "https://marklinefashion.vercel.app/",
    locale: "en_us",
    siteName: "Markline",
  },
};


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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id=${process.env.NEXT_PUBLIC_TAGMANAGER}'+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_TAGMANAGER}');
            `,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${jakarta.variable} ${noto.variable} antialiased`}>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_TAGMANAGER}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>

        <Provider>
          <WishlistProvider>
            <CartProvider>
              <Navbar />
              {children}
              <Subcribes />
              <Footer />
              <Toaster />
              <OrderConfirmed />
            </CartProvider>
          </WishlistProvider>
        </Provider>
      </body>
    </html>
  );
}
