import type { ChartSpec } from "./charts";
import type { AskIntentRef, Delta, RichText } from "./dashboard";

export type AskIntent = AskIntentRef;

export interface AskRequest {
  question: string;
  workspace: string;
}

/** The structured plan the question is compiled to before any SQL is written. */
export interface QueryPlan {
  metrics: string[];
  dimensions: string[];
  filters: Array<{ dimension: string; operator: "=" | "!=" | "in"; value: string | string[] }>;
  timeRange: { start: string; end: string };
  grain?: "day" | "week" | "month";
  comparison?: { kind: "prior_period"; days: number };
}

export interface AnswerAction {
  icon: "pin" | "mail" | "bell" | "share";
  label: string;
}

export interface AskAnswer {
  intent: AskIntent;
  question: string;
  steps: RichText[];
  card: {
    title: string;
    headline?: { value: string; delta?: Delta };
    chart: ChartSpec;
  };
  narrative: RichText;
  plan: QueryPlan;
  sql: string;
  actions: AnswerAction[];
}

export type AskResponse =
  | { ok: true; answer: AskAnswer }
  | { ok: false; error: "unsupported_question"; hint: string; suggestions: string[] }
  | { ok: false; error: "invalid_request"; issues: Record<string, string[] | undefined> };
