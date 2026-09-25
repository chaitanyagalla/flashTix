import bcrypt from "bcrypt"

const SALT_ROUNDS = 12;

export async function hashPassword(pasword: string) {
    return bcrypt.hash(pasword, SALT_ROUNDS)
}