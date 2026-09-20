import { TipoTratamiento } from "../models/tipoTratamiento.model.js";
import { AppError } from "../errors/AppError.js";
import type { CreateTipoTratamientoInput, UpdateTipoTratamientoInput } from "../schemas/tipoTratamiento.schema.js";

export async function findAll() {
  return TipoTratamiento.find();
}

export async function findById(id: string) {
  return TipoTratamiento.findById(id);
}

export async function create(data: CreateTipoTratamientoInput) {
  try {
    return await TipoTratamiento.create(data);
  } catch (err: any) {
    if (err.code === 11000) {
      throw new AppError(409, "Ya existe un tipo de tratamiento con ese nombre");
    }
    throw err;
  }
}

export async function update(id: string, data: UpdateTipoTratamientoInput) {
  try {
    const actualizado = await TipoTratamiento.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!actualizado) throw new AppError(404, "Tipo de tratamiento no encontrado");
    return actualizado;
  } catch (err: any) {
    if (err.code === 11000) throw new AppError(409, "Ya existe un tipo de tratamiento con ese nombre");
    throw err;
  }
}

export async function remove(id: string) {
  const eliminado = await TipoTratamiento.findByIdAndDelete(id);
  if (!eliminado) throw new AppError(404, "Tipo de tratamiento no encontrado");
}