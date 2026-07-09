import Link from "next/link";
import type { MouseEvent, ReactNode } from "react";

import { Logo } from "@/components/site/Logo";
import { Icon } from "@/components/ui/icons";
import type { IconName } from "@/components/ui/icons";
import { WORKSPACE } from "@/lib/data/dimensions";
import { AMBER, CORAL, INDIGO, TEAL, VIOLET } from "@/lib/palette";
import type { TabKey } from "@/types/dashboard";

const DASHBOARDS: Array<{ tab: TabKey; label: string; color: string }> = [
  { tab: "overview", label: "Executive overview", color: INDIGO },
  { tab: "revenue", label: "Revenue & margin", color: TEAL },
  { tab: "retention", label: "Retention", color: AMBER },
  { tab: "acquisition", label: "Acquisition", color: CORAL },
];

const WORKSPACE_LINKS: Array<{ href: string; icon: IconName; label: string; badge?: ReactNode }> = [
  { href: "#", icon: "home", label: "Home" },
  { href: "#ask", icon: "spark", label: "Ask AI", badge: "⌘K" },
  { href: "/metrics", icon: "book", label: "Metrics catalog", badge: WORKSPACE.certifiedMetrics },
  { href: "#", icon: "mail", label: "Reports", badge: 6 },
  { href: "#", icon: "bell", label: "Alerts" },
];

interface SidebarProps {
  active: TabKey;
  /** Omit for the static product screenshots on marketing pages. */
  onSelect?: (tab: TabKey) => void;
}

export function Sidebar({ active, onSelect }: SidebarProps) {
  const select = (tab: TabKey) => (e: MouseEvent) => {
    e.preventDefault();
    onSelect?.(tab);
  };

  return (
    <nav className="side" aria-label="Workspace">
      <Logo />
      <div className="ws">
        <i>{WORKSPACE.initials}</i>
        <div>
          {WORKSPACE.name}
          <small>{WORKSPACE.warehouse}</small>
        </div>
      </div>
      {WORKSPACE_LINKS.map((link) => {
        const content = (
          <>
            <Icon name={link.icon} />
            {link.label}
            {link.badge !== undefined ? <em>{link.badge}</em> : null}
          </>
        );
        return link.href.startsWith("/") ? (
          <Link key={link.label} href={link.href}>
            {content}
          </Link>
        ) : (
          <a key={link.label} href={link.href}>
            {content}
          </a>
        );
      })}
      <h5>Dashboards</h5>
      {DASHBOARDS.map((d) => (
        <a
          key={d.tab}
          href="#"
          className={d.tab === active ? "on" : undefined}
          onClick={onSelect ? select(d.tab) : undefined}
        >
          <i className="dotc" style={{ background: d.color }} />
          {d.label}
        </a>
      ))}
      <a href="#">
        <i className="dotc" style={{ background: VIOLET }} />
        Inventory health
      </a>
      <h5>Data</h5>
      <a href="#">
        <Icon name="db" />
        Sources
      </a>
      <a href="#">
        <Icon name="layers" />
        Semantic model
      </a>
      <div className="side-foot">
        <Icon name="check" />
        Synced with dbt · 6 min ago
      </div>
    </nav>
  );
}
