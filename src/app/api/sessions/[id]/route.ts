import { NextRequest, NextResponse } from "next/server";
import { getSessionDetail, tickSession } from "@/lib/runner";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const detail = await getSessionDetail(id);
  if (!detail) return NextResponse.json({ error: "Session not found" }, { status: 404 });

  const url = new URL(_req.url);
  if (url.searchParams.get("drive") === "1" && ["starting", "running"].includes(detail.session.status)) {
    await tickSession(id);
    const refreshed = await getSessionDetail(id);
    return NextResponse.json(refreshed);
  }
  return NextResponse.json(detail);
}
