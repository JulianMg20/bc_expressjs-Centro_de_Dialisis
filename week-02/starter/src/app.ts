import express, { type Request, type Response, type NextFunction } from "express";
import { pacientesRouter } from "./routes/pacientes.routes.js";

export const app = express();

// 1. Parseo de body
app.use(express.json());

// 2. Logger personalizado
app.use((req: Request, res: Response, next: NextFunction) => {
  const inicio = Date.now();
  res.on("finish", () => {
    const duracion = Date.now() - inicio;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duracion}ms`);
  });
  next();
});

// 3. Rutas
app.use("/api/v1/pacientes", pacientesRouter);

// 4. Handler 404
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// 5. Error handler global (SIEMPRE 4 parámetros, SIEMPRE al final)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Error interno del servidor" });
});