import type { Request, Response, NextFunction } from "express";
import * as service from "../services/pacientes.service.js";
import { createPacienteSchema, updatePacienteSchema, idParamSchema } from "../schemas/pacientes.schema.js";

export async function listar(req: Request, res: Response, next: NextFunction) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const resultado = await service.listarPacientes(page, limit);
    res.status(200).json(resultado);
  } catch (err) { next(err); }
}

export async function obtenerPorId(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = idParamSchema.parse(req.params);
    const paciente = await service.obtenerPaciente(id);
    res.status(200).json({ data: paciente });
  } catch (err) { next(err); }
}

export async function crear(req: Request, res: Response, next: NextFunction) {
  try {
    const data = createPacienteSchema.parse(req.body);
    const nuevoPaciente = await service.crearPaciente(data);
    res.status(201).json({ data: nuevoPaciente });
  } catch (err) { next(err); }
}

export async function actualizar(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = idParamSchema.parse(req.params);
    const data = updatePacienteSchema.parse(req.body);
    const actualizado = await service.actualizarPaciente(id, data);
    res.status(200).json({ data: actualizado });
  } catch (err) { next(err); }
}

export async function eliminar(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = idParamSchema.parse(req.params);
    await service.eliminarPaciente(id);
    res.status(204).send();
  } catch (err) { next(err); }
}