import { Router } from "express";
import { registerSchema } from "../schemas/auth.schema.js";
import { registerUser } from "../services/auth.services.js";
import { Prisma } from "../generated/prisma/client.js";

export const authRouter = Router();

authRouter.post("/register", async (req, res, next) => {
  try {
    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        error: "VALIDATION_ERROR",
        message: "Invalid Registration data",
        details: result.error.flatten(),
      });
    }

    const user = await registerUser(result.data);

    return res.status(201).json({
        data: user
    })
  } catch (error) {
    if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
    ) {
        return res.status(409).json({
            error: "EMAIL_ALREADY_EXISTS",
            message: "A user with this email already exists"            
        })
    }
    next(error);
  }
});
