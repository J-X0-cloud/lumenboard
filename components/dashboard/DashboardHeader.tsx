import { Icon } from "@/components/ui/icons";

/** Breadcrumbs, title, freshness and owner for the Leadership dashboard. */
export function DashboardHeader({
  title = "Executive overview",
  asHeading = true,
}: {
  title?: string;
  asHeading?: boolean;
}) {
  const Title = asHeading ? "h1" : "div";
  return (
    <>
      <div className="crumbs">
        Dashboards <span>/</span> <b>Leadership</b>
      </div>
      <div className="dhead">
        <div>
          <Title className="h">{title}</Title>
          <div className="dmeta">
            <span className="live">Live · refreshed 6 min ago</span>
            <span>Owner: Data team</span>
            <span className="tag">
              <Icon name="check" />
              Certified
            </span>
          </div>
        </div>
        <div className="dact">
          <a className="btn btn-ghost hide-sm" href="#">
            <Icon name="mail" />
            Schedule
          </a>
          <a className="btn btn-ghost hide-sm" href="#">
            <Icon name="share" />
            Share
          </a>
          <a className="btn btn-ink" href="#ask">
            <Icon name="spark" />
            Ask
          </a>
        </div>
      </div>
    </>
  );
}
