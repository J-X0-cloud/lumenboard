import clsx from "clsx";
import type { ReactNode } from "react";

interface CardProps {
  title: ReactNode;
  subtitle?: ReactNode;
  span?: 2 | 3;
  tools?: boolean;
  className?: string;
  children: ReactNode;
}

/** Dashboard card with a title row and the three-dot tool affordance. */
export function Card({ title, subtitle, span, tools = true, className, children }: CardProps) {
  return (
    <section className={clsx("card", span && `span${span}`, className)}>
      <header className="card-h">
        <div>
          <h3>{title}</h3>
          {subtitle ? <span className="card-sub">{subtitle}</span> : null}
        </div>
        {tools ? (
          <span className="card-tools" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        ) : null}
      </header>
      <div className="card-b">{children}</div>
    </section>
  );
}
