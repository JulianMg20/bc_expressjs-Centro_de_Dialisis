import { app } from "./app.js";

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`🩺 Servidor del Centro de Diálisis corriendo en http://localhost:${PORT}`);
});

function apagarServidor(señal: string) {
  console.log(`\n${señal} recibido. Cerrando servidor...`);
  server.close(() => {
    console.log("Servidor cerrado correctamente.");
    process.exit(0);
  });
}

process.on("SIGTERM", () => apagarServidor("SIGTERM"));
process.on("SIGINT", () => apagarServidor("SIGINT"));