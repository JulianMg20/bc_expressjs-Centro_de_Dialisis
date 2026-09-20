import { z } from "zod";

export const createPacienteSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio").trim(),
  tipoTratamiento: z.enum(["hemodialisis", "dialisis_peritoneal", "hemodiafiltracion"]),
  turno: z.enum(["mañana", "tarde", "noche"]),
  costoSesion: z.number().positive("El costo de sesión debe ser mayor a 0"),
  diasPorSemana: z.number().int().min(1).max(7),
  activo: z.boolean().default(true),
});

export const updatePacienteSchema = createPacienteSchema.partial();

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive("El id debe ser un número positivo"),
});

export type CreatePacienteInput = z.infer<typeof createPacienteSchema>;
export type UpdatePacienteInput = z.infer<typeof updatePacienteSchema>;