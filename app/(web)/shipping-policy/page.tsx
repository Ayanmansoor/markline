import { mergeMetadata } from "@/app/layout";
import Link from "next/link";

export const metadata = mergeMetadata({
  title: "Shipping Policy | Markline",
  description:
    "Learn about Markline's Shipping Policy. Fast dispatch within 2 days, standard delivery within 3-5 days, and out-of-zone delivery fee terms.",
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
      "Discover Markline's shipping timelines (dispatched within 2 days), delivery details, and out-of-zone delivery fees.",
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
            Shipping Policy
          </h1>
          <p className="text-muted-foreground mt-2">
            Last Updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Order Processing & Dispatch */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            Order Processing & Dispatch
          </h2>
          <p>
            At Markline, every product is carefully inspected and quality-checked
            to ensure premium comfort, perfect fitting, and superior durability.
          </p>
          <p>
            We dispatch orders <strong>within 2 business days</strong> (within 48 hours)
            after order confirmation. Once your order is dispatched from our facility, you
            will receive an instant dispatch alert along with tracking details.
          </p>
        </section>

        {/* Shipping Charges & Delivery Time */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            Shipping Charges & Delivery Timeline
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse mt-2 text-sm md:text-base">
              <thead>
                <tr className="bg-muted">
                  <th className="border p-2.5 text-left">Shipping Zone / Method</th>
                  <th className="border p-2.5 text-left">Estimated Delivery Timeline</th>
                  <th className="border p-2.5 text-left">Shipping Cost</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-green-50/60 font-medium">
                  <td className="border p-2.5">Standard In-Zone Delivery</td>
                  <td className="border p-2.5">3–5 business days (from dispatch)</td>
                  <td className="border p-2.5 text-green-700 font-semibold">FREE</td>
                </tr>
                <tr className="bg-amber-50/60 font-medium">
                  <td className="border p-2.5">Out-of-Zone / Remote Regions</td>
                  <td className="border p-2.5">5–7 business days</td>
                  <td className="border p-2.5 text-amber-800">
                    Delivery fee may apply if order is out of zone
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            We offer <strong>Free Standard Shipping</strong> across most serviceable pincodes in India.
            Please note that a nominal delivery fee may apply if the delivery address is categorized as 
            <strong> out of zone</strong>, remote, or requires special regional logistics. Any applicable 
            out-of-zone shipping fee is clearly displayed at checkout or confirmed prior to dispatch.
          </p>
        </section>

        {/* Order Tracking */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            Order Tracking
          </h2>
          <p>
            Once your order is dispatched within 2 business days, you will receive your courier tracking link and AWB number via 
            <strong> Email, SMS, or WhatsApp</strong>. You can easily track your package in real-time or check order status using our{" "}
            <Link href="/makline-order-tracker" className="text-primary font-semibold underline">
              Markline Order Tracker
            </Link>.
          </p>
        </section>

        {/* Shipping Restrictions */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            Shipping Restrictions
          </h2>
          <ul className="flex flex-col gap-1.5 text-base list-disc list-inside">
            <li>We currently ship to all serviceable postal pincodes across India.</li>
            <li>We do not deliver to P.O. Boxes or APO/FPO military addresses.</li>
            <li>Deliveries to out-of-zone or special remote areas may require additional transit time.</li>
          </ul>
        </section>

        {/* Lost / Delayed */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            Delayed, Damaged, or Transit Issues
          </h2>
          <p>
            While we partner with top-tier courier networks to ensure prompt delivery, unexpected delays may rarely occur due to adverse weather, festival volume surges, or regional transit restrictions.
          </p>
          <ul className="flex flex-col gap-1 text-base list-disc list-inside">
            <li>Please allow an additional 1–2 business days beyond the estimated delivery date during high-volume periods.</li>
            <li>
              If your shipment has not arrived or appears stalled, please contact our support team at{" "}
              <Link href="mailto:stylemarkline@gmail.com" className="text-primary font-semibold underline">
                stylemarkline@gmail.com
              </Link>{" "}
              or call us directly.
            </li>
          </ul>
        </section>

        {/* Notice for Return & Exchange Policy */}
        <section className="p-5 border rounded-lg bg-secondary space-y-2">
          <h3 className="text-xl font-semibold">Looking for Return or Exchange details?</h3>
          <p className="text-sm md:text-base">
            For returns, size exchanges, replacements, and refund policies, please visit our dedicated{" "}
            <Link href="/return-policy" className="text-primary font-bold underline">
              Return & Exchange Policy
            </Link>{" "}
            page.
          </p>
        </section>

        {/* Contact Us */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            Contact & Customer Support
          </h2>
          <p>
            For any shipping updates or out-of-zone queries, our team is happy to assist you:
          </p>
          <address className="not-italic text-base flex flex-col gap-1.5">
            <p>
              <strong>Email:</strong>{" "}
              <Link href="mailto:stylemarkline@gmail.com" className="text-primary font-medium underline">
                stylemarkline@gmail.com
              </Link>
            </p>
            <p>
              <strong>Phone Helpline:</strong>{" "}
              <Link href="tel:+919703456322" className="text-primary font-medium underline">
                +91 9703456322
              </Link>{" "}
              /{" "}
              <Link href="tel:+919769020660" className="text-primary font-medium underline">
                +91 9769020660
              </Link>
            </p>
            <p>
              <strong>Support Hours:</strong> Monday to Sunday | 10:00 AM – 06:00 PM IST
            </p>
            <p>
              <strong>Office Address:</strong> ROOM NO 165 INDRA NAGAR, NR-BARMA SHEEL RAILWAY LINE, KURLA EAST, NEHRU NAGAR, MUMBAI 400024, MAHARASHTRA, INDIA
            </p>
          </address>
        </section>
      </div>
    </div>
  );
}

