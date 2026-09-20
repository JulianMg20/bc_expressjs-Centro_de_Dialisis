import * as repo from "../repositories/tipoTratamiento.repository.js";
import { AppError } from "../errors/AppError.js";
import type { CreateTipoTratamientoInput, UpdateTipoTratamientoInput } from "../schemas/tipoTratamiento.schema.js";

export async function listar() {
  return repo.findAll();
}

export async function obtener(id: string) {
  const tipoTratamiento = await repo.findById(id);
  if (!tipoTratamiento) throw new AppError(404, "Tipo de tratamiento no encontrado");
  return tipoTratamiento;
}

export async function crear(data: CreateTipoTratamientoInput) {
  return repo.create(data);
}

export async function actualizar(id: string, data: UpdateTipoTratamientoInput) {
  return repo.update(id, data);
}

export async function eliminar(id: string) {
  await repo.remove(id);
}