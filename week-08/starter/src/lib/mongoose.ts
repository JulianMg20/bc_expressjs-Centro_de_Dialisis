import mongoose from "mongoose";
import { logger } from "../config/logger.js";

export async function connectDB(): Promise<void> {
  const uri = process.env.MONGO_URI || "mongodb://localhost:27017/centro_dialisis_w8";
  await mongoose.connect(uri);
  logger.info(`🍃 Conectado a MongoDB: ${uri}`);
}