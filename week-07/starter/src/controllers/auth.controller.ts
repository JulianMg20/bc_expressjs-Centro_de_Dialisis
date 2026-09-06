import type { Request, Response, NextFunction } from "express";
import * as authService from "../services/auth.service.js";
import { registerSchema, loginSchema } from "../schemas/auth.schema.js";
import { AppError } from "../errors/AppError.js";

const cookieOptions = {
  httpOnly: true,
  sameSite: "strict" as const,
  secure: process.env.NODE_ENV === "production",
};

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const data = registerSchema.parse(req.body);
    const usuario = await authService.register(data);
    res.status(201).json({ data: usuario });
  } catch (err) { next(err); }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const data = loginSchema.parse(req.body);
    const { accessToken, refreshToken, usuario } = await authService.login(data);

    res.cookie("accessToken", accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
    res.cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });

    res.status(200).json({ data: usuario });
  } catch (err) { next(err); }
}

export async function me(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError(401, "No autenticado");
    const usuario = await authService.getMe(req.user.id);
    res.status(200).json({ data: usuario });
  } catch (err) { next(err); }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) throw new AppError(401, "No hay refresh token");

    const { accessToken, refreshToken } = await authService.refresh(token);

    res.cookie("accessToken", accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
    res.cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });

    res.status(200).json({ data: { message: "Token renovado" } });
  } catch (err) { next(err); }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    if (req.user) await authService.logout(req.user.id);
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).json({ data: { message: "Sesión cerrada" } });
  } catch (err) { next(err); }
}