import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { AppError } from "../errors/AppError.js";
import type { CreatePacienteInput, UpdatePacienteInput } from "../schemas/pacientes.schema.js";

export async function findAll(skip: number, take: number) {
  const [data, total] = await Promise.all([
    prisma.paciente.findMany({ skip, take, include: { tipoTratamiento: true } }),
    prisma.paciente.count(),
  ]);
  return { data, total };
}

export async function findById(id: string) {
  return prisma.paciente.findUnique({
    where: { id },
    include: { tipoTratamiento: true },
  });
}

export async function create(data: CreatePacienteInput) {
  try {
    return await prisma.paciente.create({ data, include: { tipoTratamiento: true } });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") throw new AppError(409, "Ya existe un registro con ese valor");
      if (err.code === "P2025") throw new AppError(404, "Recurso relacionado no encontrado");
    }
    throw err;
  }
}

export async function update(id: string, data: UpdatePacienteInput) {
  try {
    return await prisma.paciente.update({ where: { id }, data, include: { tipoTratamiento: true } });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2025") throw new AppError(404, "Recurso no encontrado");
      if (err.code === "P2002") throw new AppError(409, "Ya existe un registro con ese valor");
    }
    throw err;
  }
}

export async function remove(id: string) {
  try {
    await prisma.paciente.delete({ where: { id } });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
      throw new AppError(404, "Recurso no encontrado");
    }
    throw err;
  }
}