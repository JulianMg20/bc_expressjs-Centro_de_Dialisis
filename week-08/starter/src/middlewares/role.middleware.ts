import type { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError.js";

export function requireRole(...rolesPermitidos: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return next(new AppError(401, "No autenticado"));
    if (!rolesPermitidos.includes(req.user.role)) {
      return next(new AppError(403, "No tienes permisos para esta acción"));
    }
    next();
  };
}