import { leerPacientes } from "./lector.js";
import { calcularResumen } from "./resumen.js";
import { obtenerFiltroTratamiento } from "./argumentos.js";
import { generarReporte } from "./reporte.js";

async function main() {
  const pacientes = await leerPacientes("data/pacientes.json");

  const tratamientoFiltro = obtenerFiltroTratamiento();
  let pacientesFiltrados = pacientes;

  if (tratamientoFiltro) {
    const disponibles = [...new Set(pacientes.map(p => p.tipoTratamiento))];
    if (!disponibles.includes(tratamientoFiltro as any)) {
      console.warn(`⚠️  Tratamiento "${tratamientoFiltro}" no existe.`);
      console.warn(`   Disponibles: ${disponibles.join(", ")}`);
    } else {
      pacientesFiltrados = pacientes.filter(p => p.tipoTratamiento === tratamientoFiltro);
    }
  }

  const resumen = calcularResumen(pacientesFiltrados);

  console.log("📊 Resumen del centro de diálisis");
  console.log(`Total pacientes: ${resumen.totalPacientes}`);
  console.log(`Activos: ${resumen.activos} | Inactivos: ${resumen.inactivos}`);
  console.log(`Costo promedio por sesión: $${resumen.costoPromedio}`);
  console.log(`Tratamiento más caro: ${resumen.tratamientoMasCaro.nombre} ($${resumen.tratamientoMasCaro.costoSesion})`);
  console.log(`Tratamiento más barato: ${resumen.tratamientoMasBarato.nombre} ($${resumen.tratamientoMasBarato.costoSesion})`);

  await generarReporte(resumen, pacientesFiltrados, "output/report.json");
}

main().catch(error => {
  console.error("❌ Error inesperado:", error);
  process.exit(1);
});