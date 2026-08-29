
import type { Request, Response, NextFunction } from "express";
import * as service from "../services/pacientes.service.js";
import { createPacienteSchema, updatePacienteSchema, idParamSchema } from "../schemas/paciente.schema.js";

export async function listar(req: Request, res: Response, next: NextFunction) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    res.status(200).json(await service.listarPacientes(page, limit));
  } catch (err) { next(err); }
}

export async function obtenerPorId(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = idParamSchema.parse(req.params);
    res.status(200).json({ data: await service.obtenerPaciente(id) });
  } catch (err) { next(err); }
}

export async function crear(req: Request, res: Response, next: NextFunction) {
  try {
    const data = createPacienteSchema.parse(req.body);
    res.status(201).json({ data: await service.crearPaciente(data) });
  } catch (err) { next(err); }
}

export async function actualizar(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = idParamSchema.parse(req.params);
    const data = updatePacienteSchema.parse(req.body);
    res.status(200).json({ data: await service.actualizarPaciente(id, data) });
  } catch (err) { next(err); }
}

export async function eliminar(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = idParamSchema.parse(req.params);
    await service.eliminarPaciente(id);
    res.status(204).send();
  } catch (err) { next(err); }
}