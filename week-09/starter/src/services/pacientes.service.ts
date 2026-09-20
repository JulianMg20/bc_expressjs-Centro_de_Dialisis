import * as repo from "../repositories/pacientes.repository.js";
import { AppError } from "../errors/AppError.js";
import type { CreatePacienteInput, UpdatePacienteInput } from "../validators/pacientes.schema.js";

export async function listar() {
  return repo.findAll();
}

export async function obtener(id: string) {
  const paciente = await repo.findById(id);
  if (!paciente) throw new AppError(404, "Paciente no encontrado");
  return paciente;
}

export async function crear(data: CreatePacienteInput, registradoPor: string) {
  return repo.create(data, registradoPor);
}

export async function actualizar(id: string, data: UpdatePacienteInput) {
  const actualizado = await repo.update(id, data);
  if (!actualizado) throw new AppError(404, "Paciente no encontrado");
  return actualizado;
}

export async function eliminar(id: string) {
  await repo.remove(id);
}