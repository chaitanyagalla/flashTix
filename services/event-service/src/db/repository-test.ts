import { createEvent } from "../repositories/event.repository.js";
import { createVenue } from "../repositories/venue.repository.js";
import { pool } from "./pool.js";

// async function venueTest() {
//   try {
//     const venue = await createVenue({
//       name: "Gachibowli Indoor Stadium",
//       city: "Hyderabad",
//       address: "Gachibowli, Hyderabad",
//       capacity: 5000,
//     });

//     console.log("VEnUE");
//     console.log(venue);
//   } catch (error) {
//     console.log(error);
//   }
//   } finally {
//     await pool.end();
//   }
// }

async function eventTest() {
  try {
    const event = await createEvent({
      title: "Tech Conference Hyderabad",
      description: "FlashTix test event",
      venueId: "99999999-9999-9999-9999-999999999999",

      startsAt: "2026-12-20T19:00:00+05:30",
      bookingOpensAt: "2026-11-01T10:00:00+05:30",
      bookingClosesAt: "2026-12-20T18:00:00+05:30",

      createdByUser: "11111111-1111-1111-1111-111111111111",
    });

    console.log("EVENT");
    console.log(event);

  } catch (error) {
    console.log(error)
  } finally {
    await pool.end();
  }
}

// venueTest();

eventTest();
