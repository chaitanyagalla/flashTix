import type { Request, Response, NextFunction } from "express";

type UserRole = "CUSTOMER" | "ADMIN";
type AuthenticatedUser = {
  id: string;
  role: UserRole;
};

export function requrieRole(requiredRole: UserRole) {
  return (_req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user as AuthenticatedUser | undefined;

    if (!user) {
      return res.status(401).json({
        error: "UNAUTHENTICATED",
        message: "Authentication required",
      });
    }

    if (user.role !== requiredRole) {
      return res.status(403).json({
        error: "FORBIDDEN",
        message: "You do not have permission to perform this action",
      });
    }
    next();
  };
}
