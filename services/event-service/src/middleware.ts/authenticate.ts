import type { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { env } from "../config/env.js";

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
    const decoded = jwt.verify(token, env.JWT_SECRET, 
    ) as AccessTokenPayload;

    if (
      !decoded||
      typeof decoded === "string" ||
      typeof decoded.sub !== "string" ||
      (decoded.role !== "ADMIN" && decoded.role !== "CUSTOMER")
    ) {
      return res.status(401).json({
        error: "INVALID_TOKEN",
        message: "Invalid access token",
      });
    }

    res.locals.user = {
      id: decoded.sub,
      role: decoded.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      error: "UNAUTHENTICATED",
      message: "Authentication required",
    });
  }
}
