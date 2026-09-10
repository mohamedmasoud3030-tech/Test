import { NextResponse } from "next/server";
import { driveFleet } from "@/lib/runner";
import { getStats } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  await driveFleet();
  return NextResponse.json(await getStats());
}
