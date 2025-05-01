import { mergeMetadata } from "@/app/layout";
import FeedbackForm from "@/components/Forms/FeedbackForm";
import Link from "next/link";
import React from "react";
import { BsLinkedin } from "react-icons/bs";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa6";
export const metadata = mergeMetadata({
    title: "Feedback | Markline Fashion – We Value Your Opinion",
    description:
      "Share your thoughts and experiences with Markline Fashion. Your feedback helps us improve our luxury fashion offerings and deliver exceptional service.",
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
    openGraph: {
      title: "Feedback | Markline Fashion – We Value Your Opinion",
      description:
        "Let us know how we're doing at Markline Fashion. Your feedback ensures we continue offering top-tier fashion and customer satisfaction.",
      url: "https://marklinefashion.com/feedback",
    },
    alternates: {
      canonical: "https://marklinefashion.com/feedback",
    },
  });

function Feedback() {
    return (
        <>
            <section className="w-full relative h-full py-10 md:py-20 container grid   grid-cols-1 md:grid-cols-[1fr_1fr]  gap-5 md:gap-10 lg:gap-20 xl:gap-20 px-5  md:px-10   xl:px-20 ">
                <FeedbackForm />
                <div
                    className="w-full gap-3  sticky lg:sticky lg:top-20 h-fit 
         flex flex-col"
                >
                    <h2 className="text-2xl font-medium text-foreground  ">Contact Us</h2>

                    <span className="w-full relative h-auto flex flex-col gap-1 ">
                        <h2 className="w-full text-xl   font-medium  text-fontPrimary  ">
                            Contact :
                        </h2>
                        <div className="w-full relative flex  flex-wrap items-center gap-3 md:gap-5 ">
                            <Link
                                href={"tel:(+91) 9773141989"}
                                className="text-lg font-medium  text-fontPrimary "
                            >
                                (+91) 9702456322
                            </Link>
                            /
                            <Link
                                href={"tel:(+91) 9773141989"}
                                className="text-lg font-medium text-fontPrimary  "
                            >
                                (+91) 9702456322
                            </Link>
                        </div>
                    </span>

                    <div className="w-full relative flex  flex-wrap items-centergap-3 md:gap-3 ">
                        <h2 className="w-full text-xl font-medium text-fontPrimary  ">
                            Email :
                        </h2>
                        <Link href={"/"} className="text-lg font-medium text-fontPrimary">
                            info.marklinefashion@gmail.com
                        </Link>
                        /
                        <Link
                            href={"melto:sales.pcdpl@gmail.com"}
                            className="text-lg font-medium text-fontPrimary"
                        >
                            info.marklinefashion@gmail.com
                        </Link>
                    </div>

                    <div className="w-full relative flex  flex-wrap items-center gap-5 ">
                        <Link
                            href={"/"}
                            className="text-p18 font-medium bg-primary rounded-full p-2 text-webtext "
                        >
                            <FaFacebook className="text-white text-[25px]" />
                        </Link>
                        <Link
                            href={"/"}
                            className="text-p18 font-medium bg-primary p-2 rounded-full text-webtext "
                        >
                            <FaTwitter className="text-[25px] text-white " />
                        </Link>

                        <Link
                            href={"/"}
                            className="text-p18 font-medium bg-primary rounded-full p-2 text-webtext "
                        >
                            <FaInstagram className="text-white text-[25px]" />
                        </Link>
                        <Link
                            href={"/"}
                            className="text-p18 font-medium bg-primary p-[10px] rounded-full text-webtext "
                        >
                            <BsLinkedin className="text-[20px] text-white " />
                        </Link>
                        <Link
                            href={"/"}
                            className="text-p18 font-medium bg-primary p-2 rounded-full text-webtext "
                        >
                            <FaYoutube className="text-[25px] text-white " />
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Feedback