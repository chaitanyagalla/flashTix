import "dotenv/config"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../generated/prisma/client.js"
import { env } from "../schemas/env.schema.js";

const connectionString = env.DATABASE_URL;

if (!connectionString) {
    throw new Error("DATABASE_URL is missing");
}

const adapter = new PrismaPg({
    connectionString,
})

export const prisma = new PrismaClient({
    adapter,
})