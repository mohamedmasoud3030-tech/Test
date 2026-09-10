import { NextRequest, NextResponse } from "next/server";
import { sendTurn, stopSession, suspendSession, resumeSession, forkSession, getSessionDetail } from "@/lib/runner";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const body = await req.json().catch(() => ({}));
  const action: string = body?.action ?? "";
  try {
    switch (action) {
      case "turn":
        if (!body?.prompt) return NextResponse.json({ error: "prompt required" }, { status: 400 });
        await sendTurn(id, String(body.prompt));
        return NextResponse.json({ ok: true });
      case "stop":
        await stopSession(id);
        return NextResponse.json({ ok: true });
      case "suspend":
        await suspendSession(id);
        return NextResponse.json({ ok: true });
      case "resume": {
        const s = await resumeSession(id, body?.hostId);
        return NextResponse.json({ ok: true, sessionId: s.id });
      }
      case "fork": {
        const s = await forkSession(id);
        return NextResponse.json({ ok: true, sessionId: s.id });
      }
      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Action failed" }, { status: 400 });
  }
}
