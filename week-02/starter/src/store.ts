import type { Paciente, CreatePacienteDto, UpdatePacienteDto } from "./types.js";

let pacientes: Paciente[] = [
  { id: 1, nombre: "Carlos Ramírez", tipoTratamiento: "hemodialisis", turno: "mañana", costoSesion: 185000, diasPorSemana: 3, activo: true },
  { id: 2, nombre: "Ana Torres", tipoTratamiento: "dialisis_peritoneal", turno: "tarde", costoSesion: 210000, diasPorSemana: 7, activo: true },
  { id: 3, nombre: "Luis Fernández", tipoTratamiento: "hemodiafiltracion", turno: "noche", costoSesion: 240000, diasPorSemana: 3, activo: false },
];

let nextId = 4;

export function getAll(): Paciente[] {
  return pacientes;
}

export function getById(id: number): Paciente | undefined {
  return pacientes.find(p => p.id === id);
}

export function create(data: CreatePacienteDto): Paciente {
  const nuevoPaciente: Paciente = { id: nextId++, ...data };
  pacientes.push(nuevoPaciente);
  return nuevoPaciente;
}

export function update(id: number, data: UpdatePacienteDto): Paciente | undefined {
  const indice = pacientes.findIndex(p => p.id === id);
  if (indice === -1) return undefined;

  pacientes[indice] = { id, ...data };
  return pacientes[indice];
}

export function remove(id: number): boolean {
  const longitudInicial = pacientes.length;
  pacientes = pacientes.filter(p => p.id !== id);
  return pacientes.length < longitudInicial;
}