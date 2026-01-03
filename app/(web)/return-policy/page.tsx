import React from 'react'
import { mergeMetadata } from '@/app/layout';
export const metadata = mergeMetadata({
    title: "Return Policy | Markline",
    description:
        "Read Markline’s return policy to learn about eligibility, timeframes, and conditions for returning or exchanging your purchase.",
    robots: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
    },
    openGraph: {
        title: "Return Policy | Markline",
        description:
            "We want you to love your purchase. Review our return policy to ensure a smooth return or exchange process.",
        url: "https://shopmarkline.in/return-policy",
    },
    alternates: {
        canonical: `https://shopmarkline.in/return-policy`,
    },
});

function Returnpolicy() {
    const date = new Date().toLocaleDateString()
    return (
        <div className="container mx-auto px-5 md:px-5 py-8 text-gray-800">
            <div className="space-y-8">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                        Return & Exchange Policy
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Last Updated: {date}
                    </p>
                </div>

                {/* Introduction */}
                <section className="space-y-4">
                    <h2 className="text-base md:text-2xl font-semibold tracking-tight">
                        Introduction
                    </h2>
                    <p className="text-sm md:text-base">
                        At <strong>Markline</strong>, every pair of footwear is carefully
                        handcrafted to deliver the perfect balance of style, comfort, and
                        durability. Since our products are made with precision and attention
                        to detail, we follow a transparent and fair return and exchange policy
                        to ensure the best experience for our customers.
                    </p>
                </section>

                {/* Return Conditions */}
                <section className="space-y-4">
                    <h2 className="text-base md:text-2xl font-semibold tracking-tight">
                        Eligibility for Returns & Exchanges
                    </h2>

                    <p className="text-sm md:text-base">
                        Returns or exchanges are accepted only under the following conditions:
                    </p>

                    <ul className="list-disc list-inside text-sm md:text-base">
                        <li>The product must be unused, unworn, and in original condition</li>
                        <li>
                            Original packaging, tags, box, and labels must be intact
                        </li>
                        <li>
                            The request must be raised within{" "}
                            <strong>7 days</strong> of delivery
                        </li>
                        <li>
                            Valid photo or video proof must be provided where applicable
                        </li>
                    </ul>

                    <p className="text-sm md:text-base">
                        Please note: Products showing signs of wear, damage due to misuse,
                        or improper handling will not be eligible for return or exchange.
                    </p>
                </section>

                {/* Non-Returnable */}
                <section className="space-y-4">
                    <h2 className="text-base md:text-2xl font-semibold tracking-tight">
                        Non-Returnable Items
                    </h2>

                    <p className="text-sm md:text-base">
                        The following items are not eligible for return or exchange:
                    </p>

                    <ul className="list-disc list-inside text-sm md:text-base">
                        <li>Sale or discounted products</li>
                        <li>Customized or special-order footwear</li>
                        <li>Products damaged due to regular wear and tear</li>
                    </ul>
                </section>

                {/* Return Process */}
                <section className="space-y-4">
                    <h2 className="text-base md:text-2xl font-semibold tracking-tight">
                        Return / Exchange Process
                    </h2>

                    <p className="text-sm md:text-base">
                        To initiate a return or exchange:
                    </p>

                    <ol className="list-decimal list-inside text-sm md:text-base">
                        <li>
                            Contact us at{" "}
                            <strong>stylemarkline@gmail.com</strong> within 7 days of delivery
                        </li>
                        <li>
                            Share your Order ID, product details, and reason for return
                        </li>
                        <li>
                            Attach clear images or videos showing the issue (if applicable)
                        </li>
                        <li>
                            Our team will review and guide you through the next steps
                        </li>
                    </ol>

                    <p className="text-sm md:text-base">
                        If approved, return pickup or shipping instructions will be shared
                        by our support team.
                    </p>
                </section>

                {/* Exchange Policy */}
                <section className="space-y-4">
                    <h2 className="text-lg md:text-2xl font-semibold tracking-tight">
                        Exchange Policy
                    </h2>

                    <p className="text-sm md:text-base">
                        As a handcrafted footwear brand, <strong>Markline prioritizes exchanges
                            over refunds</strong>. If you receive a defective, damaged, or incorrect
                        product, we will replace it with the same product or offer an exchange
                        of equal value, subject to availability.
                    </p>
                </section>

                {/* Refund Policy */}
                <section className="space-y-4">
                    <h2 className="text-lg md:text-2xl font-semibold tracking-tight">
                        Refund Policy
                    </h2>

                    <p className="text-sm md:text-base">
                        Refunds are issued only if an exchange or replacement is not possible.
                        Approved refunds will be processed to the original payment method
                        within <strong>5–7 business days</strong> after inspection of the
                        returned product.
                    </p>
                </section>

                {/* Warranty */}
                <section className="space-y-4">
                    <h2 className="text-lg md:text-2xl font-semibold tracking-tight">
                        Warranty & Repairs
                    </h2>

                    <p className="text-sm md:text-base">
                        Markline does not offer warranty or repair services for products
                        purchased during sales or promotional discounts. Such items are
                        considered final sale.
                    </p>
                </section>

                {/* Contact */}
                <section className="space-y-4">
                    <h2 className="text-lg md:text-2xl font-semibold tracking-tight">
                        Contact Us
                    </h2>

                    <p className="text-sm md:text-base">
                        For any questions regarding returns or exchanges, please contact us:
                    </p>

                    <address className="not-italic text-sm md:text-base">
                        <p><strong>Brand:</strong> Markline</p>
                        <p><strong>Email:</strong> stylemarkline@gmail.com</p>
                        <p><strong>Phone:</strong> +91-9702456322</p>
                        <p><strong>Hours:</strong> Monday – Saturday | 10 AM – 6 PM IST</p>
                    </address>
                </section>

            </div>
        </div>


    )
}

export default Returnpolicy