import clsx from "clsx";
import type { ReactNode } from "react";

interface PageHeroProps {
  eyebrow: string;
  title: ReactNode;
  lead: ReactNode;
  centered?: boolean;
  children?: ReactNode;
}

export function PageHero({ eyebrow, title, lead, centered = false, children }: PageHeroProps) {
  return (
    <section className={clsx("page-hero", centered && "center")}>
      <div className="wrap">
        <span className="eyebrow">{eyebrow}</span>
        <h1 style={centered ? { marginLeft: "auto", marginRight: "auto" } : undefined}>{title}</h1>
        <p className="lead">{lead}</p>
        {children}
      </div>
    </section>
  );
}
