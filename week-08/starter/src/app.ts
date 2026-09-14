import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { authRouter } from "./routes/auth.routes.js";
import { pacientesRouter } from "./routes/pacientes.routes.js";
import { notFound } from "./middlewares/notFound.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { morganStream } from "./config/logger.js";
import {
  helmetMiddleware,
  corsMiddleware,
  authRateLimiter,
  generalRateLimiter,
  sanitizeMiddleware,
} from "./config/security.js";

export const app = express();

app.use(helmetMiddleware);
app.use(corsMiddleware);
app.use(express.json());
app.use(cookieParser());
app.use(sanitizeMiddleware);
app.use(morgan("dev", { stream: morganStream }));

app.use("/api/v1/auth", authRateLimiter, authRouter);
app.use("/api/v1/pacientes", generalRateLimiter, pacientesRouter);

app.use(notFound);
app.use(errorHandler);