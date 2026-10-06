import { Router } from "express";
import { loginSchema, registerSchema } from "../schemas/auth.schema.js";
import { loginUser, registerUser } from "../services/auth.services.js";
import { Prisma } from "../generated/prisma/client.js";
import { authenticate } from "../middleware/authenticate.js";
import { requireRole } from "../middleware/authorize.js";

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

authRouter.post("/login", async(req, res, next) => {
    try {
        const result = loginSchema.safeParse(req.body)
        if (!result.success) {
            return res.status(400).json({
                error: "INVALIDATION_ERROR",
                message: "Invalid login data",
                details: result.error.flatten()
            })
        }

        const loginResult = await loginUser(req.body);

        if (!loginResult) {
            return res.status(401).json({
                error: "INVALID_CRENDENTIALS",
                message: "Invalid email or password"
            })
        }

        return res.status(200).json({
            data: loginResult
        })

    } catch (error) {
        next(error)
    }
})

authRouter.get("/me",authenticate, (req, res) => {
    return res.status(200).json({
        data: res.locals.user 
    })
})

authRouter.get("/admin-test", authenticate, requireRole("ADMIN"), (req, res) => {
    return res.status(200).json({
        message: "Welcome Admin"
    })
})