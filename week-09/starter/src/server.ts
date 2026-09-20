import "./env.js";

const { app } = await import("./app.js");
const { logger } = await import("./config/logger.js");

const PORT = process.env.PORT || 3000;

async function main() {
  const mongoose = await import("mongoose");
  await mongoose.default.connect(process.env.MONGO_URI!);
  logger.info(`🍃 Conectado a MongoDB`);

  const server = app.listen(PORT, () => {
    logger.info(`🩺 Servidor del Centro de Diálisis corriendo en http://localhost:${PORT}`);
  });

  function apagarServidor(señal: string) {
    logger.info(`${señal} recibido. Cerrando servidor...`);
    server.close(() => process.exit(0));
  }
  process.on("SIGTERM", () => apagarServidor("SIGTERM"));
  process.on("SIGINT", () => apagarServidor("SIGINT"));
}

main().catch((err) => {
  console.error("Error al iniciar el servidor: " + err);
  process.exit(1);
});