import { Schema, model, type Document } from "mongoose";

export interface IUser extends Document {
  nombre: string;
  email: string;
  password: string;
  role: "admin" | "recepcionista";
  refreshTokenHash?: string;
}

const userSchema = new Schema<IUser>(
  {
    nombre: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["admin", "recepcionista"], default: "recepcionista" },
    refreshTokenHash: { type: String, select: false },
  },
  { timestamps: true }
);

export const User = model<IUser>("User", userSchema);