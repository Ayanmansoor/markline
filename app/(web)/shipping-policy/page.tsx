
import { mergeMetadata } from "@/app/layout";
import Link from "next/link"

export const metadata = mergeMetadata({
  title: "Shipping Policy | Markline",
  description:
    "Learn about Markline's shipping policy. Find information on delivery times, shipping methods, order processing, and international shipping options.",
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  openGraph: {
    title: "Shipping Policy | Markline",
    description:
      "Discover how Markline ensures timely and reliable shipping. Get details on domestic and international shipping, tracking, and delivery timelines.",
    url: "https://shopmarkline.in/shipping-policy",
  },
  alternates: {
    canonical: `https://shopmarkline.in/shipping-policy`,
  },
});

export default function ShippingPolicy() {
  return (

    <div className="container mx-auto px-5 lg:px-10 xl:px-20 2xl:px-40 py-8 text-primary">
      <div className="space-y-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight">
            Shipping & Return Policy
          </h1>
          <p className="text-muted-foreground mt-2">
            Last Updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Order Processing */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            Order Processing & Dispatch
          </h2>
          <p>
            At Markline, every pair of footwear is carefully crafted and quality-checked
            to ensure comfort, durability, and perfect finishing.
          </p>
          <p>
            Orders are dispatched within <strong>2–3 business days</strong> after order
            confirmation (excluding Sundays and public holidays). This time allows us
            to prepare each pair with precision and care.
          </p>
        </section>

        {/* Shipping */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            Shipping Charges & Delivery Time
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse mt-2">
              <thead>
                <tr className="bg-muted">
                  <th className="border p-2 text-left">Shipping Method</th>
                  <th className="border p-2 text-left">Estimated Delivery Time</th>
                  <th className="border p-2 text-left">Cost</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-green-50 font-medium">
                  <td className="border p-2">Standard Shipping</td>
                  <td className="border p-2">4–7 business days</td>
                  <td className="border p-2 text-green-600">FREE</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            We currently offer <strong>FREE SHIPPING across India</strong> with no
            minimum order value.
          </p>
        </section>

        {/* Tracking */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            Order Tracking
          </h2>
          <p>
            Once your order is shipped, you will receive tracking details via email
            or SMS. You can track your order using the provided tracking link.
          </p>
        </section>

        {/* Restrictions */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            Shipping Restrictions
          </h2>
          <ul className="flex flex-col gap-1 text-base">
            <li>We currently ship only within India.</li>
            <li>We do not ship to P.O. Boxes or military addresses (APO/FPO).</li>
            <li>Some remote locations may have limited delivery availability.</li>
          </ul>
        </section>

        {/* Damaged / Lost */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            Lost, Delayed, or Damaged Shipments
          </h2>
          <p>
            While we work with trusted courier partners, delays may occur due to
            unforeseen circumstances.
          </p>
          <ul className="flex flex-col gap-1 text-base">
            <li>Please wait a few extra days beyond the estimated delivery time.</li>
            <li>
              If the issue persists, contact us at{" "}
              <Link href="mailto:stylemarkline@gmail.com">
                stylemarkline@gmail.com
              </Link>
            </li>
          </ul>
        </section>

        {/* Returns */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            Return, Exchange & Replacement Policy
          </h2>

          <p className="text-lg font-medium text-primary">
            Exchange & Replacement First Policy
          </p>

          <p>
            Since Markline footwear is handcrafted with care, we follow an
            <strong> exchange-first policy</strong> to ensure sustainability and
            quality assurance.
          </p>

          <ul className="flex flex-col gap-1 text-base">
            <li>Exchange or replacement requests must be made within <strong>7 days</strong> of delivery.</li>
            <li>Products must be unused, unworn, and returned with original packaging and tags.</li>
            <li>Exchange is applicable for size issues, defects, or incorrect products.</li>
          </ul>
        </section>

        {/* Refunds */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            Refund Policy
          </h2>
          <p>
            Refunds are provided <strong>only in rare cases</strong>, such as:
          </p>
          <ul className="flex flex-col gap-1 text-base">
            <li>If the replacement product is unavailable</li>
            <li>If a verified manufacturing defect cannot be resolved via exchange</li>
          </ul>
          <p>
            Approved refunds are processed to the original payment method within
            <strong> 5–7 business days</strong>.
          </p>
        </section>

        {/* Non Returnable */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            Items Not Eligible for Return
          </h2>
          <ul className="flex flex-col gap-1 text-base">
            <li>Worn, used, or damaged products</li>
            <li>Products without original packaging or tags</li>
            <li>Requests raised after 7 days of delivery</li>
          </ul>
        </section>

        {/* Contact */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            Contact Us
          </h2>
          <p>
            For any shipping, exchange, or return-related queries, reach out to us:
          </p>
          <address className="not-italic text-base">
            <p>Email: stylemarkline@gmail.com</p>
            <p>Phone: +91-9702456322</p>
            <p>Hours: Monday – Friday | 10 AM – 6 PM IST</p>
          </address>
        </section>
      </div>
    </div>

  )
}

