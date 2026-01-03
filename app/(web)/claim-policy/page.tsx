import React from 'react'
import Link from 'next/link';
import ClaimRequestFrom from '@/components/Forms/ClaimRequestFrom';
import { AlertCircle, Mail, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: "Product Claim Policy | Markline",
  description:
    "Understand Markline's product claim policy. Learn how to report damaged, defective, or incorrect items and what resolutions are available.",
};

function page() {
  return (
    <>

      <section className='w-full relative grid  grid-cols-1 xl:grid-cols-[1fr_.5fr] gap-2 container mx-auto px-5 '>

        <section className="py-10">
          <h1 className="text-3xl font-bold mb-6">Product Claim Policy</h1>

          {/* Eligibility */}
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">
              1. Eligibility for Product Claims
            </h2>

            <p className="text-lg text-primary font-medium">
              You may raise a product claim with Markline under the following conditions:
            </p>

            <ul className="list-disc list-inside mt-2">
              <li className="text-lg text-primary font-medium">
                You received a damaged product
              </li>
              <li className="text-lg text-primary font-medium">
                You received an incorrect item, size, or color
              </li>
              <li className="text-lg text-primary font-medium">
                The product has a manufacturing defect
              </li>
              <li className="text-lg text-primary font-medium">
                The product is incomplete or missing components
              </li>
            </ul>

            <p className="text-lg text-primary font-semibold mt-3">
              Claims are accepted only if:
            </p>

            <ul className="list-disc list-inside mt-2">
              <li className="text-lg text-primary font-medium">
                The product is unused, unworn, and in original condition
              </li>
              <li className="text-lg text-primary font-medium">
                The claim is raised within <strong>7 days</strong> of delivery
              </li>
              <li className="text-lg text-primary font-medium">
                Clear photo or video evidence is provided
              </li>
            </ul>
          </section>

          {/* How to File */}
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">
              2. How to File a Product Claim
            </h2>

            <ol className="list-decimal list-inside">
              <li className="text-lg text-primary font-medium">
                Email us at{" "}
                <Link
                  href="mailto:stylemarkline@gmail.com"
                  className="text-blue-600 underline"
                >
                  stylemarkline@gmail.com
                </Link>{" "}
                or submit a request through our Claim Form (if available).
              </li>

              <li className="text-lg text-primary font-medium">
                Include your Order ID, product name, issue description, and supporting
                photo or video evidence.
              </li>

              <li className="text-lg text-primary font-medium">
                Our support team will review your claim within{" "}
                <strong>2–3 business days</strong>.
              </li>
            </ol>
          </section>

          {/* Resolution */}
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">
              3. Claim Resolution Process
            </h2>

            <p className="text-lg text-primary font-semibold">
              Depending on the nature of the issue and product availability, Markline may
              offer one of the following resolutions:
            </p>

            <ul className="list-disc list-inside mt-2">
              <li className="text-lg text-primary font-medium">
                Replacement of the same product (preferred option)
              </li>
              <li className="text-lg text-primary font-medium">
                Exchange for another product of equal value
              </li>
              <li className="text-lg text-primary font-medium">
                Store credit or discount coupon
              </li>
              <li className="text-lg text-primary font-medium">
                Refund to the original payment method (only if replacement or exchange
                is not possible)
              </li>
            </ul>

            <p className="text-lg text-primary font-medium mt-2">
              If a return is required, pickup or shipping instructions will be shared
              by our support team.
            </p>
          </section>

          {/* Exclusions */}
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">
              4. Claim Exclusions
            </h2>

            <p className="text-lg text-primary font-semibold">
              Product claims will not be accepted in the following cases:
            </p>

            <ul className="list-disc list-inside mt-2">
              <li className="text-lg text-primary font-medium">
                Damage due to misuse, negligence, or improper handling
              </li>
              <li className="text-lg text-primary font-medium">
                Normal wear and tear over time
              </li>
              <li className="text-lg text-primary font-medium">
                Products that have been worn, washed, altered, or used
              </li>
              <li className="text-lg text-primary font-medium">
                Claims raised after the 7-day eligibility period
              </li>
              <li className="text-lg text-primary font-medium">
                Claims without valid photo or video proof
              </li>
            </ul>
          </section>

          {/* Contact */}
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">
              5. Contact Us
            </h2>

            <p className="text-lg text-primary font-medium">
              If you have any questions regarding this Product Claim Policy, feel free
              to contact us:
            </p>

            <ul className="mt-2">
              <li className="text-lg text-primary font-medium">
                <strong>Email:</strong>{" "}
                <Link
                  href="mailto:stylemarkline@gmail.com"
                  className="text-blue-600 underline"
                >
                  stylemarkline@gmail.com
                </Link>
              </li>
              <li className="text-lg text-primary font-medium">
                <strong>Phone:</strong> +91-9702456322
              </li>
              <li className="text-lg text-primary font-medium">
                <strong>Working Hours:</strong> Monday to Saturday | 10 AM – 6 PM IST
              </li>
            </ul>
          </section>

          {/* Footer Note */}
          <p className="text-lg text-primary font-semibold mt-6">
            Markline reserves the right to update or modify this Product Claim Policy at
            any time without prior notice.
          </p>
        </section>

        <div className="w-full h-fit mx-auto p-6 relative lg:sticky lg:top-20  bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="flex items-center gap-3 mb-6 border-b pb-4">
            <ShieldCheck className="text-blue-600" size={32} />
            <h2 className="text-2xl font-bold text-gray-800">Product Claim Policy</h2>
          </div>

          <div className="space-y-6">
            <section>
              <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <AlertCircle size={20} className="text-orange-500" />
                Instructions for Filing a Claim
              </h3>
              <ul className="space-y-4 text-gray-600">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-bold">1</span>
                  <span><strong>Unboxing Video:</strong> We highly recommend recording a video while opening your package. This serves as vital proof for any damage claims.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-bold">2</span>
                  <span><strong>Capture the Damage:</strong> Take clear, high-resolution photos of the specific area of damage on the product and the outer packaging.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-bold">3</span>
                  <span><strong>Report Promptly:</strong> Claims must be filed via email within <strong>48 hours</strong> of delivery. Late requests may not be eligible for replacement.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-bold">4</span>
                  <span><strong>Keep Packaging:</strong> Retain the original box and all tags until your claim is successfully processed.</span>
                </li>
              </ul>
            </section>

            <div className="bg-gray-50 p-5 rounded-lg border border-dashed border-gray-300">
              <p className="text-sm text-gray-500 mb-4 italic text-center">
                Click the button below to start your claim. Please remember to attach your photos to the email before sending.
              </p>

              <Link
                href={"mailto:stylemarkline@gmail.com"}
                className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white px-8 py-4 rounded-lg font-bold text-base transition-all  active:scale-95"
              >
                <Mail size={22} />
                Report Damaged Product
              </Link>
            </div>
          </div>
        </div>
        {/* <ClaimRequestFrom /> */}
      </section>

    </>
  )
}
export default page




