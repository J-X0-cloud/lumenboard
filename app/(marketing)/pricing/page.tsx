import type { Metadata } from "next";

import { CtaBox } from "@/components/marketing/CtaBox";
import { Faq } from "@/components/marketing/Faq";
import { PageHero } from "@/components/marketing/PageHero";
import { PlanComparison } from "@/components/marketing/PlanComparison";
import { PricingTiers } from "@/components/marketing/PricingTiers";
import { PRICING_FAQ } from "@/lib/data/pricing";
import { WALKTHROUGH_URL } from "@/lib/data/site";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Lumenboard pricing: free for up to 3 editors, unlimited viewers on every plan, and Team, Business and Enterprise plans for governed, AI-native BI.",
};

export default function PricingPage() {
  return (
    <>
      <PageHero
        centered
        eyebrow="Pricing"
        title="Pay for the people who build. Everyone else views free."
        lead="Every plan includes unlimited viewers, the metrics catalog and Ask AI. Prices in USD, billed annually or monthly."
      />
      <section style={{ paddingBottom: 40 }}>
        <div className="wrap">
          <PricingTiers />
          <PlanComparison />
          <div className="center" style={{ marginTop: 88 }}>
            <span className="eyebrow">Questions</span>
            <h2 className="h2">Pricing FAQ</h2>
          </div>
          <Faq items={PRICING_FAQ} />
        </div>
      </section>
      <CtaBox
        flush={false}
        title="Not sure which plan fits?"
        body="Tell us about your warehouse and team, and we'll walk through Lumenboard on data that looks like yours."
        primary={{ label: "Book a walkthrough", href: WALKTHROUGH_URL }}
        secondary={{ label: "Open the live demo", href: "/demo" }}
      />
    </>
  );
}
