import mongoose from "mongoose";
import { TipoTratamiento } from "./models/tipoTratamiento.model.js";
import { Paciente } from "./models/paciente.model.js";
import { logger } from "./config/logger.js";

async function seed() {
  const uri = process.env.MONGO_URI || "mongodb://localhost:27017/centro_dialisis";
  await mongoose.connect(uri);

  await Paciente.deleteMany({});
  await TipoTratamiento.deleteMany({});

  const [hemodialisis, peritoneal, hemodiafiltracion] = await TipoTratamiento.insertMany([
    { nombre: "Hemodiálisis", descripcion: "Filtrado de sangre mediante máquina" },
    { nombre: "Diálisis Peritoneal", descripcion: "Filtrado a través del peritoneo" },
    { nombre: "Hemodiafiltración", descripcion: "Combinación de hemodiálisis y filtración" },
  ]);

  await Paciente.insertMany([
    { nombre: "Carlos Ramírez", turno: "mañana", costoSesion: 185000, diasPorSemana: 3, activo: true, tipoTratamiento: hemodialisis._id },
    { nombre: "Ana Torres", turno: "tarde", costoSesion: 210000, diasPorSemana: 7, activo: true, tipoTratamiento: peritoneal._id },
    { nombre: "Luis Fernández", turno: "noche", costoSesion: 240000, diasPorSemana: 3, activo: false, tipoTratamiento: hemodiafiltracion._id },
    { nombre: "María Gómez", turno: "tarde", costoSesion: 175000, diasPorSemana: 3, activo: true, tipoTratamiento: hemodialisis._id },
    { nombre: "Jorge Salazar", turno: "mañana", costoSesion: 190000, diasPorSemana: 3, activo: true, tipoTratamiento: hemodialisis._id },
  ]);

  logger.info("✅ Seed completado");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("❌ Error en el seed:", err);
  process.exit(1);
});