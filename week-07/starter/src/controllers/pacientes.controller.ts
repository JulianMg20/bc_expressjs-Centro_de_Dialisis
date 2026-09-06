import type { Request, Response, NextFunction } from "express";
import * as service from "../services/pacientes.service.js";
import { createPacienteSchema, updatePacienteSchema, idParamSchema } from "../schemas/paciente.schema.js";

export async function listar(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(200).json({ data: await service.listar() });
  } catch (err) { next(err); }
}

export async function obtenerPorId(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = idParamSchema.parse(req.params);
    res.status(200).json({ data: await service.obtener(id) });
  } catch (err) { next(err); }
}

export async function crear(req: Request, res: Response, next: NextFunction) {
  try {
    const data = createPacienteSchema.parse(req.body);
    const nuevoPaciente = await service.crear(data, req.user!.id);
    res.status(201).json({ data: nuevoPaciente });
  } catch (err) { next(err); }
}

export async function actualizar(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = idParamSchema.parse(req.params);
    const data = updatePacienteSchema.parse(req.body);
    res.status(200).json({ data: await service.actualizar(id, data) });
  } catch (err) { next(err); }
}

export async function eliminar(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = idParamSchema.parse(req.params);
    await service.eliminar(id);
    res.status(204).send();
  } catch (err) { next(err); }
}