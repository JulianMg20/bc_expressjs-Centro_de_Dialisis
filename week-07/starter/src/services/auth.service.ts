import bcrypt from "bcrypt";
import * as repo from "../repositories/users.repository.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt.js";
import { AppError } from "../errors/AppError.js";
import type { RegisterInput, LoginInput } from "../schemas/auth.schema.js";

const SALT_ROUNDS = 10;

export async function register(data: RegisterInput) {
  const existente = await repo.findByEmail(data.email);
  if (existente) throw new AppError(409, "Ya existe un usuario con ese email");

  const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);
  const usuario = await repo.create({ nombre: data.nombre, email: data.email, password: passwordHash });
  return { id: usuario._id, nombre: usuario.nombre, email: usuario.email, role: usuario.role };
}

export async function login(data: LoginInput) {
  const usuario = await repo.findByEmail(data.email);
  if (!usuario) throw new AppError(401, "Credenciales inválidas");

  const passwordValida = await bcrypt.compare(data.password, usuario.password);
  if (!passwordValida) throw new AppError(401, "Credenciales inválidas");

  const payload = { id: String(usuario._id), email: usuario.email, role: usuario.role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  const refreshHash = await bcrypt.hash(refreshToken, SALT_ROUNDS);
  await repo.updateRefreshTokenHash(String(usuario._id), refreshHash);

  return { accessToken, refreshToken, usuario: payload };
}

export async function refresh(refreshToken: string) {
  const payload = verifyRefreshToken(refreshToken);
  const usuario = await repo.findByEmail(payload.email);
  if (!usuario || !usuario.refreshTokenHash) throw new AppError(401, "Sesión inválida");

  const coincide = await bcrypt.compare(refreshToken, usuario.refreshTokenHash);
  if (!coincide) throw new AppError(401, "Sesión inválida");

  const nuevoPayload = { id: String(usuario._id), email: usuario.email, role: usuario.role };
  const nuevoAccessToken = signAccessToken(nuevoPayload);
  const nuevoRefreshToken = signRefreshToken(nuevoPayload);

  const nuevoHash = await bcrypt.hash(nuevoRefreshToken, SALT_ROUNDS);
  await repo.updateRefreshTokenHash(String(usuario._id), nuevoHash);

  return { accessToken: nuevoAccessToken, refreshToken: nuevoRefreshToken };
}

export async function logout(userId: string) {
  await repo.updateRefreshTokenHash(userId, null);
}

export async function getMe(userId: string) {
  const usuario = await repo.findById(userId);
  if (!usuario) throw new AppError(404, "Usuario no encontrado");
  return { id: usuario._id, nombre: usuario.nombre, email: usuario.email, role: usuario.role };
}