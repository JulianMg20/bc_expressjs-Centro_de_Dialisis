// src/middlewares/errorHandler.ts
import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AppError } from "../errors/AppError.js";
import { logger } from "../config/logger.js";

export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: "Validation Error",
      issues: err.issues.map(i => ({ path: i.path.join("."), message: i.message })),
    });
  }
  if (err instanceof AppError) {
    logger.warn(`${err.statusCode} - ${err.message}`);
    return res.status(err.statusCode).json({ error: "Error", message: err.message });
  }
  logger.error(err instanceof Error ? err.stack : String(err));
  res.status(500).json({ error: "Internal Server Error", message: "Error interno del servidor" });
}