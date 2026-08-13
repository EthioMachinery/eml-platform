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

export default function TermsOfServicePage() {
  return (
    <div className="bg-black min-h-screen text-white">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full uppercase tracking-widest border border-amber-500/20">
          ታማኝ ማሽነሪ — TM
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight mt-4 mb-2">
          Terms of Service
        </h1>
        <p className="text-xs text-zinc-500 mb-6">Last updated: July 2026 · Governed by the laws of Ethiopia</p>

        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6 text-xs text-amber-200 leading-relaxed">
          <strong className="text-amber-300">Draft notice:</strong> This document is a working draft reflecting Ethiopia&apos;s
          Commercial Code, the Trade Competition and Consumer Protection Proclamation No. 813/2013, and the Electronic Transaction
          Proclamation No. 1205/2020. It is not a substitute for advice from an Ethiopian-licensed attorney, and Trustworthy Machinery
          (TM) should have it formally reviewed before treating it as final and binding.
        </div>

        <Section title="1. Acceptance of Terms">
          <p>
            By creating an account or using the Trustworthy Machinery (&quot;TM&quot;) platform, you agree to be bound by these Terms
            of Service and our Privacy Policy. If you do not agree, you must not use the platform.
          </p>
        </Section>

        <Section title="2. What TM Is (and Is Not)">
          <p>
            TM is a matchmaking marketplace connecting machinery owners, renters, operators, mechanics, transporters, and industrial
            businesses. Unless expressly stated (for example, where TM provides an optional escrow service), TM is not a party to
            transactions between users, does not own the machinery listed, and does not guarantee the accuracy of any listing beyond
            what is indicated by our verification badges.
          </p>
        </Section>

        <Section title="3. Eligibility">
          <p>
            You must be at least 18 years old and have the legal capacity to enter into binding contracts under the Ethiopian Civil
            Code to use TM. Businesses registering on TM must hold valid business registration and any licenses required under
            Ethiopian law for the goods or services they offer.
          </p>
        </Section>

        <Section title="4. Account Registration and Verification">
          <p>
            You agree to provide accurate, current, and complete information when creating an account and during any KYC
            verification process, and to keep this information up to date. TM may suspend or terminate accounts that provide false or
            misleading information.
          </p>
        </Section>

        <Section title="5. Listings and Seller Obligations">
          <p>
            Consistent with the Trade Competition and Consumer Protection Proclamation No. 813/2013, sellers and lessors on TM must:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Provide sufficient and accurate information about the quality, type, and condition of the machinery offered;</li>
            <li>Not engage in misleading, deceptive, or unfair trade practices;</li>
            <li>Honor the price and terms stated in a listing once a transaction is agreed; and</li>
            <li>Treat buyers and renters fairly and respectfully.</li>
          </ul>
        </Section>

        <Section title="6. Fees and Payments">
          <p>
            TM may charge fees for premium listing plans, contact-unlock access, or optional escrow services, as displayed on the
            Pricing page at the time of purchase. Fees are quoted in Ethiopian Birr (ETB) and are non-refundable except where required
            by law or expressly stated otherwise.
          </p>
        </Section>

        <Section title="7. Optional Escrow Service">
          <p>
            Where TM offers an optional escrow service, funds are held by TM or its designated payment partner until the conditions
            agreed by both parties (such as on-site inspection) are satisfied. Escrow terms specific to a transaction will be
            presented at the time of use and form part of these Terms once accepted.
          </p>
        </Section>

        <Section title="8. Electronic Contracts">
          <p>
            Agreements formed through TM, including electronic acceptance of listing terms and escrow conditions, are legally
            recognized and enforceable under the Electronic Transaction Proclamation No. 1205/2020, which grants electronic records
            and signatures the same legal validity as their paper equivalents.
          </p>
        </Section>

        <Section title="9. Prohibited Conduct">
          <p>You agree not to:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>List machinery you do not own or are not authorized to sell, rent, or broker;</li>
            <li>Circumvent TM&apos;s escrow or contact-unlock systems to avoid applicable fees;</li>
            <li>Post false, misleading, or fraudulent listings or reviews;</li>
            <li>Use the platform for any unlawful purpose under Ethiopian law; or</li>
            <li>Attempt to interfere with the security or normal operation of the platform.</li>
          </ul>

          <p className="mt-4 font-semibold">9.1 Circumvention of TM&apos;s Commission</p>
          <p>
            When TM introduces a buyer and seller through the Opportunity Unlock or Verified Inspection process, TM has earned a
            commission on any resulting sale, rental, or transport booking between those parties, regardless of whether the deal is
            ultimately completed through TM&apos;s platform or arranged independently after the introduction. Deliberately completing
            a transaction outside the platform with a party you were introduced to through TM, specifically to avoid TM&apos;s
            commission, is a breach of these Terms.
          </p>
          <p className="mt-2">This obligation applies for twelve (12) months from the date of introduction. TM may:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Suspend or terminate the accounts of any parties found to have circumvented TM in this way;</li>
            <li>Invoice the commission that would have been owed had the deal been completed through TM, calculated at the standard rate for that category; and</li>
            <li>Decline to provide future facilitation, escrow, or verified inspection services to parties who have done so.</li>
          </ul>
          <p className="mt-2">
            To make honoring this straightforward, the ETB 500 Opportunity Unlock fee is credited in full toward the commission owed
            on any deal you complete through TM within the same introduction — you are not charged twice for the same relationship.
          </p>
        </Section>

        <Section title="10. Intellectual Property">
          <p>
            The TM name, logo, and platform design are the property of Trustworthy Machinery. Users retain ownership of content they
            submit (such as listing photos and descriptions) but grant TM a license to display that content on the platform for the
            purpose of operating the marketplace.
          </p>
        </Section>

        <Section title="11. Limitation of Liability">
          <p>
            TM facilitates connections between users but is not responsible for the condition, legality, or performance of machinery
            listed by third parties, except to the extent TM has expressly undertaken verification or escrow obligations. To the
            maximum extent permitted under Ethiopian law, TM&apos;s liability for any claim arising from use of the platform is
            limited to the fees paid by the affected user in the preceding three months.
          </p>
        </Section>

        <Section title="12. Suspension and Termination">
          <p>
            TM may suspend or terminate any account that violates these Terms, provides false verification information, or engages in
            conduct harmful to other users or the platform, with or without notice depending on the severity of the violation.
          </p>
        </Section>

        <Section title="13. Dispute Resolution and Governing Law">
          <p>
            These Terms are governed by the laws of the Federal Democratic Republic of Ethiopia. Any dispute arising from these Terms
            or use of the platform that cannot be resolved amicably shall be subject to the jurisdiction of the competent courts of
            Addis Ababa, Ethiopia, without prejudice to any consumer rights available to you under the Trade Competition and Consumer
            Protection Proclamation.
          </p>
        </Section>

        <Section title="14. Changes to These Terms">
          <p>
            We may update these Terms from time to time. Continued use of TM after changes take effect constitutes acceptance of the
            revised Terms. Material changes will be posted on this page with an updated effective date.
          </p>
        </Section>

        <Section title="15. Contact Us">
          <p>
            Questions about these Terms can be directed to{" "}
            <a href="mailto:machinerymatchmaker@gmail.com" className="text-amber-400 hover:text-amber-300">
              machinerymatchmaker@gmail.com
            </a>{" "}
            or +251 911 000 000.
          </p>
        </Section>
      </section>
    </div>
  );
}