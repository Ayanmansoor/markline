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
    <div className="max-w-4xl mx-auto px-4 py-8 text-gray-800">
      <div className="text-center mb-10">
        <h1 className=" text-2xl md:text-3xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="text-muted-foreground mt-2">Last Updated: {new Date().toLocaleDateString()}</p>
      </div>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">1. Information We Collect</h2>
        <h3 className="text-lg font-medium mt-2">a. Information You Provide</h3>
        <ul className="list-disc list-inside">
          <li>Full name</li>
          <li>Email address</li>
          <li>Shipping and billing addresses</li>
          <li>Phone number</li>

        </ul>

        <h3 className="text-lg font-medium mt-4">b. Information Collected Automatically</h3>
        <ul className="list-disc list-inside">
          <li>IP address</li>
          <li>Browser type and version</li>
          <li>Device type and operating system</li>
          <li>Access times and referring URLs</li>
          <li>Usage data via cookies and tracking tools</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">2. How We Use Your Information</h2>
        <ul className="list-disc list-inside">
          <li>Process and fulfill orders</li>
          <li>Improve your shopping experience</li>
          <li>Respond to inquiries and provide customer support</li>
          <li>Send marketing communications (only if you opt in)</li>
          <li>Personalize content and offers</li>
          <li>Detect and prevent fraud</li>
          <li>Comply with legal obligations</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">3. Sharing of Information</h2>
        <p className="mb-2">We may share your information with:</p>
        <ul className="list-disc list-inside">
          <li>Third-party service providers (e.g., payment processors, shipping partners)</li>
          <li>Legal or governmental authorities when required</li>
          <li>Business partners in case of a merger, acquisition, or asset transfer</li>
          <li>With your consent or as otherwise permitted by law</li>
        </ul>
        <p className="mt-2">We do <strong>not</strong> sell your personal data.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">4. Cookies & Tracking</h2>
        <p className="mb-2">We use cookies and similar technologies to:</p>
        <ul className="list-disc list-inside">
          <li>Remember your preferences</li>
          <li>Track website activity and performance</li>
          <li>Enable targeted marketing</li>
        </ul>
        <p className="mt-2">You can control cookie preferences through your browser settings.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">5. Data Security</h2>
        <p>We implement industry-standard security measures to protect your data. However, no system is entirely secure, and we cannot guarantee absolute protection.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">6. Your Rights</h2>
        <p>You may:</p>
        <ul className="list-disc list-inside">
          <li>Access or update your personal information</li>
          <li>Request deletion of your account</li>
          <li>Unsubscribe from marketing emails</li>
          <li>Object to data processing under certain conditions</li>
        </ul>
        <p className="mt-2">To exercise your rights, contact us at: <a href="mailto:privacy@marklinefashion.com" className="text-blue-600 underline">privacy@marklinefashion.com</a></p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">7. Children’s Privacy</h2>
        <p>Our website and services are not directed toward individuals under the age of 13. We do not knowingly collect personal data from children.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">8. International Transfers</h2>
        <p>Your information may be stored or processed in countries outside your own. By using our services, you consent to such transfers as per applicable laws.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">9. Changes to this Policy</h2>
        <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date.</p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">10. Contact Us</h2>
        <p className="mb-1">If you have any questions or concerns regarding this Privacy Policy:</p>
        <p className="mb-1">Markline Fashion</p>
        <p className="mb-1">[Your Address]</p>
        <p className="mb-1">Thane, Maharashtra 400162</p>
        <p className="mb-1">India</p>
        <p className="mb-1">Email: <a href="mailto:privacy@marklinefashion.com" className="text-blue-600 underline">privacy@marklinefashion.com</a></p>
        <p>Phone: [Your Phone Number]</p>
      </section>
    </div>
  )
}

