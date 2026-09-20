import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt.js";
import { AppError } from "../errors/AppError.js";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.accessToken;
    if (!token) throw new AppError(401, "No autenticado");
    req.user = verifyAccessToken(token);
    next();
  } catch (err) {
    next(new AppError(401, "Token inválido o expirado"));
  }
}