import express, { type Request, type Response, type NextFunction } from "express";
import { pacientesRouter } from "./routes/pacientes.routes.js";

export const app = express();

app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  const inicio = Date.now();
  res.on("finish", () => {
    const duracion = Date.now() - inicio;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duracion}ms`);
  });
  next();
});

app.use("/api/v1/pacientes", pacientesRouter);

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Not Found", message: "Ruta no encontrada" });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error", message: "Error interno del servidor" });
});