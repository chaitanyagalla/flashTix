import { z } from "zod";

export const eventSchema = z.object({
  name: z.string().min(1),
  ticketPrice: z.number().positive(),
});
