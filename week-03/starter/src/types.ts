export interface Paciente {
  id: number;
  nombre: string;
  tipoTratamiento: "hemodialisis" | "dialisis_peritoneal" | "hemodiafiltracion";
  turno: "mañana" | "tarde" | "noche";
  costoSesion: number;
  diasPorSemana: number;
  activo: boolean;
  createdAt: string;
}

export type CreatePacienteDto = Omit<Paciente, "id" | "createdAt">;
export type UpdatePacienteDto = Omit<Paciente, "id" | "createdAt">;

// Contratos de respuesta
export interface RespuestaLista<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface RespuestaUnica<T> {
  data: T;
}

export interface RespuestaError {
  error: string;
  message: string;
}