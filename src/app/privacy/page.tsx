"use client";

import React from "react";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3 py-6 border-b border-zinc-900">
      <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight">{title}</h2>
      <div className="text-sm text-zinc-300 leading-relaxed space-y-3">{children}</div>
    </div>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-black min-h-screen text-white">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full uppercase tracking-widest border border-amber-500/20">
          ታማኝ ማሽነሪ — TM
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight mt-4 mb-2">
          Privacy Policy
        </h1>
        <p className="text-xs text-zinc-500 mb-6">Last updated: July 2026 · Effective for users in Ethiopia and abroad</p>

        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6 text-xs text-amber-200 leading-relaxed">
          <strong className="text-amber-300">Draft notice:</strong> This policy is a working draft prepared to reflect Ethiopia&apos;s
          Personal Data Protection Proclamation No. 1321/2024 and general international privacy practice. It is not a substitute for
          advice from an Ethiopian-licensed attorney, and Trustworthy Machinery (TM) should have it formally reviewed before treating
          it as final and binding.
        </div>

        <Section title="1. Who We Are">
          <p>
            Trustworthy Machinery (&quot;TM,&quot; &quot;we,&quot; &quot;us&quot;) operates a heavy machinery matchmaking marketplace
            connecting machinery owners, renters, operators, mechanics, transporters, and industrial businesses across Ethiopia and
            East Africa. TM is the data controller for personal data processed through this platform, as defined under the Personal
            Data Protection Proclamation No. 1321/2024 (the &quot;Proclamation&quot;).
          </p>
        </Section>

        <Section title="2. Information We Collect">
          <p>We collect the following categories of personal data:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li><strong>Account data:</strong> full name, phone number, email address, password (hashed), preferred language, user role (owner, renter, operator, mechanic, transporter, buyer).</li>
            <li><strong>Verification (KYC) data:</strong> identity documents, business registration details, and other information submitted for seller/agency verification.</li>
            <li><strong>Listing and transaction data:</strong> machinery details, pricing, deployment location, escrow and payment records, communications between users conducted through the platform.</li>
            <li><strong>Technical data:</strong> IP address, device and browser information, and usage data collected automatically when you use the platform.</li>
          </ul>
        </Section>

        <Section title="3. Legal Basis and Purpose of Processing">
          <p>
            We process personal data on the basis of your consent, the necessity of processing to perform our contract with you
            (matching, listings, escrow, communication), compliance with legal obligations (including KYC/anti-fraud checks), and our
            legitimate interest in operating and securing the platform — consistent with the lawful-processing principles set out in
            the Proclamation.
          </p>
        </Section>

        <Section title="4. Data Storage and Cross-Border Transfer">
          <p>
            In line with the data localization requirements of the Proclamation, personal data collected from users in Ethiopia is
            stored on servers located within Ethiopia where required, or with providers maintaining adequate safeguards. Where data
            must be transferred outside Ethiopia (for example, to a cloud infrastructure provider), we do so only where the receiving
            country offers adequate protection, where you have given explicit informed consent, where the transfer is necessary to
            perform our contract with you, or as otherwise permitted under the Proclamation.
          </p>
        </Section>

        <Section title="5. Your Rights as a Data Subject">
          <p>Under the Proclamation, you have the right to:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Be informed about how your personal data is processed;</li>
            <li>Access the personal data we hold about you;</li>
            <li>Request correction of inaccurate or incomplete data;</li>
            <li>Request erasure of your data, subject to legal retention requirements;</li>
            <li>Restrict or object to certain processing, including direct marketing;</li>
            <li>Receive your data in a portable format; and</li>
            <li>Lodge a complaint with the Ethiopian Communications Authority (ECA), the supervisory authority designated under the Proclamation.</li>
          </ul>
          <p>To exercise these rights, contact us using the details in Section 11.</p>
        </Section>

        <Section title="6. Data Sharing">
          <p>
            We share personal data with other users only as necessary to facilitate a listing, rental, sale, or service booking (for
            example, sharing contact details after a &quot;unlock contact&quot; payment). We may also share data with payment and
            escrow processors, verification providers, and law enforcement or regulatory authorities where legally required. We do
            not sell personal data to third parties for their own marketing purposes.
          </p>
        </Section>

        <Section title="7. Data Security and Breach Notification">
          <p>
            We apply technical and organizational safeguards appropriate to the sensitivity of the data we hold, including encryption
            in transit and access controls. In the event of a data breach likely to result in risk to your rights, we will notify the
            ECA and affected users within the timeframe required under the Proclamation (currently 72 hours from becoming aware of the
            breach).
          </p>
        </Section>

        <Section title="8. Data Retention">
          <p>
            We retain personal data only for as long as necessary to fulfil the purposes described in this policy, to comply with our
            legal and tax obligations, and to resolve disputes. KYC verification records may be retained for a longer period where
            required by anti-fraud or regulatory obligations.
          </p>
        </Section>

        <Section title="9. Children's Privacy">
          <p>
            TM is intended for use by individuals and businesses aged 18 and above. We do not knowingly collect personal data from
            minors.
          </p>
        </Section>

        <Section title="10. Changes to This Policy">
          <p>
            We may update this policy from time to time to reflect changes in our practices or in Ethiopian law, including further
            implementing regulations issued under the Proclamation. Material changes will be posted on this page with an updated
            effective date.
          </p>
        </Section>

        <Section title="11. Contact Us">
          <p>
            For privacy inquiries or to exercise your data subject rights, contact us at{" "}
            <a href="mailto:machinerymatchmaker@gmail.com" className="text-amber-400 hover:text-amber-300">
              machinerymatchmaker@gmail.com
            </a>{" "}
            or +251 911 000 000. You may also lodge a complaint directly with the Ethiopian Communications Authority.
          </p>
        </Section>
      </section>
    </div>
  );
}