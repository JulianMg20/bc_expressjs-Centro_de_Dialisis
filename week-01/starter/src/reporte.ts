import { writeFile, mkdir } from "fs/promises";
import type { ResumenCatalogo, Paciente } from "./types.js";

export async function generarReporte(
  resumen: ResumenCatalogo,
  pacientesFiltrados: Paciente[],
  rutaSalida: string
): Promise<void> {
  await mkdir("output", { recursive: true }); // por si la carpeta no existe aún
  const reporte = {
    generadoEn: new Date().toISOString(),
    resumen,
    pacientesFiltrados,
  };
  await writeFile(rutaSalida, JSON.stringify(reporte, null, 2), "utf-8");
  console.log(`✅ Reporte generado en ${rutaSalida}`);
}