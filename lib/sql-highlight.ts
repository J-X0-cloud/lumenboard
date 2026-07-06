export type SqlToken = { text: string; kind?: "keyword" | "string" | "comment" };

const KEYWORDS = new Set([
  "select",
  "from",
  "where",
  "group",
  "order",
  "by",
  "join",
  "on",
  "and",
  "as",
  "with",
  "between",
  "sum",
  "count",
  "date_trunc",
  "case",
  "when",
  "then",
  "else",
  "end",
  "left",
  "desc",
  "limit",
  "distinct",
  "in",
]);

const TOKEN = /(--[^\n]*)|('(?:[^']|'')*')|([A-Za-z_][A-Za-z0-9_]*)|(\s+|[^A-Za-z_'\s-]+|-)/g;

/** Split SQL into tokens for syntax highlighting. Keywords are upper-cased for display. */
export function highlightSql(sql: string): SqlToken[] {
  const tokens: SqlToken[] = [];
  for (const m of sql.matchAll(TOKEN)) {
    const [text, comment, str, word] = m;
    if (comment) tokens.push({ text: comment, kind: "comment" });
    else if (str) tokens.push({ text: str, kind: "string" });
    else if (word && KEYWORDS.has(word.toLowerCase()))
      tokens.push({ text: word.toUpperCase(), kind: "keyword" });
    else tokens.push({ text });
  }
  return tokens;
}
