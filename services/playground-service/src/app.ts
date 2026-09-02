import express from "express";

import { validate } from "./middleware/validation";
import { eventSchema } from "./schemas/event.schema";
import { errorHandler } from "./middleware/error-handler";

export const app = express();
const PORT = Number(process.env.PORT);

app.use(express.json());
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    PORT,
  });
});

// const name: string = 555;
// console.log(name);
// const unusedMessage = "FlashTix";
// const price = 5000;

app.post("/events", validate(eventSchema), (req, res) => {
  const event = req.body;

  const ticketPrice = event.ticketPrice.toFixed(2);

  res.status(201).json({
    name: event.name,
    ticketPrice,
  });
});

app.use(errorHandler);
