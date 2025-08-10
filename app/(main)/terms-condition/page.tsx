import React from 'react'
import Link from 'next/link'
import { mergeMetadata } from '@/app/layout';
export const metadata = mergeMetadata({
  title: " Terms Condition  | Markline",
  description:
    "Learn about Markline's Terms Condition. Find information on delivery times, shipping methods, order processing, and international shipping options.",
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  openGraph: {
    title: "Terms Condition | Markline",
    description:
      "Discover how Markline ensures timely and reliable shipping. Get details on domestic and international shipping, tracking, and delivery timelines.",
    url: "https://marklinefashion.vercel.app/terms-condition",
  },
  alternates: {
    canonical: `https://marklinefashion.vercel.app/terms-condition`,
  },
});
function page() {
    return (
        <div className="container mx-auto px-5 md:px-5 py-8 text-gray-800">
            <div className="space-y-8">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold tracking-tight">Terms and Conditions</h1>
                    <p className="text-muted-foreground mt-2">Last Updated: {new Date().toLocaleDateString()}</p>
                </div>



                <p>
                    Welcome to Markline. By using our website and purchasing products from us, you agree to the following terms and conditions. Please read them carefully before using our services.
                </p>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold tracking-tight">Acceptance of Terms</h2>
                    <p>
                        By accessing or using   <Link href={'/'}>www.marklinefashion.com</Link>, you agree to be bound by these Terms and Conditions and all applicable laws. If you do not agree with any of these terms, please do not use this website.
                    </p>
                    <p>
                        In case of any delay, we will notify you via email or phone. Please ensure your contact details are accurate at checkout.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold tracking-tight">Changes to Terms</h2>
                    <p>We reserve the right to update or modify these Terms and Conditions at any time without prior notice. Your continued use of the site after any changes constitutes your acceptance of the new Terms.</p>


                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold tracking-tight">Eligibility</h2>
                    <p>
                        You must be at least 18 years old or accessing the website under the supervision of a parent or legal guardian to make a purchase from Markline.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold tracking-tight"> Product Information</h2>
                    <p>
                        We strive to display our products as accurately as possible. However, we do not guarantee that descriptions, colors, pricing, or other content is accurate, complete, reliable, or error-free. Minor variations may occur due to photographic and screen differences.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold tracking-tight"> Pricing & Payment</h2>

                    <ul className="w-full relative flex flex-col gap-1 text-base ">
                        <li>All prices are listed in Indian Rupees (INR) and are inclusive of applicable taxes unless stated otherwise.</li>
                        <li className=" flex items-center gap-1 ">
                            We accept payments via credit/debit cards, UPI, wallets, net banking, and other secure payment gateways.
                        </li>
                        <li className=" flex items-center gap-1 ">
                            We reserve the right to change prices or discontinue products at any time without notice.
                        </li>
                    </ul>
                </section>


                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold tracking-tight">Order Acceptance</h2>
                    <p>We reserve the right to refuse or cancel any order for any reason, including limitations on quantities available, errors in product or pricing information, or concerns about fraudulent activity.</p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold tracking-tight">Shipping & Delivery</h2>
                    <p>Please refer to our Shipping Policy for detailed information on order processing, delivery timelines, and shipping charges.</p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold tracking-tight"> Returns & Refunds</h2>
                    <p className="text-lg font-medium text-primary">Please review our Return & Refund Policy for information on returning items and requesting refunds.
                    </p>

                </section>



                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold tracking-tight"> User Conduct</h2>
                    <p className="text-lg font-medium text-primary">For any questions or concerns related to shipping, please contact our customer service at:</p>
                    <ul className="w-full relative flex flex-col gap-1 text-base ">
                        <li>Violate any applicable laws</li>
                        <li>Infringe upon any intellectual property rights</li>
                        <li>Post or transmit harmful, abusive, or defamatory content</li>
                        <li>Attempt to gain unauthorized access to our systems</li>
                    </ul>
                </section>



                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold tracking-tight"> Intellectual Property</h2>
                    <p>All content on this website — including text, images, logos, graphics, and code — is the property of Markline and protected by copyright and trademark laws. You may not reproduce, distribute, or use any content without our prior written permission.</p>

                </section>


                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold tracking-tight">Third-Party Links</h2>
                    <p>Our site may contain links to third-party websites. We are not responsible for the content, privacy policies, or practices of any third-party sites.</p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold tracking-tight">Limitation of Liability</h2>
                    <p>Markline is not liable for any indirect, incidental, or consequential damages arising from your use of the website or purchase of products. All products are provided “as is” without warranties of any kind..</p>
                </section>


                   <section className="space-y-4">
                    <h2 className="text-2xl font-semibold tracking-tight">Governing Law</h2>
                    <p>These Terms are governed by and construed in accordance with the laws of India. Any disputes arising from these Terms will be subject to the exclusive jurisdiction of the courts of  Mumbai, Maharashtra .</p>
                </section>

                       <section className="space-y-4">
                    <h2 className="text-2xl font-semibold tracking-tight">Contact Us</h2>
                    <p>If you have any questions about these Terms and Conditions, please contact us:</p>
                    <p className='flex items-center gap-1 '>
                        <strong>Email:</strong> 
                        <Link href={'melto:stylemarkline@gmail.com'}>stylemarkline@gmail.com</Link>
                    </p>
                </section>


            </div>


        </div>
    )
}

export default page