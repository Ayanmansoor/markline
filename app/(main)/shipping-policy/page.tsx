
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
    url: "https://marklinefashion.vercel.app/shipping-policy",
  },
  alternates: {
    canonical: `https://marklinefashion.vercel.app/shipping-policy`,
  },
});

export default function ShippingPolicy() {
  return (

    <div className=" mx-auto py-12 px-5 md:px-10 lg:px-20">
      <div className="space-y-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight">Shipping & Return Policy</h1>
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
                  <td className="border p-2 flex items-center gap-2"> <strong>₹99</strong>(Below ₹2000 orders)</td>
                </tr>
                
                <tr className="bg-green-50 font-medium">
                  <td className="border p-2">Free Shipping</td>
                  <td className="border p-2">4-7 business days</td>
                  <td className="border p-2 text-green-600">FREE (on orders above ₹3000)</td>
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
            Once your order has shipped, you will receive a shipping confirmation email with tracking details. You can track your order anytime using the tracking number provided.
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
           While we aim for timely delivery, unforeseen circumstances such as weather, customs delays, or courier issues may affect shipping times. If your order is delayed or not received within the estimated time:
          </p>
          <ul className="w-full relative flex flex-col gap-1 text-base ">
            <li> Please wait a few extra days</li>
            <li className=" flex items-center gap-1 ">
                Then contact us at <Link href={'melto:stylemarkline@gmail.com'}>stylemarkline@gmail.com</Link>
            </li>
          </ul>
          <p  className="text-lg font-meidum text-primary">We will work with our shipping partners to resolve the issue promptly.</p>
        </section>


  <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Shipping Restrictions</h2>
          <ul className="w-full relative flex flex-col gap-1 text-base ">
            <li>We do not ship to P.O. Boxes or military addresses (APO/FPO).</li>
            <li className=" flex items-center gap-1 ">
                Some remote areas may have limited delivery services.
            </li>
           <li className=" flex items-center gap-1 ">
               In case of restricted delivery areas, we will notify you and refund your order.
            </li>
          </ul>
        </section>

          <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Address Accuracy</h2>
          <p>Please ensure that your shipping address is complete and accurate. Markline Fashion is not responsible for delays or non-delivery due to incorrect address information.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Damaged or Missing Items</h2>
          <p className="text-lg font-medium text-primary">If your order arrives damaged or with missing items:</p>
          <ul className="w-full relative flex flex-col gap-1 text-base ">
            <li>Take photos of the packaging and product</li>
            <li className=" flex items-center gap-1 ">
                Some remote areas may have limited delivery services.
            </li>
           <li className=" flex items-center gap-1 ">
              Contact us within 48 hours of delivery at <Link href={'melto:stylemarkline@gmail.com'}>stylemarkline@gmail.com</Link>
            </li>
          </ul>
        </section>


      
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Questions?</h2>
          <p className="text-lg font-medium text-primary">For any questions or concerns related to shipping, please contact our customer service at:</p>
          <ul className="w-full relative flex flex-col gap-1 text-base ">
            <li>📧 Email: <Link href={'melto:stylemarkline@gmail.com'}>stylemarkline@gmail.com</Link></li>
          </ul>
        </section>



        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Contact Us</h2>
          <p>If you have any questions regarding shipping, reach out to us:</p>
          <div className="not-prose">
            <address className="not-italic">
              <p>Email: stylemarkline@gmail.com</p>
              <p>Phone: +91-XXXXXXXXXX</p>
              <p>Hours: Monday - Friday | 10 AM - 6 PM IST</p>
            </address>
          </div>
        </section>
      </div>


    </div>
  )
}

