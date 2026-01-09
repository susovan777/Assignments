"use client";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAttendee } from "@/lib/api/attendees";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CreateAttendeeInput, CreateAttendeeSchema } from "@/lib/validations";

export default function AttendeeForm({ eventId }: { eventId: string }) {
  const queryClient = useQueryClient();

  const form = useForm<CreateAttendeeInput>({
    resolver: zodResolver(CreateAttendeeSchema),
    defaultValues: { eventId },
  });

  const mutation = useMutation({
    mutationFn: createAttendee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendees", eventId] });
      form.reset({ eventId });

      toast.success("Attendee registered");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Event is full or failed");
    },
  });

  return (
    <form
      onSubmit={form.handleSubmit((d) => mutation.mutate(d))}
      className="flex gap-2 pt-2">
      <Input placeholder="Name" {...form.register("name")} />

      <Input placeholder="Email" {...form.register("email")} />

      <Button type="submit" disabled={mutation.isPending}>
        Add
      </Button>
    </form>
  );
}
