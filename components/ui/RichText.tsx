import { Fragment } from "react";

import type { RichText as RichTextValue } from "@/types/dashboard";

export function RichText({ value }: { value: RichTextValue }) {
  return (
    <>
      {value.map((part, i) =>
        part.tone === "strong" ? (
          <strong key={i}>{part.text}</strong>
        ) : part.tone === "code" ? (
          <code key={i}>{part.text}</code>
        ) : (
          <Fragment key={i}>{part.text}</Fragment>
        ),
      )}
    </>
  );
}
