import { mergeMetadata } from "@/app/layout";
import Link from "next/link";

export const metadata = mergeMetadata({
  title: "Privacy Policy | Markline",
  description:
    "Learn how Markline collects, uses, and protects your personal information. Your privacy and security are our top priority.",
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  openGraph: {
    title: "Privacy Policy | Markline",
    description:
      "At Markline, we are committed to safeguarding your privacy. Read our full privacy policy to understand your rights and our practices.",
    url: "https://shopmarkline.in/privacy-policy",
  },
  alternates: {
    canonical: `https://shopmarkline.in/privacy-policy`,
  },
});

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-5 md:px-5 py-8 text-gray-800">
      <div className="text-center mb-10">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="text-muted-foreground mt-2">Last Updated: {new Date().toLocaleDateString()}</p>
      </div>

      <p className="text-base font-medium text-primary mb-10">
        Markline (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, store, and protect your personal information when you visit our website (https://shopmarkline.in), interact with us, or purchase products from our store.
      </p>

      {/* 1. Information We Collect */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">1. Information We Collect</h2>
        <h3 className="text-lg font-medium mt-2">a. Information you provide directly:</h3>
        <ul className="list-disc list-inside space-y-1 mt-1">
          <li><strong>Personal & Contact Information:</strong> Name, email address, mobile phone number, shipping and billing address, city, state, and postal code (PIN code).</li>
          <li><strong>Payment Information:</strong> Online payments (Credit/Debit cards, Net Banking, UPI, Wallets) are processed securely through certified, PCI-DSS compliant payment gateway partners (such as Razorpay). <strong>Markline does not store or have access to your credit/debit card numbers, CVV, or banking PINs.</strong> For Cash on Delivery (COD) orders, we record payment collection status.</li>
          <li><strong>Account Information:</strong> Encrypted login credentials, saved addresses, order history, product wishlist, and communication preferences.</li>
          <li><strong>Customer Feedback & Claims:</strong> Information provided when submitting product feedback, claims, return requests, or contacting customer support.</li>
        </ul>

        <h3 className="text-lg font-medium mt-4">b. Information collected automatically:</h3>
        <ul className="list-disc list-inside space-y-1 mt-1">
          <li><strong>Usage & Device Data:</strong> IP address, browser type and version, operating system, device model, pages visited, time spent, referring website URL, and interaction analytics.</li>
          <li><strong>Cookies & Local Storage:</strong> Cookies used to maintain your active session, remember cart items, and provide secure browsing.</li>
        </ul>
      </section>

      {/* 2. How We Use Your Information */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">2. How We Use Your Information</h2>
        <p className="mb-2">We use your personal data for the following legitimate business purposes:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Process, pack, fulfill, and deliver your orders.</li>
          <li>Send order confirmations, shipment tracking updates, delivery notifications, and electronic invoices.</li>
          <li>Provide customer support, address inquiries, and process product claims, returns, or exchanges.</li>
          <li>Prevent fraud, bot attacks, and unauthorized access using security measures such as Google reCAPTCHA v3.</li>
          <li>Send marketing communications, new arrivals, and special discount offers (only if you opt-in; you can unsubscribe at any time).</li>
          <li>Analyze website traffic and optimize catalog performance and user experience.</li>
          <li>Comply with applicable legal, accounting, tax (GST), and regulatory requirements under Indian law.</li>
        </ul>
      </section>

      {/* 3. Sharing of Your Information */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">3. Sharing and Disclosure of Your Information</h2>
        <p className="mb-2">We only share your information with trusted third-party service providers necessary to operate our business:</p>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>Logistics & Courier Partners:</strong> Recipient name, delivery address, and contact number are shared with courier companies for physical doorstep delivery.</li>
          <li><strong>Payment Gateways:</strong> Necessary transaction identifiers and amounts are shared with RBI-authorized payment processors to complete billing.</li>
          <li><strong>Cloud & Database Infrastructure:</strong> Customer records are securely hosted on Supabase cloud infrastructure with encrypted storage.</li>
          <li><strong>Legal Authorities:</strong> Disclosed only when strictly required by law, court order, or governmental authorities to protect rights, safety, and prevent fraud.</li>
        </ul>
        <h3 className="text-lg font-medium mt-3 text-primary">
          We strictly never sell, rent, or trade your personal data to third-party advertisers or data brokers.
        </h3>
      </section>

      {/* 4. Cookies and Tracking Technologies */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">4. Cookies and Tracking Technologies</h2>
        <p className="mb-2">
          Cookies are small text files placed on your device when you visit our website. They help remember your preferences, keep items in your shopping cart, and enhance your overall browsing experience.
        </p>
        <h3 className="text-lg font-medium mt-3">Types of Cookies We Use:</h3>
        <ul className="list-disc list-inside space-y-1 mt-1">
          <li><strong>Essential Cookies:</strong> Required for fundamental website operations, account authentication, and cart functionality.</li>
          <li><strong>Security Cookies:</strong> Google reCAPTCHA v3 cookies to protect our forms and checkout from automated spam and abuse.</li>
          <li><strong>Analytics Cookies:</strong> Google Tag Manager / Analytics to analyze visitor traffic and improve page loading performance.</li>
          <li><strong>Marketing & Pixel Cookies:</strong> Meta Pixel to assess social media campaign performance and deliver relevant fashion updates.</li>
        </ul>
        <p className="mt-3">
          You can manage or disable cookies at any time through your browser settings (Chrome, Safari, Firefox, Edge). Note that disabling essential cookies may impact your ability to add products to the cart or complete a purchase.
        </p>
      </section>

      {/* 5. Data Security */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">5. Data Security</h2>
        <p className="mb-2">
          We implement technical and organizational security measures to protect your personal data against unauthorized access, loss, alteration, or disclosure:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>256-Bit SSL/TLS Encryption:</strong> All data transmitted between your browser and our servers is fully encrypted.</li>
          <li><strong>Row-Level Security (RLS):</strong> Strict database access policies ensuring users can only access their own profile and order data.</li>
          <li><strong>PCI-DSS Compliance:</strong> All payment transactions are handled through compliant, tokenized gateway architectures.</li>
          <li><strong>Restricted Access:</strong> Only authorized personnel have access to order records for fulfillment and customer support purposes.</li>
        </ul>
      </section>

      {/* 6. Data Retention */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">6. Data Retention</h2>
        <p>
          We retain personal data only for as long as necessary to fulfill the purposes stated in this policy, provide our products and services, resolve claims and disputes, or comply with statutory accounting and tax retention periods under applicable law. Once no longer needed, data is securely deleted or anonymized.
        </p>
      </section>

      {/* 7. Your Rights */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">7. Your Privacy Rights</h2>
        <p className="mb-2">Under applicable data protection laws, you have the following rights regarding your personal information:</p>
        <ul className="list-disc list-inside space-y-1">
          {/* <li><strong>Right to Access:</strong> Request a copy of the personal information we hold about you.</li> */}
          <li><strong>Right to Rectification:</strong> Request correction or update of inaccurate or incomplete contact/address details.</li>
          <li><strong>Right to Erasure:</strong> Request deletion of your account and personal data (subject to statutory legal and tax obligations).</li>
          <li><strong>Right to Withdraw Consent:</strong> Unsubscribe from promotional emails or marketing messages at any time.</li>
          <li><strong>Right to Restrict Processing:</strong> Request restrictions on specific types of data processing.</li>
        </ul>
        <p className="mt-3">
          To exercise any of these rights, please contact our support team at{" "}
          <Link href="mailto:stylemarkline@gmail.com" className="text-primary font-medium underline">
            stylemarkline@gmail.com
          </Link>
          .
        </p>
      </section>

      {/* 8. Children's Privacy */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">8. Children&apos;s Privacy</h2>
        <p>
          Our website is intended for general audiences who are at least 18 years of age or accessing under the supervision of a parent or legal guardian. We do not knowingly collect personal information from children under 18. If you believe a minor has provided personal information to us, please contact us so we can promptly delete it.
        </p>
      </section>

      {/* 9. Third-Party Links */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">9. Third-Party Links</h2>
        <p>
          Our website may contain links to external platforms, including our official social media channels (Instagram, Facebook, Pinterest). We are not responsible for the privacy practices, content, or policies of external websites and encourage you to review their privacy policies.
        </p>
      </section>

      {/* 10. Data Protection & Grievance Officer */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">10. Data Protection & Grievance Officer</h2>
        <p className="mb-2">
          In accordance with the Information Technology Act 2000, the Digital Personal Data Protection Act (DPDPA), and consumer protection rules, you may contact our designated Grievance Officer for any privacy-related questions or concerns:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>Name:</strong> Ayan Mansoor</li>
          <li>
            <strong>Email:</strong>{" "}
            <Link href="mailto:stylemarkline@gmail.com" className="text-primary font-medium underline">
              stylemarkline@gmail.com
            </Link>
          </li>
          <li>
            <strong>Contact Numbers:</strong>{" "}
            <Link href="tel:+919703456322" className="text-primary font-medium underline">
              +91 9703456322
            </Link>{" "}
            /{" "}
            <Link href="tel:+919769020660" className="text-primary font-medium underline">
              +91 9769020660
            </Link>
          </li>
          <li><strong>Support Hours:</strong> Monday to Sunday (10:00 AM – 06:00 PM IST)</li>
          <li>
            <strong>Registered Office Address:</strong> ROOM NO 165 INDRA NAGAR, NR-BARMA SHEEL RAILWAY LINE, KURLA EAST, NEHRU NAGAR, MUMBAI 400024, MAHARASHTRA, INDIA
          </li>
        </ul>
      </section>

      {/* 11. Changes to This Policy */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">11. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time to reflect operational, legal, or regulatory changes. Any modifications will be posted on this page with an updated &ldquo;Last Updated&rdquo; revision date.
        </p>
      </section>
    </div>
  );
}
