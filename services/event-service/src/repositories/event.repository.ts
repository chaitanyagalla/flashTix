import { number } from "zod";
import { pool } from "../db/pool.js";

type Event = {
  id: string;
  title: string;
  description: string | null;
  venueId: string;
  startsAt: string;
  bookingOpensAt: string;
  bookingClosesAt: string;
  createdByUser: string;
};

type CreateEventType = {
  title: string;
  description?: string | null;
  venueId: string;
  startsAt: string;
  bookingOpensAt: string;
  bookingClosesAt: string;
  createdByUser: string;
};

export async function createEvent(input: CreateEventType): Promise<Event> {
  const event = await pool.query(
    `
        INSERT INTO EVENTS (
            id,
            title,
            description,
            venue_id,
            starts_at,
            booking_opens_at,
            booking_closes_at,
            created_by_user
            )
        VALUES (
            gen_random_uuid(),
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            $7
            )
        RETURNING 
            id,
            title,
            description,
            venue_id AS "venueId",
            starts_at AS "startsAt",
            booking_opens_at AS "bookingOpensAt",
            booking_closes_at AS "bookingClosesAt" ,
            created_by_user AS "createdByUser"
        `,
    [
      input.title,
      input.description ?? null,
      input.venueId,
      input.startsAt,
      input.bookingOpensAt,
      input.bookingClosesAt,
      input.createdByUser,
    ],
  );

  return event.rows[0]!;
}

export async function listEvents(
  limit: number,
  offset: number,
): Promise<Event[]> {
  const events = await pool.query<Event>(
    `
        SELECT 
        id,
        title,
        description,
        venue_id AS "venueId",
        starts_at AS "startsAt",
        booking_opens_at AS "bookingOpensAt",
        booking_closes_at AS "bookingClosesAt" ,
        created_by_user AS "createdByUser"
        FROM events
        ORDER BY starts_at ASC, id ASC
        LIMIT $1
        OFFSET $2        
        `,
        [limit, offset]
  );

  return events.rows
}

export async function getEvent(id: string): Promise<Event | null>{
    const event = await pool.query<Event>(
        `
        SELECT
        id,
        title,
        description,
        venue_id AS "venueId",
        starts_at AS "startsAt",
        booking_opens_at AS "bookingOpensAt",
        booking_closes_at AS "bookingClosesAt" ,
        created_by_user AS "createdByUser"
        FROM events
        WHERE id = $1 
        `, 
        [id]
    )
    
    return event.rows[0] ?? null;
}

export async function countEvents(): Promise<number> {
    const result = await pool.query<{total: string}>(`
            SELECT COUNT(*) AS total
            FROM events
        `)

    return Number(result.rows[0]?.total ?? 0);
} 

type EventCursor = {
    starts_at: string,
    id: string
}

export async function listEventsByCursor(limit: number, cursor: EventCursor ): Promise<Event[]> {
    const result = await pool.query<Event>(
        `SELECT 
            id,
            title,
            description,
            venue_id AS "venueId",
            starts_at AS "startsAt",
            booking_opens_at AS "bookingOpensAt",
            booking_closes_at AS "bookingClosesAt",
            created_by_user AS "createdByUser"
        FROM events
        WHERE 
            (starts_at, id) >
            ($1::timestamptz, $2::uuid)
        ORDER BY starts_at ASC, id ASC
        LIMIT $3 
        `,
        [cursor.starts_at, cursor.id, limit + 1]
    )
    return result.rows;
}