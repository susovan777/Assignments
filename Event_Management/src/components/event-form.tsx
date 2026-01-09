"use client";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateEventInput, createEventSchema } from "@/lib/validations";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createEvent } from "@/app/api/create-event";

export default function EventForm() {
  const queryClient = useQueryClient();

  const form = useForm<CreateEventInput>({
    resolver: zodResolver(createEventSchema),
  });

  const mutation = useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      form.reset();

      toast.success("Event created successfully");
    },
    onError: () => {
      toast.error("Failed to create event");
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Event</CardTitle>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={form.handleSubmit((d) => mutation.mutate(d))}
          className="space-y-4">
          <Input placeholder="Event title" {...form.register("title")} />

          <Textarea
            placeholder="Event description"
            {...form.register("description")}
          />

          <Input type="datetime-local" {...form.register("date")} />

          <Input
            type="number"
            placeholder="Capacity"
            {...form.register("capacity", { valueAsNumber: true })}
          />

          <Button
            type="submit"
            disabled={mutation.isPending}
            className="w-full">
            {mutation.isPending ? "Creating..." : "Create Event"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
