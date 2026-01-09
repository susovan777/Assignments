import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: { eventId: string } }
) {
  const attendees = await prisma.attendee.findMany({
    where: { eventId: params.eventId },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(attendees);
}
