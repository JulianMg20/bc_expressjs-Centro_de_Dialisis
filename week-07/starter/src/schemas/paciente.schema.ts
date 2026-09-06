import { z } from "zod";

export const createPacienteSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio").trim(),
  turno: z.enum(["mañana", "tarde", "noche"]),
  tipoTratamiento: z.enum(["hemodialisis", "dialisis_peritoneal", "hemodiafiltracion"]),
  costoSesion: z.number().positive("El costo de sesión debe ser mayor a 0"),
  diasPorSemana: z.number().int().min(1).max(7),
  activo: z.boolean().default(true),
});

export const updatePacienteSchema = createPacienteSchema.partial();

export const idParamSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "El id debe ser un ObjectId válido"),
});

export type CreatePacienteInput = z.infer<typeof createPacienteSchema>;
export type UpdatePacienteInput = z.infer<typeof updatePacienteSchema>;