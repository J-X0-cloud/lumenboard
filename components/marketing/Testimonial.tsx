import { Icon } from "@/components/ui/icons";
import { TESTIMONIAL } from "@/lib/data/home";

export function Testimonial() {
  return (
    <section className="sec" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="quote">
          <div>
            <blockquote>“{TESTIMONIAL.quote}”</blockquote>
            <cite>
              <b>{TESTIMONIAL.name}</b> · {TESTIMONIAL.role}
            </cite>
          </div>
          <ul>
            {TESTIMONIAL.proof.map((item) => (
              <li key={item}>
                <Icon name="check" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
