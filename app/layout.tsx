import type { Metadata } from "next";
import localFont from "next/font/local";
import Navbar from "@/components/Common/Navbar";
import { Noto_Sans, Plus_Jakarta_Sans } from 'next/font/google';
import "./globals.css";
import { CartProvider } from "@/Contexts/Cart.context";
import Provider from "./Provider";
import Footer from "@/components/Common/Footer";
import { WishlistProvider } from "@/Contexts/wishlist";


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
  title: "Markline Fashion | Elegance in Every Step",
  description: "Markline Fashion brings you luxurious footwear and fashion accessories crafted for elegance, comfort, and confidence. Step into your style with our premium collections.",
  metadataBase: new URL("https://marklinefashion.com"),
  twitter: {
    card: "summary_large_image",
    title: "Markline Fashion | Luxury Footwear & Accessories",
    description: "Discover timeless style with Markline Fashion – premium shoes, bags, and accessories for modern elegance.",
    images: "/opengraph-image.png",
    site: "@marklinefashion",
  },
  openGraph: {
    title: "Markline Fashion | Elegance in Every Step",
    description: "Luxury fashion brand offering high-end footwear, bags, and accessories designed to elevate your style with sophistication and flair.",
    images: [
      {
        // new new adsdg
        url: "/opengraph-image.png",
        width: 4800,
        height: 2520,
        alt: "Markline Fashion - Luxury Footwear & Accessories",
      },
    ],
    url: "https://marklinefashion.com",
    locale: "en_us",
    siteName: "Markline Fashion",
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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${jakarta.variable} ${noto.variable} antialiased`}
      >
        <Provider>
          <WishlistProvider>
            <CartProvider>
                <Navbar />
                {children}
                <Footer />
            </CartProvider>
          </WishlistProvider>
        </Provider>
      </body>
    </html>
  );
}
