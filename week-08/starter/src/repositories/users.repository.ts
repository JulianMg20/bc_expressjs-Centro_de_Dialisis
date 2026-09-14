import { User } from "../models/user.model.js";

export async function findByEmail(email: string) {
  return User.findOne({ email }).select("+password +refreshTokenHash");
}

export async function findById(id: string) {
  return User.findById(id);
}

export async function create(data: { nombre: string; email: string; password: string }) {
  return User.create(data);
}

export async function updateRefreshTokenHash(id: string, hash: string | null) {
  return User.findByIdAndUpdate(id, { refreshTokenHash: hash });
}