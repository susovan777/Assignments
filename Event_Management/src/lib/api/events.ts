export type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  capacity: number;
};

export async function fetchEvents(): Promise<Event[]> {
  const res = await fetch("/api/events");

  if (!res.ok) {
    throw new Error("Failed to fetch events");
  }

  return res.json();
}
