import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;

  const attendees = await prisma.attendee.findMany({
    where: { eventId },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(attendees);
}
