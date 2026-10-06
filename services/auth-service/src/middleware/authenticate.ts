import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../services/token.service.js";
import type { JwtPayload } from "jsonwebtoken";

type UserRole = "CUSTOMER" | "ADMIN";

type AccessTokenPayload = JwtPayload & {
  sub: string;
  role: UserRole;
};

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader?.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "UNAUTHENTICATED",
      message: "Authentication required",
    });
  }

  const token = authorizationHeader.slice("Bearer ".length);

  try {
    const decoded = verifyToken(token) as AccessTokenPayload;
    if (
      typeof decoded === "string" ||
      !decoded.sub ||
      (decoded.role !== "CUSTOMER" && decoded.role !== "ADMIN")
    ) {
      return res.status(401).json({
        error: "INVALID_TOKEN",
        message: "Invalid access token",
      });
    }

    const payload = decoded;

    res.locals.user = {
      id: payload.sub,
      role: payload.role,
    };

    next();
  } catch {
    return res.status(401).json({
      error: "INVALID_TOKEN",
      message: "Invalid access token",
    });
  }
}
