"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/icons";
import { NAV_LINKS, WALKTHROUGH_URL } from "@/lib/data/site";

import { Logo } from "./Logo";

export function Header() {
  const pathname = usePathname();

  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <div className="wrap">
          <nav className="nav" aria-label="Main">
            <Logo />
            <div className="nav-links">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={pathname === link.href ? "page" : undefined}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="nav-cta">
              <a className="signin" href="#">
                Sign in
              </a>
              <ButtonLink href={WALKTHROUGH_URL} variant="line" size="sm">
                Book a walkthrough
              </ButtonLink>
              <ButtonLink href="/demo" variant="amber" size="sm">
                Open live demo
              </ButtonLink>
            </div>
            <details className="mnav">
              <summary aria-label="Menu">
                <Icon name="menu" />
              </summary>
              <div className="mnav-panel">
                {NAV_LINKS.map((link) => (
                  <Link key={link.href} href={link.href}>
                    {link.label}
                  </Link>
                ))}
                <a href="#">Sign in</a>
                <ButtonLink href="/demo" variant="amber">
                  Open live demo
                </ButtonLink>
              </div>
            </details>
          </nav>
        </div>
      </header>
    </>
  );
}
