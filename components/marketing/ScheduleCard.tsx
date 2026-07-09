import { Icon } from "@/components/ui/icons";
import { Tag } from "@/components/ui/Tag";
import { MONDAY_SCHEDULE as S } from "@/lib/data/product";

/** The “schedule a report” form, shown filled in for the Monday metrics email. */
export function ScheduleCard() {
  return (
    <div className="panel">
      <div className="card-h" style={{ padding: "0 0 12px" }}>
        <div>
          <h3>Schedule “{S.name}”</h3>
          <span className="card-sub">{S.source}</span>
        </div>
        <Tag tone="green">Active</Tag>
      </div>
      <div className="form">
        <div className="fld">
          Deliver to
          <div>
            <Icon name="mail" />
            {S.recipient}{" "}
            {S.channels.map((c) => (
              <Tag key={c} tone="gray">
                {c}
              </Tag>
            ))}
          </div>
        </div>
        <div className="fld">
          Repeat
          <div style={{ justifyContent: "space-between" }}>
            <span className="days">
              {S.days.map((d, i) => (
                <span key={i} className={S.activeDays.includes(i) ? "on" : undefined}>
                  {d}
                </span>
              ))}
            </span>
            <span>{S.time}</span>
          </div>
        </div>
        <div className="fld">
          Include
          <div>
            {S.tiles.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
            <Tag tone="amber">
              <Icon name="spark" />
              What changed
            </Tag>
          </div>
        </div>
        <div className="fld">
          Alert rule
          <div>
            <Icon name="bell" />
            Notify {S.alert.channel} when <b>&nbsp;{S.alert.metric}&nbsp;</b> {S.alert.rule}
          </div>
        </div>
      </div>
    </div>
  );
}
