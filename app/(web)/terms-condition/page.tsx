import React from 'react'
import Link from 'next/link'
import { mergeMetadata } from '@/app/layout';

export const metadata = mergeMetadata({
  title: "Terms and Conditions | Markline",
  description:
    "Review the official Terms and Conditions of Markline (shopmarkline.in). Understand our policies on order processing, pricing, payments, shipping, returns, and acceptable use.",
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  openGraph: {
    title: "Terms and Conditions | Markline",
    description:
      "Review the official Terms and Conditions of Markline. Learn about our user guidelines, order acceptance, payments, shipping, and return policies.",
    url: "https://shopmarkline.in/terms-condition",
  },
  alternates: {
    canonical: `https://shopmarkline.in/terms-condition`,
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

                <p className="text-base font-medium text-primary">
                    Welcome to Markline (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;). These Terms and Conditions govern your access to and use of our website located at{" "}
                    <Link href={'/'} className="underline font-semibold">https://shopmarkline.in</Link>, including all content, features, product purchases, and customer services provided by Markline. Please read these terms carefully before placing an order.
                </p>

                {/* 1. Acceptance of Terms */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold tracking-tight">1. Acceptance of Terms</h2>
                    <p>
                        By accessing, browsing, registering an account, or purchasing apparel and fashion products on <Link href={'/'} className="text-primary font-medium underline">shopmarkline.in</Link>, you acknowledge that you have read, understood, and agree to be legally bound by these Terms and Conditions, our <Link href={'/privacy-policy'} className="text-primary underline">Privacy Policy</Link>, <Link href={'/shipping-policy'} className="text-primary underline">Shipping Policy</Link>, <Link href={'/return-policy'} className="text-primary underline">Return Policy</Link>, and <Link href={'/claim-policy'} className="text-primary underline">Product Claim Policy</Link>.
                    </p>
                    <p>
                        If you do not agree with any part of these Terms and Conditions, you must immediately discontinue your use of the website.
                    </p>
                </section>

                {/* 2. Changes to Terms */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold tracking-tight">2. Changes to Terms</h2>
                    <p>
                        We reserve the right to revise, update, or modify these Terms and Conditions at any time without prior individual notice. Any modifications will be effective immediately upon posting to this page with the updated revision date. Your continued use of the Website following any changes constitutes your binding acceptance of the revised Terms.
                    </p>
                </section>

                {/* 3. Eligibility & Account Security */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold tracking-tight">3. Eligibility & Account Responsibility</h2>
                    <p>
                        You must be at least 18 years of age or accessing the Website under the active supervision of a parent or legal guardian to make a purchase. By placing an order, you represent that you possess the legal capacity to enter into binding agreements.
                    </p>
                    <p>
                        If you create an account on Markline, you are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account. You agree to provide accurate, current, and complete contact and delivery details during registration and checkout.
                    </p>
                </section>

                {/* 4. Product Information & Sizing */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold tracking-tight">4. Product Information & Accuracy</h2>
                    <p>
                        We take every effort to display our fashion products, garment specifications, fabrics, and colors as accurately as possible. However, due to variations in photography lighting and individual screen calibrations, slight color or tone differences may occur.
                    </p>
                    <p>
                        All product dimensions and size charts are provided as standard guidelines. We reserve the right to modify product specifications, availability, or discontinue items at any time without liability.
                    </p>
                </section>

                {/* 5. Pricing & Payments */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold tracking-tight">5. Pricing & Payment Terms</h2>
                    <ul className="w-full relative flex flex-col gap-2 text-base list-disc list-inside">
                        <li>All product prices displayed on the Website are in Indian Rupees (INR) and are inclusive of applicable goods and services taxes (GST) unless explicitly stated otherwise.</li>
                        <li>We accept secure online payments via Credit/Debit Cards, Net Banking, UPI, and Digital Wallets processed through RBI-authorized, PCI-DSS compliant payment gateways (such as Razorpay).</li>
                        <li>Cash on Delivery (COD) may be available for select serviceable pin codes across India. Markline reserves the right to verify COD orders via phone or SMS prior to dispatch.</li>
                        <li>In the event of an inadvertent technical or pricing error, Markline reserves the right to cancel any order placed at the incorrect price and issue a full refund if payment was already received.</li>
                    </ul>
                </section>

                {/* 6. Order Acceptance & Cancellation */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold tracking-tight">6. Order Acceptance & Cancellation</h2>
                    <p>
                        Receipt of an order confirmation email or SMS does not constitute our final acceptance of an order. We reserve the right, in our sole discretion, to refuse or cancel any order for reasons including:
                    </p>
                    <ul className="w-full relative flex flex-col gap-1 text-base list-disc list-inside">
                        <li>Unavailability of product stock or fabric inventory.</li>
                        <li>Incomplete, inaccurate, or unserviceable shipping addresses or non-functional contact numbers.</li>
                        <li>Suspected fraudulent, unauthorized, or suspicious payment activities.</li>
                        <li>Failure of customer confirmation for Cash on Delivery (COD) shipments.</li>
                    </ul>
                    <p className="mt-2">
                        If your order is cancelled after your payment has been processed, we will initiate a prompt reversal/refund to your original payment method.
                    </p>
                </section>

                {/* 7. Shipping & Delivery */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold tracking-tight">7. Shipping & Delivery</h2>
                    <p>
                        We partner with reliable domestic logistics providers to deliver orders across India. Estimated delivery times, shipping charges, and order tracking details are governed by our <Link href={'/shipping-policy'} className="text-primary font-medium underline">Shipping Policy</Link>.
                    </p>
                    <p>
                        While we strive to deliver all orders within the estimated timeline, delays may occasionally occur due to logistics transit bottlenecks, weather conditions, or festive surges. We will keep you informed of any substantial delays via email or SMS.
                    </p>
                </section>

                {/* 8. Returns, Exchanges & Refunds */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold tracking-tight">8. Returns, Exchanges & Refunds</h2>
                    <p>
                        Customer satisfaction is our priority. If you receive a damaged, defective, or incorrect apparel item, please refer to our comprehensive <Link href={'/return-policy'} className="text-primary font-medium underline">Return Policy</Link> and <Link href={'/claim-policy'} className="text-primary font-medium underline">Product Claim Policy</Link> for step-by-step instructions on initiating returns and claim verification.
                    </p>
                    <p>
                        Returned items must be unused, unwashed, in their original condition with all product tags and packaging intact.
                    </p>
                </section>

                {/* 9. User Conduct & Acceptable Use */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold tracking-tight">9. User Conduct & Prohibited Activities</h2>
                    <p>When using our Website, you agree not to engage in any of the following prohibited activities:</p>
                    <ul className="w-full relative flex flex-col gap-1 text-base list-disc list-inside">
                        <li>Violate any local, state, national, or international laws or regulations.</li>
                        <li>Infringe upon the intellectual property, copyright, or trademark rights of Markline or third parties.</li>
                        <li>Transmit or upload malicious code, viruses, automated bots, scrapers, or harmful software.</li>
                        <li>Attempt to gain unauthorized access to our servers, user accounts, database systems, or networks.</li>
                        <li>Submit false, misleading, abusive, defamatory, or fraudulent order details or reviews.</li>
                    </ul>
                </section>

                {/* 10. Intellectual Property */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold tracking-tight">10. Intellectual Property Rights</h2>
                    <p>
                        All content hosted on this Website — including brand trademarks, logos, brand names, product photographs, text descriptions, graphics, UI design, illustrations, and source code — is the exclusive property of Markline and is protected under Indian and international copyright and trademark laws.
                    </p>
                    <p>
                        You may not reproduce, copy, distribute, license, scrape, or commercially exploit any content from this Website without prior written consent from Markline.
                    </p>
                </section>

                {/* 11. Third-Party Links */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold tracking-tight">11. Third-Party Links</h2>
                    <p>
                        Our Website may contain links to third-party websites or services (such as payment gateways and social media channels like Instagram, Facebook, and Pinterest). Markline is not responsible for the content, privacy practices, or accuracy of any third-party websites. Accessing external links is done entirely at your own discretion.
                    </p>
                </section>

                {/* 12. Limitation of Liability */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold tracking-tight">12. Limitation of Liability</h2>
                    <p>
                        To the maximum extent permitted by applicable Indian law, Markline and its representatives shall not be liable for any indirect, incidental, punitive, or consequential damages resulting from the use or inability to use the Website, delay in delivery, or any products purchased through the platform.
                    </p>
                    <p>
                        Our total aggregate liability arising out of or related to any order shall not exceed the actual purchase amount paid by the customer for the specific product in question.
                    </p>
                </section>

                {/* 13. Governing Law & Jurisdiction */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold tracking-tight">13. Governing Law & Dispute Resolution</h2>
                    <p>
                        These Terms and Conditions and any transactions concluded on this Website are governed by and construed in accordance with the laws of the Republic of India.
                    </p>
                    <p>
                        Any dispute, claim, or controversy arising out of or relating to these Terms, orders, or services shall be subject to the exclusive jurisdiction of the competent courts located in <strong>Mumbai, Maharashtra, India</strong>.
                    </p>
                </section>

                {/* 14. Contact Us */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold tracking-tight">14. Contact Information & Support</h2>
                    <p>If you have any questions, clarifications, or feedback regarding these Terms and Conditions, please contact our customer support team:</p>
                    <ul className="w-full relative flex flex-col gap-1.5 text-base list-disc list-inside">
                        <li>
                            <strong>Email:</strong>{" "}
                            <Link href={'mailto:stylemarkline@gmail.com'} className="text-primary font-medium underline">
                                stylemarkline@gmail.com
                            </Link>
                        </li>
                        <li>
                            <strong>Helpline Numbers:</strong>{" "}
                            <Link href={'tel:+919703456322'} className="text-primary font-medium underline">
                                +91 9703456322
                            </Link>{" "}
                            /{" "}
                            <Link href={'tel:+919769020660'} className="text-primary font-medium underline">
                                +91 9769020660
                            </Link>
                        </li>
                        <li>
                            <strong>Support Hours:</strong> Monday to Sunday (10:00 AM – 06:00 PM IST)
                        </li>
                        <li>
                            <strong>Registered Office Address:</strong> ROOM NO 165 INDRA NAGAR, NR-BARMA SHEEL RAILWAY LINE, KURLA EAST, NEHRU NAGAR, MUMBAI 400024, MAHARASHTRA, INDIA
                        </li>
                    </ul>
                </section>
            </div>
        </div>
    )
}

export default page