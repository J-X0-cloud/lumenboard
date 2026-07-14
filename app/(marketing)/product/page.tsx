import type { Metadata } from "next";

import { AskPanel } from "@/components/ask/AskPanel";
import { LineageDiagram } from "@/components/charts/LineageDiagram";
import { OverviewPanel } from "@/components/dashboard/panels/OverviewPanel";
import { Connections } from "@/components/marketing/Connections";
import { CtaBox } from "@/components/marketing/CtaBox";
import { FeatureSplit } from "@/components/marketing/FeatureSplit";
import { PageHero } from "@/components/marketing/PageHero";
import { ScheduleCard } from "@/components/marketing/ScheduleCard";
import { TileGrid } from "@/components/marketing/TileGrid";
import { ButtonLink } from "@/components/ui/Button";
import { CheckList } from "@/components/ui/CheckList";
import { Icon } from "@/components/ui/icons";
import { buildAnswer } from "@/lib/ask";
import {
  ASK_CAPABILITIES,
  DASHBOARD_TILES,
  PRODUCT_SECTIONS,
  REPORT_POINTS,
  SECURITY_TILES,
  SEMANTIC_LAYER_POINTS,
} from "@/lib/data/product";
import { WALKTHROUGH_URL } from "@/lib/data/site";
import { selectOverview } from "@/lib/metrics";

export const metadata: Metadata = {
  title: "Product tour — Ask AI, dashboards, metrics & reports",
  description:
    "How Lumenboard works: plain-English questions with checkable answers, auto-built dashboards, a semantic layer in code, scheduled reports and alerts, and warehouse-native security.",
};

export default function ProductPage() {
  return (
    <>
      <PageHero
        eyebrow="Product tour"
        title="Everything between your warehouse and the decision"
        lead="Ask questions in plain English, get dashboards drafted for you, define metrics once and send the numbers where people already work. Here's how each piece fits together."
      >
        <div className="hero-cta" style={{ justifyContent: "flex-start" }}>
          <ButtonLink href="/demo" variant="ink">
            Try the live demo <Icon name="arrow" />
          </ButtonLink>
          <ButtonLink href={WALKTHROUGH_URL} variant="ghost">
            Book a walkthrough
          </ButtonLink>
        </div>
      </PageHero>

      <nav className="subnav" aria-label="Product sections">
        <div className="wrap">
          {PRODUCT_SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`}>
              {s.label}
            </a>
          ))}
        </div>
      </nav>

      <FeatureSplit
        id="ask"
        reverse
        flush={false}
        eyebrow="Ask AI"
        title="Plain-English questions, checkable answers"
        lead="Lumenboard maps each question to certified metrics and dimensions before writing any SQL. If a question can't be answered from governed definitions, it says so and suggests the closest metric instead of improvising."
        stage={
          <div className="stage">
            <AskPanel
              variant="static"
              className="panel"
              answers={{ "west-dip": buildAnswer("west-dip") }}
              selected="west-dip"
            />
          </div>
        }
      >
        <CheckList items={ASK_CAPABILITIES} />
      </FeatureSplit>

      <section className="sec" id="dashboards" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <span className="eyebrow">Dashboards</span>
          <h2 className="h2" style={{ maxWidth: 760 }}>
            Dense where it matters, readable everywhere
          </h2>
          <p className="lead">
            Drafted from a prompt or built by hand, dashboards share one set of filters and date ranges, show
            comparisons by default and let anyone hover to the exact value or drill down to rows.
          </p>
          <div className="panel" style={{ marginTop: 36, padding: 0, overflow: "hidden" }}>
            <div className="win-bar">
              <i />
              <i />
              <i />
              <span>Executive overview · last 90 days</span>
            </div>
            <div style={{ padding: 18, background: "#f3f4f9" }}>
              <OverviewPanel model={selectOverview("90d")} />
            </div>
          </div>
          <TileGrid tiles={DASHBOARD_TILES} style={{ marginTop: 20 }} />
        </div>
      </section>

      <FeatureSplit
        id="metrics"
        eyebrow="Semantic layer"
        title="Metrics as code, with a UI for everyone else"
        lead="Keep definitions in your repo next to dbt, or edit them in the app. Either way you get pull-request review, certification, owners and a full change history."
        stage={
          <div className="panel">
            <LineageDiagram />
          </div>
        }
      >
        <CheckList items={SEMANTIC_LAYER_POINTS} />
        <p style={{ marginTop: 26 }}>
          <ButtonLink href="/metrics" variant="ghost">
            Open the metrics catalog <Icon name="arrow" />
          </ButtonLink>
        </p>
      </FeatureSplit>

      <FeatureSplit
        id="reports"
        reverse
        eyebrow="Reports & alerts"
        title="Send the numbers where people already look"
        lead="Schedule dashboards, single charts or AI briefings to email and Slack. Alerts watch any metric for thresholds or unusual movement and include the explanation, not just the number."
        stage={
          <div className="stage">
            <ScheduleCard />
          </div>
        }
      >
        <CheckList items={REPORT_POINTS} />
      </FeatureSplit>

      <section className="sec" id="security" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <span className="eyebrow">Security &amp; governance</span>
          <h2 className="h2">Your data stays where it is</h2>
          <p className="lead">
            Lumenboard pushes queries down to your warehouse and stores only metadata and short-lived cached
            results. Access is controlled per metric and per row.
          </p>
          <TileGrid tiles={SECURITY_TILES} style={{ marginTop: 36 }} />
        </div>
      </section>

      <section className="sec" id="connect" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <span className="eyebrow">Connections</span>
          <h2 className="h2">Works with the stack you have</h2>
          <Connections />
        </div>
      </section>

      <CtaBox
        title="Explore a working dashboard"
        body="Four tabs, four date ranges and an AI panel, running on a realistic sample data set."
        primary={{ label: "Open the live demo", href: "/demo", arrow: true }}
        secondary={{ label: "See pricing", href: "/pricing" }}
      />
    </>
  );
}
