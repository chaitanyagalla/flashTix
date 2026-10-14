import { Router } from "express";
import { createEventSchema } from "../schemas/event.schema.js";
import {
  countEvents,
  createEvent,
  getEvent,
  listEvents,
  listEventsByCursor,
} from "../repositories/event.repository.js";
import { authenticate } from "../middleware/authenticate.js";
import { requrieRole } from "../middleware/authorization.js";
import { error } from "node:console";
import { decodeCursor, encodeCursor } from "../lib/utils/event-cursor.js";
import z from "zod";

export const eventRouter = Router();

eventRouter.post(
  "/",
  authenticate,
  requrieRole("ADMIN"),
  async (req, res, next) => {
    const parsed = createEventSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: "VALIDATION_ERROR",
        message: "Invalid request body",
        details: parsed.error.flatten(),
      });
    }

    try {
      const event = await createEvent({
        ...parsed.data,
        description: parsed.data.description ?? null,
        createdByUser: res.locals.user.id,
      });

      return res.status(201).json({
        data: event,
      });
    } catch (error) {
      next(error);
    }
  },
);

eventRouter.get("/", async (req, res, next) => {
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 10);

  if (
    !Number.isSafeInteger(page) ||
    page < 1 ||
    page > 100000 ||
    !Number.isSafeInteger(limit) ||
    limit < 1 ||
    limit > 50
  ) {
    return res.status(400).json({
      error: "INVALID_PAGINATION",
      message: "Invalid page or limit",
    });
  }
  const offset = (page - 1) * limit;

  if (req.query.cursor !== undefined) {
    if (req.query.page !== undefined || typeof req.query.cursor !== "string") {
      return res.status(400).json({
        error: "INVALID_PAGINATION",
        message: "Use either page or cursor",
      });
    }
    
    const cursor = decodeCursor(req.query.cursor);
    

    if (!cursor) {
      return res.status(400).json({
        error: "INVALID_PAGINATION",
        message: "Invalid pagination cursor",
      });
    }

    try {
      const rows = await listEventsByCursor(limit, cursor);
      const hasNextPage = rows.length > limit;
      const events = rows.slice(0, limit);
      const lastEvent = events.at(-1);

      const nextCursor =
        hasNextPage && lastEvent
          ? encodeCursor({
              starts_at: new Date(lastEvent.startsAt).toISOString(),
              id: lastEvent.id,
            })
          : null;

      return res.status(200).json({
        data: events,
        pagination: {
            hasNextPage,
            limit,
            nextCursor
        },
      });
    } catch (error) {
        return next(error);
    }
  }

  try {
    // const events = await listEvents(limit, offset);
    const [events, total] = await Promise.all([
      listEvents(limit, offset),
      countEvents(),
    ]);

    const hasNextPage = page * limit < total; 

    const totalPages = Math.ceil(total / limit);

    const lastEvent = events.at(-1);

    const nextCursor = 
        hasNextPage && lastEvent 
        ? encodeCursor({
            starts_at: new Date(lastEvent.startsAt).toISOString(),
            id: lastEvent.id
        }): null


    return res.status(200).json({
      data: events,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage,
        nextCursor
      },
    });
  } catch (error) {
    next(error);
  }
});

eventRouter.get("/:id", async (req, res, next) => {
  const id = req.params.id;
  if (!id || typeof id !== "string") {
    return res.status(400).json({
      error: "INVALID_ID",
      message: "Invalid event id",
    });
  }
  const parsed = z.uuid().safeParse(id)
  if (!parsed.success) {
    return res.status(400).json({
        error: "INVALID_EVENT_ID",
        message: "Event Id must be a valid UUID"
    })
  }
  try {
    const event = await getEvent(parsed.data);

    if (!event) {
      return res.status(404).json({
        error: "EVENT_NOT_FOUND",
        message: "Event not found",
      });
    }
    return res.status(200).json({
      data: event,
    });
  } catch (error) {
    next(error);
  }
});
