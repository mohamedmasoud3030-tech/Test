import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { tenants } from "@/db/schema";
import { listTenants } from "@/lib/queries";
import { slugify } from "@/lib/util";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ tenants: await listTenants() });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body?.name) return NextResponse.json({ error: "name is required" }, { status: 400 });
  const id = slugify(String(body.id ?? body.name));
  if (!id) return NextResponse.json({ error: "could not derive tenant id" }, { status: 400 });
  const root = body.regulatory ? "/srv/regulated-work" : "/srv/work";
  const configRoot = body.regulatory ? "/srv/regulated-config" : "/srv/config";
  try {
    await db.insert(tenants).values({
      id,
      name: String(body.name),
      tier: body.tier === "team" ? "team" : "enterprise",
      endUserLabel: String(body.endUserLabel ?? "enduser"),
      workdirRoot: root,
      configRoot,
      isolateSettings: body.isolateSettings !== false,
      disableAutoMemory: body.disableAutoMemory !== false,
      distinctEgress: !!body.distinctEgress,
      egressPolicy: body.distinctEgress ? "per-tenant outbound identity" : "shared egress",
    });
  } catch (err) {
    return NextResponse.json({ error: "Tenant id already exists" }, { status: 409 });
  }
  return NextResponse.json({ id }, { status: 201 });
}
