import { NextRequest, NextResponse } from "next/server";
import { listSessions } from "@/lib/queries";
import { createSession, driveFleet } from "@/lib/runner";

export const dynamic = "force-dynamic";

export async function GET() {
  await driveFleet();
  const rows = await listSessions();
  return NextResponse.json({ sessions: rows });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body?.tenantId || !body?.prompt) {
    return NextResponse.json({ error: "tenantId and prompt are required" }, { status: 400 });
  }
  try {
    const session = await createSession({
      tenantId: body.tenantId,
      prompt: String(body.prompt),
      sdk: body.sdk === "python" ? "python" : "typescript",
      pattern: body.pattern ?? "ephemeral",
      model: body.model ?? "claude-sonnet-4-5",
      maxTurns: Number(body.maxTurns ?? 20),
      storeBackend: body.storeBackend ?? "postgres",
      storeFlaky: !!body.storeFlaky,
      endUserId: body.endUserId,
      hostId: body.hostId,
    });
    return NextResponse.json({ id: session.id }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to launch" }, { status: 400 });
  }
}
