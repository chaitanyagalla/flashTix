import { pool } from "../db/pool.js"

type Event = {
    id: string,
    title: string,
    description: string | null,
    venueId: string,
    startsAt: string,
    bookingOpensAt: string,
    bookingClosesAt: string,
    createdByUser: string,
}

type CreateEventType = {
    title: string,
    description?: string | null,
    venueId: string,
    startsAt: string,
    bookingOpensAt: string,
    bookingClosesAt: string,
    createdByUser: string,
}



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
            input.createdByUser
        ]
    )

    return event.rows[0]!;
}