import { readFile } from "fs/promises";
import type { Paciente } from "./types.js";

export async function leerPacientes(rutaArchivo: string): Promise<Paciente[]> {
  try {
    const contenido = await readFile(rutaArchivo, "utf-8");
    return JSON.parse(contenido) as Paciente[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      console.error(`❌ Error: no se encontró el archivo en "${rutaArchivo}".`);
      console.error("   Verifica que data/pacientes.json exista.");
      process.exit(1);
    }
    throw error; // otros errores (JSON mal formado, etc.) sí se propagan
  }
}