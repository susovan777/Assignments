"use client";

import { useQuery } from "@tanstack/react-query";
import EventForm from "@/components/event-form";
import AttendeeForm from "@/components/attendee-form";
import { fetchEvents } from "@/lib/api/events";
import { fetchAttendees } from "@/lib/api/attendees";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  capacity: number;
};

export default function HomePage() {
  const {
    data: events,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["events"],
    queryFn: fetchEvents,
  });

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <EventForm />

      <Separator />

      {isLoading && <p className="text-muted-foreground">Loading events…</p>}

      {isError && <p className="text-destructive">Failed to load events.</p>}

      {!isLoading && events && events.length === 0 && (
        <p className="text-muted-foreground text-center">
          No events yet. Create your first event above.
        </p>
      )}

      <div className="space-y-4">
        {events?.map((event: Event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}

/* ---------------- Event Card ---------------- */

function EventCard({ event }: { event: Event }) {
  const { data: attendees, isLoading } = useQuery({
    queryKey: ["attendees", event.id],
    queryFn: () => fetchAttendees(event.id),
  });

  const attendeeCount = attendees?.length ?? 0;
  const isFull = attendeeCount >= event.capacity;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{event.title}</span>
          <Badge variant={isFull ? "destructive" : "secondary"}>
            {attendeeCount} / {event.capacity}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{event.description}</p>

        <p className="text-sm">
          📅 {new Date(event.date).toLocaleDateString()}
        </p>

        <Separator />

        {isLoading && (
          <p className="text-muted-foreground text-sm">Loading attendees…</p>
        )}

        {!isLoading && attendees && attendees.length === 0 && (
          <p className="text-muted-foreground text-sm">No attendees yet.</p>
        )}

        {!isLoading && attendees && attendees.length > 0 && (
          <ul className="text-sm space-y-1">
            {attendees.map((a) => (
              <li key={a.id}>
                {a.name} ({a.email})
              </li>
            ))}
          </ul>
        )}

        <AttendeeForm eventId={event.id} />
      </CardContent>
    </Card>
  );
}
