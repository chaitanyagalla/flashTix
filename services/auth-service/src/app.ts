import express from "express"
// import PinoHttp from "pino-http";
import {pinoHttp} from "pino-http"
import { authRouter } from "./routes/auth.routes.js";

export const app = express();

app.use(express.json());
app.use(pinoHttp());

app.get("/health", (_req, res) => {
    res.status(200).json({
        status: "ok",
        service: "auth-service",
    })
})

app.use("/auth", authRouter)
