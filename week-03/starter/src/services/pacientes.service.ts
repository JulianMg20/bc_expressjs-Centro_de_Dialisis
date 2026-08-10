import * as repo from "../repositories/pacientes.repository.js";
import type { Paciente, CreatePacienteDto, UpdatePacienteDto, RespuestaLista } from "../types.js";

export async function listarPacientes(page: number, limit: number): Promise<RespuestaLista<Paciente>> {
  const todos = await repo.findAll();
  const total = todos.length;

  const inicio = (page - 1) * limit;
  const data = todos.slice(inicio, inicio + limit);

  return { data, total, page, limit };
}

export async function obtenerPaciente(id: number): Promise<Paciente | undefined> {
  return repo.findById(id);
}

export async function crearPaciente(data: CreatePacienteDto): Promise<Paciente> {
  return repo.create(data);
}

export async function actualizarPaciente(id: number, data: UpdatePacienteDto): Promise<Paciente | undefined> {
  return repo.update(id, data);
}

export async function eliminarPaciente(id: number): Promise<boolean> {
  return repo.remove(id);
}