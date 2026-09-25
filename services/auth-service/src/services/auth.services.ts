import type { RegisterType } from "../schemas/auth.schema.js";
import { hashPassword } from "./password.services.js";
import { prisma } from "../db/prisma.js";



export async function registerUser(input: RegisterType) {
    const passwordHash = await hashPassword(input.password);

    const user = await prisma.user.create({
        data: {
            name: input.name,
            email: input.email,
            passwordHash
        },
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true
        }

    })

    return user

}