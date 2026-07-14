import { NextResponse } from "next/server";
import { z } from "zod";

import { answerQuestion } from "@/lib/ask";
import { WORKSPACE } from "@/lib/data/dimensions";
import type { AskResponse } from "@/types/ask";

const AskRequestSchema = z.object({
  question: z.string().trim().min(3, "Ask a slightly longer question").max(500),
  workspace: z.string().default(WORKSPACE.id),
});

/**
 * POST /api/ask — question → query plan → SQL + chart spec.
 *
 * Questions are resolved against certified metrics only. Unsupported questions return 422 with a hint
 * and the suggested questions rather than a guessed answer.
 */
export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  const parsed = AskRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json<AskResponse>(
      { ok: false, error: "invalid_request", issues: z.flattenError(parsed.error).fieldErrors },
      { status: 400 },
    );
  }

  const result = answerQuestion(parsed.data.question, parsed.data.workspace);
  return NextResponse.json<AskResponse>(result, {
    status: result.ok ? 200 : 422,
    headers: { "cache-control": "no-store" },
  });
}
