import { Icon } from "@/components/ui/icons";
import { Tag } from "@/components/ui/Tag";
import { PERSONAS } from "@/lib/data/home";

export function Personas() {
  return (
    <section className="sec" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="center">
          <span className="eyebrow">Built for everyone the data team supports</span>
          <h2 className="h2">Fewer tickets. Better questions.</h2>
        </div>
        <div className="personas">
          {PERSONAS.map((p) => (
            <div key={p.tag} className="pc">
              <Tag tone={p.tone}>{p.tag}</Tag>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
              <div className="qs">
                {p.questions.map((q) => (
                  <span key={q}>
                    <Icon name="spark" />
                    {q}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
