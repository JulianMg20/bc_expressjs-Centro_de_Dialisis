import { Paciente } from "../models/paciente.model.js";
import { AppError } from "../errors/AppError.js";
import type { CreatePacienteInput, UpdatePacienteInput } from "../schemas/paciente.schema.js";

export async function findAll(skip: number, limit: number) {
  const [data, total] = await Promise.all([
    Paciente.find().skip(skip).limit(limit).populate("tipoTratamiento"),
    Paciente.countDocuments(),
  ]);
  return { data, total };
}

export async function findById(id: string) {
  try {
    return await Paciente.findById(id).populate("tipoTratamiento");
  } catch (err: any) {
    if (err.name === "CastError") throw new AppError(400, "El id debe ser un ObjectId válido");
    throw err;
  }
}

export async function create(data: CreatePacienteInput) {
  try {
    const nuevo = await Paciente.create(data);
    return nuevo.populate("tipoTratamiento");
  } catch (err: any) {
    if (err.code === 11000) throw new AppError(409, "Ya existe un registro con ese valor");
    if (err.name === "CastError") throw new AppError(400, "tipoTratamiento debe ser un ObjectId válido");
    throw err;
  }
}

export async function update(id: string, data: UpdatePacienteInput) {
  try {
    const actualizado = await Paciente.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate("tipoTratamiento");
    if (!actualizado) throw new AppError(404, "Paciente no encontrado");
    return actualizado;
  } catch (err: any) {
    if (err instanceof AppError) throw err;
    if (err.code === 11000) throw new AppError(409, "Ya existe un registro con ese valor");
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