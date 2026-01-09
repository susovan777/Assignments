import { z } from "zod";

export const createEventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  date: z.iso.datetime("Invalid date format"),
  capacity: z.number().int().positive("Capacity must be a positive number"),
});

export const CreateAttendeeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email"),
  eventId: z.string().min(1, "Event is required"),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type CreateAttendeeInput = z.infer<typeof CreateAttendeeSchema>;
