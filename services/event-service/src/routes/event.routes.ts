import { Router } from "express";
import { createEventSchema } from "../schemas/event.schema.js";
import { createEvent } from "../repositories/event.repository.js";

export const eventRouter = Router();

eventRouter.post("/", async (req, res) => {
  const parsed = createEventSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: "Invalid request body",
      message: parsed.error.flatten(),
    });
  }

  try {
    const event = await createEvent({
      ...parsed.data,
      description: parsed.data.description ?? null,
      createdByUser: "11111111-1111-1111-1111-111111111111",
    });

    return res.status(201).json({
      data: event,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Failed to create event",
    });
  }
});
