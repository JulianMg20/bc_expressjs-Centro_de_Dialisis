import * as repo from "../repositories/pacientes.repository.js";
import { AppError } from "../errors/AppError.js";
import type { Paciente, RespuestaLista } from "../types.js";
import type { CreatePacienteInput, UpdatePacienteInput } from "../schemas/paciente.schema.js";

export async function listarPacientes(page: number, limit: number): Promise<RespuestaLista<Paciente>> {
  const todos = await repo.findAll();
  const total = todos.length;
  const inicio = (page - 1) * limit;
  const data = todos.slice(inicio, inicio + limit);

  return { data, total, page, limit };
}

export async function obtenerPaciente(id: number): Promise<Paciente> {
  const paciente = await repo.findById(id);
  if (!paciente) {
    throw new AppError(404, `Paciente ${id} not found`);
  }
  return paciente;
}

export async function crearPaciente(data: CreatePacienteInput): Promise<Paciente> {
  return repo.create(data);
}

export async function actualizarPaciente(id: number, data: UpdatePacienteInput): Promise<Paciente> {
  const actualizado = await repo.update(id, data);
  if (!actualizado) {
    throw new AppError(404, `Paciente ${id} not found`);
  }
  return actualizado;
}

export async function eliminarPaciente(id: number): Promise<void> {
  const eliminado = await repo.remove(id);
  if (!eliminado) {
    throw new AppError(404, `Paciente ${id} not found`);
  }
}