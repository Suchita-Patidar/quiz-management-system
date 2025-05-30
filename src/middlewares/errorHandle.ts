// middleware/errorHandler.ts
import { Request, Response, NextFunction } from "express";
import { HttpError } from "../utils/HttpError";

export const errorHandler = (
  err: HttpError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = err.status || 500;
  const message = err.message || "Internal Server Error";

  console.error(
    `[${new Date().toISOString()}] ${req.method} ${req.url} - ${message}`
  );

  res.status(statusCode).json({
    status: "error",
    statusCode,
    message,
  });
};
