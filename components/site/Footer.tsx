import Link from "next/link";

import { FOOTER_COLUMNS, LEGAL_LINKS, TAGLINE } from "@/lib/data/site";

import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="foot">
          <div>
            <Logo />
            <p>{TAGLINE}</p>
          </div>
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <h4>{col.title}</h4>
              <ul>
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("/") ? (
                      <Link href={link.href}>{link.label}</Link>
                    ) : (
                      <a href={link.href}>{link.label}</a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="foot-bottom">
          <span>&copy; 2026 Lumenboard, Inc. All rights reserved.</span>
          <span className="status-dot">All systems operational</span>
          <span>
            {LEGAL_LINKS.map((label, i) => (
              <span key={label}>
                {i > 0 ? <>&nbsp;·&nbsp; </> : null}
                <a href="#">{label}</a>
              </span>
            ))}
          </span>
        </div>
      </div>
    </footer>
  );
}
