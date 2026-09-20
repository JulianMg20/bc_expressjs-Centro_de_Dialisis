import { z } from "zod";

export const idParamSchema = z.object({
  id: z.string().min(1, "El ID es obligatorio"),
});

export const createTipoTratamientoSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio").trim(),
  descripcion: z.string().optional(),
});

export const updateTipoTratamientoSchema = createTipoTratamientoSchema.partial();

export type CreateTipoTratamientoInput = z.infer<typeof createTipoTratamientoSchema>;
export type UpdateTipoTratamientoInput = z.infer<typeof updateTipoTratamientoSchema>;