import type { Paciente, ResumenCatalogo } from "./types.js";

export function calcularResumen(pacientes: Paciente[]): ResumenCatalogo {
  const activos = pacientes.filter(p => p.activo).length;
  const costoPromedio =
    pacientes.reduce((suma, p) => suma + p.costoSesion, 0) / pacientes.length;

  const tratamientoMasCaro = pacientes.reduce((max, p) =>
    p.costoSesion > max.costoSesion ? p : max
  );
  const tratamientoMasBarato = pacientes.reduce((min, p) =>
    p.costoSesion < min.costoSesion ? p : min
  );

  return {
    totalPacientes: pacientes.length,
    activos,
    inactivos: pacientes.length - activos,
    costoPromedio: Math.round(costoPromedio),
    tratamientoMasCaro,
    tratamientoMasBarato,
  };
}