import express from "express";
import morgan from "morgan";
import { pacientesRouter } from "./routes/pacientes.routes.js";
import { errorHandler, notFound } from "./middlewares/notFound.js";
import { morganStream } from "./config/logger.js";

export const app = express();

app.use(express.json());
app.use(morgan("dev", { stream: morganStream }));

app.use("/api/v1/pacientes", pacientesRouter);

app.use(notFound);
app.use(errorHandler);
