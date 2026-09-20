import { Paciente } from "../models/paciente.model.js";
import { AppError } from "../errors/AppError.js";
import type { CreatePacienteInput, UpdatePacienteInput } from "../schemas/paciente.schema.js";

export async function findAll() {
  return Paciente.find().populate("registradoPor", "nombre email");
}

export async function findById(id: string) {
  try {
    return await Paciente.findById(id).populate("registradoPor", "nombre email");
  } catch (err: any) {
    if (err.name === "CastError") throw new AppError(400, "El id debe ser un ObjectId válido");
    throw err;
  }
}

export async function create(data: CreatePacienteInput, registradoPor: string) {
  return Paciente.create({ ...data, registradoPor });
}

export async function update(id: string, data: UpdatePacienteInput) {
  try {
    const actualizado = await Paciente.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!actualizado) throw new AppError(404, "Paciente no encontrado");
    return actualizado;
  } catch (err: any) {
    if (err instanceof AppError) throw err;
    if (err.name === "CastError") throw new AppError(400, "El id debe ser un ObjectId válido");
    throw err;
  }
}

export async function remove(id: string) {
  try {
    const eliminado = await Paciente.findByIdAndDelete(id);
    if (!eliminado) throw new AppError(404, "Paciente no encontrado");
  } catch (err: any) {
    if (err instanceof AppError) throw err;
    if (err.name === "CastError") throw new AppError(400, "El id debe ser un ObjectId válido");
    throw err;
  }
}