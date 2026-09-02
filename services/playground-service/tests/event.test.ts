import request from "supertest";
import { describe, it, expect } from "vitest";
import { app } from "../src/app";

// describe("POST /events", async () => {
//   const response = await request(app).post("/events").send({
//     name: "",
//     ticketPrice: -500,
//   });

//   expect(response.status).toBe(400);
//   expect(response.body.error.code).toBe("VALIDATION_ERROR");
// });

describe("POST /events", () => {
  it("rejects invalid input", async () => {
    const response = await request(app).post("/events").send({
      name: "",
      ticketPrice: -500,
    });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("creates an event with valid inputs", async () => {
    const response = await request(app).post("/events").send({
      name: "wee",
      ticketPrice: 5000
    });
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
        name: "wee",
      ticketPrice: "5000.00"
    })
  });
});
