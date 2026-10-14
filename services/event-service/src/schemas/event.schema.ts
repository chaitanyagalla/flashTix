import z from "zod";


export const createEventSchema = z.object({
    title: z.string().min(1).max(150),
    description: z.string().optional(),
    venueId: z.uuid(),
    startsAt: z.string(),
    bookingOpensAt: z.string(),
    bookingClosesAt: z.string()
})

// export type CreateEventType = z.infer<typeof createEventSchema>