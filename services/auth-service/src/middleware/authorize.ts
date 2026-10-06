import type { Request, Response, NextFunction } from "express";
import { error } from "node:console";

type UserRole = "CUSTOMER" | "ADMIN";

export function requireRole(requiredRole: UserRole) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user;

    if (!user) {
      return res.status(401).json({
        error: "INVALID_TOKEN",
        message: "Invalid access token",
      });
    }

    if (user.role !== requiredRole) {
        return res.status(403).json({
            error: "FORBIDDEN",
            message: "You do not have permission to perform this action"
        })
    } 

    next();
  };

}
