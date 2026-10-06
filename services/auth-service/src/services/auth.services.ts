import type { LoginType, RegisterType } from "../schemas/auth.schema.js";
import { comparePassword, hashPassword } from "./password.services.js";
import { prisma } from "../db/prisma.js";
import { createToken } from "./token.service.js";

export async function registerUser(input: RegisterType) {
  const passwordHash = await hashPassword(input.password);

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash,
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });

  return user;
}

export async function loginUser(input: LoginType) {
  const user = await prisma.user.findUnique({
    where: {
      email: input.email,
    },
  });

  if (!user) {
    return null;
  }

  const isPasswordMatched = await comparePassword(
    input.password,
    user.passwordHash,
  );

  if (!isPasswordMatched) {
    return null;
  }

  const accessToken = createToken({
    id: user.id,
    role: user.role,
  });

  return {
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    accessToken
  };
}
