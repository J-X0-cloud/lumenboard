"use client";

import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";

import { Icon } from "@/components/ui/icons";
import { INTENTS, SUGGESTED_QUESTIONS, UNSUPPORTED_HINT } from "@/lib/ask";
import { WORKSPACE } from "@/lib/data/dimensions";
import type { AskAnswer as AskAnswerModel, AskIntent, AskResponse } from "@/types/ask";

import { AskAnswer } from "./AskAnswer";

interface AskPanelProps {
  /** Pre-built answers for the suggested questions, keyed by intent. */
  answers: Partial<Record<AskIntent, AskAnswerModel>>;
  /** Controlled selection (the dashboard's insight links can open an answer). */
  selected: AskIntent;
  onSelect?: (intent: AskIntent) => void;
  /** Static variant renders a single answer with a disabled input, for product screenshots. */
  variant?: "interactive" | "static";
  className?: string;
}

export function AskPanel({ answers, selected, onSelect, variant = "interactive", className }: AskPanelProps) {
  const interactive = variant === "interactive";
  const bodyRef = useRef<HTMLDivElement>(null);
  const [custom, setCustom] = useState<AskAnswerModel | null>(null);
  const [hint, setHint] = useState("");
  const [pending, setPending] = useState(false);
  const shown = custom ?? answers[selected];

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 0 });
  }, [shown]);

  function choose(intent: AskIntent) {
    setCustom(null);
    setHint("");
    onSelect?.(intent);
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const question = String(new FormData(form).get("q") ?? "").trim();
    if (!question) return;
    setPending(true);
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ question, workspace: WORKSPACE.id }),
      });
      const data = (await res.json()) as AskResponse;
      if (data.ok) {
        setCustom(data.answer);
        setHint("");
        form.reset();
      } else {
        setHint(data.error === "unsupported_question" ? data.hint : UNSUPPORTED_HINT);
      }
    } catch {
      setHint(UNSUPPORTED_HINT);
    } finally {
      setPending(false);
    }
  }

  return (
    <aside className={clsx("ai", className)} id={interactive ? "ask" : undefined} aria-label="Ask Lumenboard">
      <div className="ai-h">
        <span className="orb">
          <Icon name="spark" />
        </span>
        <div>
          <b>Ask Lumenboard</b>
          <small>Answers from {WORKSPACE.certifiedMetrics} certified metrics</small>
        </div>
        <span className="tag green">Governed</span>
      </div>
      <div className="ai-b" ref={bodyRef} aria-live="polite">
        {shown ? (
          <div className="aset">
            <AskAnswer answer={shown} />
          </div>
        ) : null}
      </div>
      {interactive ? (
        <>
          <div className="sugg">
            {INTENTS.map((intent) => (
              <button
                key={intent}
                type="button"
                aria-pressed={!custom && intent === selected}
                onClick={() => choose(intent)}
              >
                {SUGGESTED_QUESTIONS[intent]}
              </button>
            ))}
          </div>
          <form className="ask" onSubmit={onSubmit}>
            <input
              name="q"
              aria-label="Ask a question about your data"
              placeholder="Ask about revenue, channels, retention…"
              autoComplete="off"
            />
            <button type="submit" aria-label="Ask" disabled={pending}>
              <Icon name="send" />
            </button>
          </form>
          <p className="ask-hint" aria-live="polite">
            {hint}
          </p>
        </>
      ) : (
        <div className="ask">
          <input
            aria-label="Ask a question"
            placeholder={`Ask anything about ${WORKSPACE.name}…`}
            tabIndex={-1}
            readOnly
          />
          <button type="button" tabIndex={-1} aria-label="Ask">
            <Icon name="send" />
          </button>
        </div>
      )}
    </aside>
  );
}
