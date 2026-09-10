import { NextRequest, NextResponse } from "next/server";
import { seedDatabase } from "@/lib/seed";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const result = await seedDatabase(body?.wipe !== false);
  return NextResponse.json({ ok: true, ...result });
}
