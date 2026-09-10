import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { hosts } from "@/db/schema";
import { listHosts } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ hosts: await listHosts() });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body?.name) return NextResponse.json({ error: "name is required" }, { status: 400 });
  const row = await db
    .insert(hosts)
    .values({
      name: String(body.name),
      provider: String(body.provider ?? "docker"),
      region: String(body.region ?? "us-east-1"),
      runtime: body.runtime === "python" ? "python" : "node",
      ramMb: Number(body.ramMb ?? 4096),
      cpus: Number(body.cpus ?? 2),
      overheadMb: Number(body.overheadMb ?? 512),
      perSessionRamMb: Number(body.perSessionRamMb ?? 1024),
      note: body.note ? String(body.note) : null,
    })
    .returning();
  return NextResponse.json({ id: row[0].id }, { status: 201 });
}
