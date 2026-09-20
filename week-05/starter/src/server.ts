// src/server.ts
import { app } from "./app.js";
import { logger } from "./config/logger.js";

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  logger.info(`🩺 Servidor del Centro de Diálisis corriendo en http://localhost:${PORT}`);
});

function apagarServidor(señal: string) {
  logger.info(`${señal} recibido. Cerrando servidor...`);
  server.close(() => {
    logger.info("Servidor cerrado correctamente.");
    process.exit(0);
  });
}

process.on("SIGTERM", () => apagarServidor("SIGTERM"));
process.on("SIGINT", () => apagarServidor("SIGINT"));