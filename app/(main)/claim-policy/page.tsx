import React from 'react'
import Link from 'next/link';
import ClaimRequestFrom from '@/components/Forms/ClaimRequestFrom';

export const metadata = {
  title: "Product Claim Policy | Markline Fashion",
  description:
    "Understand Markline Fashion's product claim policy. Learn how to report damaged, defective, or incorrect items and what resolutions are available.",
};

function page() {
  return (
     <><section className="container mx-auto px-5 md:px-10 lg:px-20 py-10">
      <h1 className="text-3xl font-bold mb-6">Product Claim Policy</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">1. Eligibility for Product Claims</h2>
        <p className="text-gray-700 className='text-lg text-primary font-medium">
          You may file a product claim under the following circumstances:
        </p>
        <ul className="list-disc list-inside text-gray-700 mt-2">
          <li className='text-lg text-primary font-medium'>You received a damaged product.</li>
          <li className='text-lg text-primary font-medium'>You received the wrong item or the wrong size/color.</li>
          <li className='text-lg text-primary font-medium'>The product has a manufacturing defect.</li>
          <li className='text-lg text-primary font-medium'> The product is incomplete or missing parts.</li>
        </ul>
        <p className="text-primary mt-2 text-lg  font-semibold">
          Claims are only accepted if:
        </p>
        <ul className="list-disc list-inside text-gray-700 mt-2">
          <li className='text-lg text-primary font-medium'> The product is unused and in its original packaging.</li>
          <li className='text-lg text-primary font-medium'>The claim is submitted within <strong>7 days</strong> of delivery.</li>
          <li className='text-lg text-primary font-medium'>Sufficient photo or video evidence is provided.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">2. How to File a Claim</h2>
        <ol className="list-decimal list-inside text-gray-700">
          <li className='text-lg text-primary font-medium'>Email us at <Link href="mailto:stylemarkline@gmail.com" className="text-blue-600 underline">stylemarkline@gmail.com</Link> or fill out the Claim Request Form on our website.</li>
          <li className='text-lg text-primary font-medium'>Include your Order ID, Product name, issue description, and photo/video evidence.</li>
          <li className='text-lg text-primary font-medium'>Our support team will review your claim within 2–3 business days.</li>
        </ol>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">3. Claim Resolution Process</h2>
        <p className='text-lg text-primary font-semibold'>
          Depending on the claim type and product condition, we may offer:
        </p>
        <ul className="list-disc list-inside text-gray-700 mt-2">
          <li className='text-lg text-primary font-medium'>Replacement of the same item (subject to availability)</li>
          <li className='text-lg text-primary font-medium'>Exchange for a different item of equal value</li>
          <li className='text-lg text-primary font-medium'>Store credit or coupon code</li>
          <li className='text-lg text-primary font-medium'>Full or partial refund to the original payment method</li>
        </ul>
        <p className="text-gray-700 mt-2 text-lg font-semibold ">
          Return pickup or shipping instructions will be shared if needed.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">4. Exclusions</h2>
        <p className="text-gray-700 text-lg font-semibold">
          Claims will not be accepted if:
        </p>
        <ul className="list-disc list-inside text-gray-700 mt-2">
          <li className='text-lg text-primary font-medium'>The issue arises from misuse, neglect, or normal wear and tear</li>
          <li className='text-lg text-primary font-medium'>The product was altered, washed, or used</li>
          <li className='text-lg text-primary font-medium'>The claim is submitted after the 7-day window</li>
          <li className='text-lg text-primary font-medium'>No supporting evidence is provided</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">5. Contact Us</h2>
        <p className='text-lg text-primary font-medium'>
          If you have any questions about this Product Claim Policy, please contact us:
        </p>
        <ul className="text-gray-700 mt-2">
          <li className='text-lg text-primary font-medium'><strong>Email:</strong> <Link href="mailto:stylemarkline@gmail.com" className="text-blue-600 underline">stylemarkline@gmail.com</Link></li>
          <li className='text-lg text-primary font-medium'><strong>Phone:</strong> +91-9702456322</li>
          <li className='text-lg text-primary font-medium'><strong>Working Hours:</strong> Monday to Saturday, 10 AM – 6 PM</li>
        </ul>
      </section>

      <p className=" text-primary mt-6 text-lg font-semibold">
        Markline Fashion reserves the right to modify or update this policy at any time without prior notice.
      </p>
    </section>
    
<ClaimRequestFrom /> 

    </>
  )
}
export default page




