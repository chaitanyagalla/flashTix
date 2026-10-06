import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../schemas/env.schema.js";

type UserRole = "CUSTOMER" | "ADMIN";

type TokenUser = {
    id: string,
    role: UserRole
}


export  function createToken(user: TokenUser) {
    const options : SignOptions = {
        subject: user.id,
        expiresIn: env.JWT_EXPIRES_IN as NonNullable<SignOptions["expiresIn"]>
    }

    return jwt.sign( 
        {
            role: user.role
        },
        env.JWT_SECRET,
        options
    )
}

export function verifyToken(token: string) {
    return jwt.verify(token, env.JWT_SECRET)
}