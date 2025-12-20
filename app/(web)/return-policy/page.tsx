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
    const date=new Date().toLocaleDateString()
    return (
        <div className="container mx-auto px-5 md:px-5 py-8 text-gray-800">
            <div className="space-y-8">
                <div className="text-center mb-10">
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Return Policy</h1>
                    <p className="text-muted-foreground mt-2">Last Updated: {date}</p>
                </div>

                <section className="space-y-4">
                    <h2 className="text-base md:text-2xl font-semibold tracking-tight">Introduction</h2>
                    <p className="text-sm md:text-base">
                        At [Your Brand Name], we want you to be completely satisfied with your purchase. Our return policy ensures
                        that you can return unused and undamaged items within a specific timeframe. Please review our policy for details
                        on how to make a return.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-base md:text-2xl font-semibold tracking-tight">Return Conditions</h2>
                    <p className="text-sm md:text-base">
                        Returns will only be accepted if the items are unused, in their original condition, and packaging (including
                        labels, tags, boxes, or plastic wraps). To be eligible for a refund, the return request must be made within
                        15 days from the date you receive the item.
                    </p>
                    <p className="text-sm md:text-base">
                        Please note that SALE items, Shoes , Bags, and Accessories (except Belts)  are non-returnable, non-refundable, and
                        non-replaceable.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-base md:text-2xl font-semibold tracking-tight">Return Process</h2>
                    <p className="text-sm md:text-base">
                        To initiate a return, please log in to your account on our website and navigate to the My Orders section.
                        From there, you can raise a return request. If your item is broken, we will be happy to repair it for you.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-lg md:text-2xl font-semibold tracking-tight">Refunds</h2>
                    <p className="text-sm md:text-base">
                        Once your return is approved, a refund will be processed back to the original payment method. Please allow some
                        time for the refund to be reflected in your account, depending on your payment provider.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-lg md:text-2xl font-semibold tracking-tight">Exchanges</h2>
                    <p className="text-sm md:text-base">
                        We currently do not offer exchanges. If you wish to exchange an item, you will need to return it and place a
                        new order.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-lg md:text-2xl font-semibold tracking-tight">Contact Us</h2>
                    <p className="text-sm md:text-base">
                        If you have any questions or concerns about your return or refund, please contact our customer service team:
                    </p>
                    <div className="not-prose">
                        <address className="not-italic text-sm md:text-base">
                            <p>Markline</p>
                            {/* <p>[Your Address]</p>
                            <p>[Your City, State/Province, ZIP/Postal Code]</p>
                            <p>[Your Country]</p>
                            <p>Email: support@[yourbrand].com</p>
                            <p>Phone: [Your Phone Number]</p> */}
                        </address>
                    </div>
                </section>

                {/* Warranty/Guarantee Policy Section */}
                <section className="space-y-4">
                    <h2 className="text-lg md:text-2xl font-semibold tracking-tight">Warranty/Guarantee Policy</h2>
                    <p className="text-sm md:text-base">
                        Please note that no warranty, guarantee, exchange, or repair services are offered for products that are sold at
                        a discounted price on our website. All products purchased at a discounted price are considered final sale.
                    </p>
                </section>

            </div>


        </div>

    )
}

export default Returnpolicy