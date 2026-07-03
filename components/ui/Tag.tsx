import clsx from "clsx";
import type { ReactNode } from "react";

import { Icon } from "./icons";

export function Tag({
  tone,
  children,
  className,
}: {
  tone?: "green" | "amber" | "gray";
  children: ReactNode;
  className?: string;
}) {
  return <span className={clsx("tag", tone, className)}>{children}</span>;
}

export function StatusTag({ status }: { status: "certified" | "review" | "draft" }) {
  if (status === "certified") {
    return (
      <Tag tone="green">
        <Icon name="check" />
        Certified
      </Tag>
    );
  }
  return status === "review" ? <Tag tone="amber">In review</Tag> : <Tag tone="gray">Draft</Tag>;
}
