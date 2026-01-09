import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { CreateAttendeeSchema } from "@/lib/validations";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = CreateAttendeeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { errors: z.treeifyError(parsed.error) },
        { status: 400 }
      );
    }

    const { eventId, name, email } = parsed.data;

    // Check capacity
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { attendees: true },
    });

    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    if (event.attendees.length >= event.capacity) {
      return NextResponse.json({ message: "Event is full" }, { status: 400 });
    }

    const attendee = await prisma.attendee.create({
      data: { name, email, eventId },
    });

    return NextResponse.json(attendee, { status: 201 });
  } catch {
    return NextResponse.json(
      { message: "Failed to register attendee" },
      { status: 500 }
    );
  }
}
