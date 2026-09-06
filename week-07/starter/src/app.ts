// src/app.ts
import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { authRouter } from "./routes/auth.routes.js";
import { pacientesRouter } from "./routes/pacientes.routes.js";
import { notFound } from "./middlewares/notFound.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { morganStream } from "./config/logger.js";

export const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev", { stream: morganStream }));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/pacientes", pacientesRouter);

app.use(notFound);
app.use(errorHandler);