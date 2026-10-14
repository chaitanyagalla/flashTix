import express from "express"
import { eventRouter } from "./routes/event.routes.js";
import { pinoHttp } from "pino-http";
import { errorhandler } from "./middleware.ts/error-handler.js";

export const app = express();

app.use(express.json());
app.use(pinoHttp())

app.get("/health", (_req, res) => {
  res.status(200).json({
    service: "event-service",
    status: "ok",
  });
});

app.use("/events", eventRouter);
app.use(errorhandler)

