import clsx from "clsx";
import Link from "next/link";
import type { ReactNode } from "react";

export type ButtonVariant = "amber" | "ink" | "line" | "ghost";

interface ButtonLinkProps {
  href: string;
  variant?: ButtonVariant;
  size?: "sm" | "md";
  className?: string;
  children: ReactNode;
}

/** Anchor styled as a button. Internal routes use next/link; mailto: and hash links render a plain <a>. */
export function ButtonLink({ href, variant = "ink", size = "md", className, children }: ButtonLinkProps) {
  const cls = clsx("btn", `btn-${variant}`, size === "sm" && "btn-sm", className);
  if (href.startsWith("/")) {
    return (
      <Link className={cls} href={href}>
        {children}
      </Link>
    );
  }
  return (
    <a className={cls} href={href}>
      {children}
    </a>
  );
}
