import type { Paciente } from "../types.js";
import type { CreatePacienteInput, UpdatePacienteInput } from "../schemas/paciente.schema.js";

let pacientes: Paciente[] = [
  { id: 1, nombre: "Carlos Ramírez", tipoTratamiento: "hemodialisis", turno: "mañana", costoSesion: 185000, diasPorSemana: 3, activo: true, createdAt: new Date().toISOString() },
  { id: 2, nombre: "Ana Torres", tipoTratamiento: "dialisis_peritoneal", turno: "tarde", costoSesion: 210000, diasPorSemana: 7, activo: true, createdAt: new Date().toISOString() },
  { id: 3, nombre: "Luis Fernández", tipoTratamiento: "hemodiafiltracion", turno: "noche", costoSesion: 240000, diasPorSemana: 3, activo: false, createdAt: new Date().toISOString() },
];

let nextId = 4;

export async function findAll(): Promise<Paciente[]> {
  return pacientes.map(p => ({ ...p }));
}

export async function findById(id: number): Promise<Paciente | undefined> {
  const paciente = pacientes.find(p => p.id === id);
  return paciente ? { ...paciente } : undefined;
}

export async function create(data: CreatePacienteInput): Promise<Paciente> {
  const nuevoPaciente: Paciente = { id: nextId++, ...data, createdAt: new Date().toISOString() };
  pacientes.push(nuevoPaciente);
  return { ...nuevoPaciente };
}

export async function update(id: number, data: UpdatePacienteInput): Promise<Paciente | undefined> {
  const indice = pacientes.findIndex(p => p.id === id);
  if (indice === -1) return undefined;

  pacientes[indice] = { ...pacientes[indice], ...data };
  return { ...pacientes[indice] };
}

export async function remove(id: number): Promise<boolean> {
  const longitudInicial = pacientes.length;
  pacientes = pacientes.filter(p => p.id !== id);
  return pacientes.length < longitudInicial;
}