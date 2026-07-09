import { Icon } from "@/components/ui/icons";
import { HOW_IT_WORKS } from "@/lib/data/home";

export function HowItWorks() {
  return (
    <section className="sec">
      <div className="wrap">
        <div className="center">
          <span className="eyebrow">How it works</span>
          <h2 className="h2">From raw tables to a trusted answer in an afternoon</h2>
          <p className="lead">
            Your data team defines each metric once. Everyone else gets fast answers without filing a ticket
            or rebuilding a chart that already exists.
          </p>
        </div>
        <div className="steps4">
          {HOW_IT_WORKS.map((s) => (
            <div key={s.step} className="st">
              <span className="n">{s.step}</span>
              <Icon name={s.icon} />
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
