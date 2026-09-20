import type { Request, Response } from "express";
import * as service from "../services/pacientes.service.js";
import type { CreatePacienteDto, UpdatePacienteDto } from "../types.js";

export async function listar(req: Request, res: Response) {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 5;

  const resultado = await service.listarPacientes(page, limit);
  res.status(200).json(resultado);
}

export async function obtenerPorId(req: Request, res: Response) {
  const id = Number(req.params.id);
  const paciente = await service.obtenerPaciente(id);

  if (!paciente) {
    return res.status(404).json({ error: "Not Found", message: `Paciente ${id} not found` });
  }
  res.status(200).json({ data: paciente });
}

export async function crear(req: Request, res: Response) {
  const data = req.body as CreatePacienteDto;

  if (!data.nombre || !data.tipoTratamiento) {
    return res.status(400).json({ error: "Bad Request", message: "nombre y tipoTratamiento son obligatorios" });
  }

  const nuevoPaciente = await service.crearPaciente(data);
  res.status(201).json({ data: nuevoPaciente });
}

export async function actualizar(req: Request, res: Response) {
  const id = Number(req.params.id);
  const data = req.body as UpdatePacienteDto;

  const actualizado = await service.actualizarPaciente(id, data);
  if (!actualizado) {
    return res.status(404).json({ error: "Not Found", message: `Paciente ${id} not found` });
  }
  res.status(200).json({ data: actualizado });
}

export async function eliminar(req: Request, res: Response) {
  const id = Number(req.params.id);
  const eliminado = await service.eliminarPaciente(id);

  if (!eliminado) {
    return res.status(404).json({ error: "Not Found", message: `Paciente ${id} not found` });
  }
  res.status(204).send();
}