export interface Paciente {
  id: number;
  nombre: string;
  tipoTratamiento: "hemodialisis" | "dialisis_peritoneal" | "hemodiafiltracion";
  turno: "mañana" | "tarde" | "noche";
  costoSesion: number;
  diasPorSemana: number;
  activo: boolean;
}

export type CreatePacienteDto = Omit<Paciente, "id">;
export type UpdatePacienteDto = Omit<Paciente, "id">;