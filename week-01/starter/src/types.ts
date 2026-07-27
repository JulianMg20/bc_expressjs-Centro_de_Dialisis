export interface Paciente {
  id: number;
  nombre: string;
  tipoTratamiento: "hemodialisis" | "dialisis_peritoneal" | "hemodiafiltracion";
  turno: "mañana" | "tarde" | "noche";
  costoSesion: number;
  diasPorSemana: number;
  activo: boolean;
}

export interface ResumenCatalogo {
  totalPacientes: number;
  activos: number;
  inactivos: number;
  costoPromedio: number;
  tratamientoMasCaro: Paciente;
  tratamientoMasBarato: Paciente;
}