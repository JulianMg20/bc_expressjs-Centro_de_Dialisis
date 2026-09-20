import * as repo from "../repositories/pacientes.repository.js";
import { AppError } from "../errors/AppError.js";
import type { CreatePacienteInput, UpdatePacienteInput } from "../schemas/paciente.schema.js";

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
  return repo.update(id, data);
}

export async function eliminar(id: string) {
  await repo.remove(id);
}