import type { Request, Response, NextFunction } from "express";
type pgErrorType = {
  code: string;
  constraint?: string;
};

function isPgError(error: unknown): error is pgErrorType {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
  );
}

export function errorhandler(
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  if (res.headersSent) {
    return next(error);
  }
  if (isPgError(error)) {
    if (error.code === "23503" && error.constraint === "fk_events_venue") {
      return res.status(422).json({
        error: "INVALID_VENUE",
        message: "Venue does not exists",
      });
    }

    if (
      (error.code === "23514" && error.constraint === "chk_booking_window") ||
      error.constraint === "chk_booking_before_event"
    ) {
      return res.status(422).json({
        error: "INVALID_BOOKING_WINDOW",
        message: "Invalid event booking dates",
      });
    }
  }

  console.error("Unhandled Event service error:", error);
  return res.status(500).json({
    error: "INTERNAL_SERVER_ERROR",
    message: "An unexpected error occurred",
  });
} 
