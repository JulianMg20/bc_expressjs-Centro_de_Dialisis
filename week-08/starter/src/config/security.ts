import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import type { Request, Response, NextFunction } from "express";

export const helmetMiddleware = helmet();

const origenesPermitidos = (process.env.CORS_ORIGIN || "").split(",").map(o => o.trim());

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    if (!origin || origenesPermitidos.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("No permitido por CORS"));
    }
  },
  credentials: true,
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: "Too Many Requests", message: "Demasiados intentos, intenta más tarde" },
  standardHeaders: true,
  legacyHeaders: false,
});

export const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

function limpiarObjeto(obj: any): any {
  if (obj === null || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(limpiarObjeto);

  const limpio: any = {};
  for (const clave of Object.keys(obj)) {
    if (clave.startsWith("$") || clave.includes(".")) continue;
    limpio[clave] = limpiarObjeto(obj[clave]);
  }
  return limpio;
}

export function sanitizeMiddleware(req: Request, res: Response, next: NextFunction) {
  if (req.body) req.body = limpiarObjeto(req.body);
  if (req.params) req.params = limpiarObjeto(req.params);
  next();
}