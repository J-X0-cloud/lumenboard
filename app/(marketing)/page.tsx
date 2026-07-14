import Link from "next/link";

import { AskPanel } from "@/components/ask/AskPanel";
import { AppWindow } from "@/components/dashboard/AppWindow";
import { RetentionPanel } from "@/components/dashboard/panels/RetentionPanel";
import { CtaBox } from "@/components/marketing/CtaBox";
import { FeatureSplit } from "@/components/marketing/FeatureSplit";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { MetricRows } from "@/components/marketing/MetricRows";
import { MetricYaml } from "@/components/marketing/MetricYaml";
import { Personas } from "@/components/marketing/Personas";
import { Testimonial } from "@/components/marketing/Testimonial";
import { WeeklyDigest } from "@/components/marketing/WeeklyDigest";
import { ButtonLink } from "@/components/ui/Button";
import { CheckList } from "@/components/ui/CheckList";
import { Icon } from "@/components/ui/icons";
import { buildAnswer } from "@/lib/ask";
import { ASK_POINTS, GOVERNANCE_POINTS, HERO_NOTES, SCHEDULE_CHIPS, WAREHOUSES } from "@/lib/data/home";
import { NET_REVENUE_REVIEWER } from "@/lib/data/metric-history";
import { WALKTHROUGH_URL } from "@/lib/data/site";
import { selectRetention } from "@/lib/metrics";

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="wrap">
          <div className="hero-copy">
            <Link className="pill" href="/product#reports">
              <b>New</b>AI-written Monday briefings for every team <Icon name="arrow" />
            </Link>
            <h1>
              Ask your warehouse anything. <em>Get answers everyone trusts.</em>
            </h1>
            <p className="sub">
              Lumenboard connects to your data warehouse, turns plain-English questions into charts built on
              governed metric definitions, and keeps every dashboard and scheduled report telling the same
              story.
            </p>
            <div className="hero-cta">
              <ButtonLink href="/demo" variant="amber">
                Open the live demo <Icon name="arrow" />
              </ButtonLink>
              <ButtonLink href={WALKTHROUGH_URL} variant="line">
                Book a walkthrough
              </ButtonLink>
            </div>
            <div className="hero-note">
              {HERO_NOTES.map((note) => (
                <span key={note.text}>
                  <Icon name={note.icon} />
                  {note.text}
                </span>
              ))}
            </div>
          </div>
          <div className="hero-shot">
            <AppWindow intent="west-dip" />
          </div>
        </div>
      </section>

      <section className="strip">
        <div className="wrap">
          <p>Connects to the warehouse you already run, with no data copies and no extracts to babysit</p>
          <div className="wh">
            {WAREHOUSES.map((w) => (
              <span key={w}>{w}</span>
            ))}
          </div>
        </div>
      </section>

      <HowItWorks />

      <FeatureSplit
        eyebrow="Ask AI"
        title="Answers that show their work"
        lead="Every answer lists the metrics it used, the filters it applied and the SQL it ran, so an analyst can check it in ten seconds and a manager can trust it without asking one."
        stage={
          <div className="stage">
            <AskPanel
              variant="static"
              className="panel"
              answers={{ "channel-growth": buildAnswer("channel-growth") }}
              selected="channel-growth"
            />
          </div>
        }
      >
        <CheckList items={ASK_POINTS} />
      </FeatureSplit>

      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="center">
            <span className="eyebrow">Auto-built dashboards</span>
            <h2 className="h2">Describe the dashboard. Lumenboard builds the first draft.</h2>
            <p className="lead">
              Type “weekly retention view for the growth team” and get a laid-out dashboard with cohorts,
              curves and the right filters. Edit anything, then publish.
            </p>
          </div>
          <div className="panel" style={{ marginTop: 44, padding: 0, overflow: "hidden" }}>
            <div className="win-bar">
              <i />
              <i />
              <i />
              <span>Retention · draft generated from a prompt</span>
            </div>
            <div style={{ padding: 18, background: "#f3f4f9" }}>
              <RetentionPanel model={selectRetention("90d")} />
            </div>
          </div>
        </div>
      </section>

      <FeatureSplit
        reverse
        eyebrow="Governed metrics"
        title="One definition of revenue. Everywhere."
        lead="Metrics are defined in code, reviewed like code and synced from your repo. Change the definition once and every dashboard, report and AI answer updates with it."
        stage={
          <div className="stage ink">
            <div className="code-h">
              <Icon name="git" />
              main · metrics/finance · reviewed by {NET_REVENUE_REVIEWER}
            </div>
            <MetricYaml style={{ fontSize: 12, padding: "16px 18px" }} />
            <MetricRows />
          </div>
        }
      >
        <CheckList items={GOVERNANCE_POINTS} />
        <p style={{ marginTop: 26 }}>
          <ButtonLink href="/metrics" variant="ghost">
            Browse the metrics catalog <Icon name="arrow" />
          </ButtonLink>
        </p>
      </FeatureSplit>

      <FeatureSplit
        eyebrow="Scheduled reports"
        title="The Monday numbers, already explained"
        lead="Schedule any dashboard or answer to email or Slack. Lumenboard adds a short written summary of what changed and why, drawn from the same certified metrics."
        stage={
          <div className="stage">
            <WeeklyDigest />
          </div>
        }
      >
        <div className="sched">
          {SCHEDULE_CHIPS.map((chip) => (
            <span key={chip.text} className="chip">
              <Icon name={chip.icon} />
              {chip.text}
            </span>
          ))}
        </div>
      </FeatureSplit>

      <Personas />
      <Testimonial />

      <CtaBox
        title="See it on real-looking data"
        body="The live demo is a working dashboard. Switch date ranges, change tabs, hover the charts and ask the AI panel a question."
        primary={{ label: "Open the live demo", href: "/demo", arrow: true }}
        secondary={{ label: "See pricing", href: "/pricing" }}
      />
    </>
  );
}
