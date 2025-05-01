
import { mergeMetadata } from "@/app/layout";
import Link from "next/link"

export const metadata = mergeMetadata({
  title: "Shipping Policy | Markline Fashion",
  description:
    "Learn about Markline Fashion's shipping policy. Find information on delivery times, shipping methods, order processing, and international shipping options.",
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  openGraph: {
    title: "Shipping Policy | Markline Fashion",
    description:
      "Discover how Markline Fashion ensures timely and reliable shipping. Get details on domestic and international shipping, tracking, and delivery timelines.",
    url: "https://marklinefashion.com/shipping-policy",
  },
  alternates: {
    canonical: `https://marklinefashion.com/shipping-policy`,
  },
});

export default function ShippingPolicy() {
  return (

    <div className="container mx-auto py-12 px-5 md:px-10 lg:px-20">
      <div className="space-y-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight">Shipping Policy</h1>
          <p className="text-muted-foreground mt-2">Last Updated: {new Date().toLocaleDateString()}</p>
        </div>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Order Processing</h2>
          <p>
            At Markline, we aim to process and dispatch your orders as quickly as possible.
            Orders are typically processed within 1-2 business days (Monday to Friday, excluding holidays).
          </p>
          <p>
            In case of any delay, we will notify you via email or phone. Please ensure your contact details are accurate at checkout.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Shipping Methods & Charges</h2>
          <p>We offer the following shipping options:</p>
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
                <tr>
                  <td className="border p-2">Standard Shipping</td>
                  <td className="border p-2">4-7 business days</td>
                  <td className="border p-2">₹99</td>
                </tr>
                <tr>
                  <td className="border p-2">Express Shipping</td>
                  <td className="border p-2">1-3 business days</td>
                  <td className="border p-2">₹249</td>
                </tr>
                <tr className="bg-green-50 font-medium">
                  <td className="border p-2">Free Shipping</td>
                  <td className="border p-2">4-7 business days</td>
                  <td className="border p-2 text-green-600">FREE (on orders above ₹5000)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            *Note: Free shipping is automatically applied during checkout for orders above ₹5000.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Order Tracking</h2>
          <p>
            Once your order is shipped, you will receive a confirmation email with the tracking number. You can track your order using the provided link.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Shipping Restrictions</h2>
          <p>
            We do not ship to P.O. Boxes or military addresses at this time. For any delivery-related concerns, please contact our support team.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Lost or Damaged Packages</h2>
          <p>
            If your order is lost or arrives damaged, please contact us within 48 hours with your order number and supporting photos, if applicable.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Contact Us</h2>
          <p>If you have any questions regarding shipping, reach out to us:</p>
          <div className="not-prose">
            <address className="not-italic">
              <p>Email: support@marklinefashion.com</p>
              <p>Phone: +91-XXXXXXXXXX</p>
              <p>Hours: Monday - Friday | 10 AM - 6 PM IST</p>
            </address>
          </div>
        </section>
      </div>


    </div>
  )
}

