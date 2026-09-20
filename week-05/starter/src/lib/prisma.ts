import { PrismaClient } from "@prisma/client";
import { loadEnvFile } from "node:process";

loadEnvFile();

export const prisma = new PrismaClient();
