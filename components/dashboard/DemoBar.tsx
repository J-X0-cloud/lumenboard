import Link from "next/link";

import { WORKSPACE } from "@/lib/data/dimensions";
import { WALKTHROUGH_URL } from "@/lib/data/site";

export function DemoBar() {
  return (
    <div className="demo-bar">
      <b>Live demo</b>
      <span className="hide-sm">Sample data for {WORKSPACE.legalName}, a fictional outdoor retailer</span>
      <span className="sp1">
        <Link href="/">← Back to site</Link>
        <a className="btn btn-amber hide-sm" href={WALKTHROUGH_URL}>
          Book a walkthrough
        </a>
      </span>
    </div>
  );
}
