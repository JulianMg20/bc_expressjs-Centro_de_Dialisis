import * as repo from "../repositories/pacientes.repository.js";
import { AppError } from "../errors/AppError.js";
import type { CreatePacienteInput, UpdatePacienteInput } from "../schemas/pacientes.schema.js";

export async function listarPacientes(page: number, limit: number) {
  const skip = (page - 1) * limit;
  const { data, total } = await repo.findAll(skip, limit);
  return { data, total, page, limit };
}

export async function obtenerPaciente(id: string) {
  const paciente = await repo.findById(id);
  if (!paciente) throw new AppError(404, "Recurso no encontrado");
  return paciente;
}

export async function crearPaciente(data: CreatePacienteInput) {
  return repo.create(data);
}

export async function actualizarPaciente(id: string, data: UpdatePacienteInput) {
  return repo.update(id, data);
}

export async function eliminarPaciente(id: string) {
  await repo.remove(id);
}