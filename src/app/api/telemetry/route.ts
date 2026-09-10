import { NextResponse } from "next/server";
import { driveFleet } from "@/lib/runner";
import { getTelemetry } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET() {
  await driveFleet();
  return NextResponse.json(await getTelemetry(80));
}
