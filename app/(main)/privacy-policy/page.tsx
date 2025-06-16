import { mergeMetadata } from "@/app/layout";
import Link from "next/link"
export const metadata = mergeMetadata({
  title: "Privacy Policy | Markline Fashion",
  description:
    "Learn how Markline Fashion collects, uses, and protects your personal information. Your privacy and security are our top priority.",
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  openGraph: {
    title: "Privacy Policy | Markline Fashion",
    description:
      "At Markline Fashion, we are committed to safeguarding your privacy. Read our full privacy policy to understand your rights and our practices.",
    url: "https://marklinefashion.vercel.app/privacy-policy",
  },
  alternates: {
    canonical: `https://marklinefashion.vercel.app/privacy-policy`,
  },
});
export default function PrivacyPolicy() {
  return (
    <div className="container  mx-auto px-5 md:px-10 lg:px-20 py-8 text-gray-800">


      <div className="text-center mb-10">
        <h1 className=" text-2xl md:text-3xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="text-muted-foreground mt-2">Last Updated: {new Date().toLocaleDateString()}</p>
      </div>

      <p className="text-base font-medium text-primary mb-10">
        Markline Fashion (“we”, “our”, or “us”) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and protect your personal information when you visit our website , interact with us, or make a purchase.
      </p>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">1. Information We Collect</h2>
        <h3 className="text-lg font-medium mt-2">a. We may collect the following types of personal data:</h3>
        <ul className="list-disc list-inside">
          <li><strong>Personal Information:</strong> Name, email address, phone number, shipping and billing address.</li>
          <li><strong>Payment Information:</strong> Payment card details are processed securely via our payment gateway partners.</li>
          <li><strong>Account Information:</strong> Username, password, and preferences if you create an account.</li>
          <li><strong>Usage Data:</strong> IP address, browser type, device information, pages visited, time spent, and cookies.</li>

        </ul>

        <h3 className="text-lg font-medium mt-4">b. How We Use Your Information</h3>
        <ul className="list-disc list-inside">
          <li>Process and fulfill your orders</li>
          <li>Provide customer support</li>
          <li>Improve our website and services</li>
          <li>Send marketing communications (only if you opt-in)</li>
          <li>Prevent fraud and enhance security</li>
          <li>Comply with legal obligations</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">2. Sharing of Your Information</h2>
        <h3 className="text-lg font-medium mt-2">a. We may share your information with:</h3>

        <ul className="list-disc list-inside">
          <li> <strong>Third-party service providers: </strong> For payment processing, shipping, customer support, and marketing tools.</li>
          <li><strong>Legal authorities: </strong> If required to comply with legal obligations or to protect our rights.</li>
        </ul>
        <h3 className="text-lg font-medium mt-2"> We never sell your personal data to third parties.</h3>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">3. Cookies and Tracking Technologies</h2>
        <p className="mb-2">We use cookies and similar technologies to enhance your browsing experience, analyze website traffic, and personalize content. You can manage cookie preferences in your browser settings.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">4. Your Rights </h2>
        <p className="mb-2">Depending on your location, you may have the right to:</p>
        <ul className="list-disc list-inside">
          <li>Access the personal information we hold about you</li>
          <li>Correct inaccuracies in your data</li>
          <li>Request deletion of your data</li>

          <li>Withdraw consent where processing is based on consent</li>
          <li>Object to or restrict processing of your data</li>
        </ul>
        <p className="mt-2">To exercise these rights, contact us at <Link  href={'melto:support@marklinefashion.com'}>support@marklinefashion.com.</Link> </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">5. Data Security</h2>
        <p>We implement appropriate technical and organizational measures to protect your data against unauthorized access, loss, or alteration</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">6. Data Retention</h2>
        <p>We retain personal data only as long as necessary for the purposes stated in this policy or as required by law.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">7. Children Privacy
</h2>
        <p>Our website is not intended for children under the age of 13. We do not knowingly collect personal information from children.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">8. Data Protection Officer</h2>
        <p>For any privacy-related concerns, you may contact our Data Protection Officer:</p>
        <ul className="list-disc list-inside">
          <li><strong>Name:</strong> Ayan mansoor </li>
          <li><strong>Email:</strong> ayanmansoor09191@gmail.com </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">9. Changes to This Policy</h2>
        <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date.</p>
      </section>


      <section className="mb-6 mt-10">
        <h2 className="text-2xl font-semibold mb-2">10. What are Cookies? </h2>
        <p className="mb-2">Cookies are small text files that are placed on your device when you visit our website. They help us remember your actions and preferences over time.</p>
        <h2 className="text-lg font-semibold mb-2 mt-5">Why We Use Cookies:</h2>

        <ul className="list-disc list-inside flex flex-col gap-2">
          <li>To recognize you when you return to our site</li>
          <li>To remember your preferences and settings</li>
          <li>To analyze traffic and improve functionality</li>
          <li>To personalize ads and marketing content</li>
        </ul>
       <h2 className="text-lg font-semibold mb-2 mt-5">What are Cookies? </h2>
        <p className="mb-2">Cookies are small text files that are placed on your device when you visit our website. They help us remember your actions and preferences over time.</p>

      </section>
      
    </div>
  )
}

