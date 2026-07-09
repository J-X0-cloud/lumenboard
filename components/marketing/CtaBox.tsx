import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/icons";

interface CtaBoxProps {
  title: string;
  body: string;
  primary: { label: string; href: string; arrow?: boolean };
  secondary: { label: string; href: string };
  flush?: boolean;
}

export function CtaBox({ title, body, primary, secondary, flush = true }: CtaBoxProps) {
  return (
    <section className="cta" style={flush ? { paddingTop: 0 } : undefined}>
      <div className="wrap">
        <div className="cta-box">
          <h2>{title}</h2>
          <p>{body}</p>
          <div className="hero-cta">
            <ButtonLink href={primary.href} variant="amber">
              {primary.label} {primary.arrow ? <Icon name="arrow" /> : null}
            </ButtonLink>
            <ButtonLink href={secondary.href} variant="line">
              {secondary.label}
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
