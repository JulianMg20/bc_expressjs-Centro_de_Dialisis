import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt.js";
import { AppError } from "../errors/AppError.js";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.accessToken;
    if (!token) throw new AppError(401, "No autenticado");

    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (err) {
    if (err instanceof AppError) return next(err);
    next(new AppError(401, "Token inválido o expirado"));
  }
}