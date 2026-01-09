export type Attendee = {
  id: string;
  name: string;
  email: string;
};

export async function fetchAttendees(eventId: string): Promise<Attendee[]> {
  const res = await fetch(`/api/events/${eventId}/attendees`);

  if (!res.ok) {
    throw new Error("Failed to fetch attendees");
  }

  return res.json();
}

export async function createAttendee(data: {
  name: string;
  email: string;
  eventId: string;
}) {
  const res = await fetch("/api/attendees", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw error;
  }

  return res.json();
}
