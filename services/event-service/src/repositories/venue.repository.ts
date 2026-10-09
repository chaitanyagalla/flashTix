import { pool } from "../db/pool.js";

type Venue = {
  id: string;
  name: string;
  address: string;
  city: string;
  capcity: string;
};

type CreateVenueType = {
  name: string;
  address: string;
  city: string;
  capacity: number;
};

export async function createVenue(input: CreateVenueType): Promise<Venue> {
  const result = await pool.query<Venue>(
    `INSERT INTO venues(
        id,
        name,
        address,
        city,
        capacity
        )
    VALUES (
        gen_random_uuid(),
        $1,
        $2,
        $3,
        $4
    )
    RETURNING 
        id,
        name,
        city,
        address,
        capacity
        `,
    [
        input.name,
        input.address,
        input.city,
        input.capacity

    ]
  );

  return result.rows[0]!;
}
