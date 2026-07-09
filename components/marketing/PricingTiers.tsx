import clsx from "clsx";

import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/icons";
import { Tag } from "@/components/ui/Tag";
import { TIERS } from "@/lib/data/pricing";

export function PricingTiers() {
  return (
    <div className="tiers">
      {TIERS.map((tier) => (
        <div key={tier.name} className={clsx("tier", tier.popular && "pop")}>
          {tier.popular ? <Tag>Most teams</Tag> : null}
          <h3>{tier.name}</h3>
          <p className="for">{tier.audience}</p>
          <div
            className="price"
            style={
              tier.unit ? undefined : tier.price === "Custom" ? { fontSize: 36, padding: "4px 0" } : undefined
            }
          >
            {tier.price}
            {tier.unit ? <small>{tier.unit}</small> : null}
          </div>
          <ButtonLink href={tier.cta.href} variant={tier.cta.variant}>
            {tier.cta.label}
          </ButtonLink>
          <ul>
            {tier.features.map((f) => (
              <li key={f}>
                <Icon name="check" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
