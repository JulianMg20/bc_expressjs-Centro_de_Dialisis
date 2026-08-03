import { Router, type Request, type Response } from "express";
import * as store from "../store.js";
import type { CreatePacienteDto } from "../types.js";

export const pacientesRouter = Router();

// GET /api/v1/pacientes
pacientesRouter.get("/", (req: Request, res: Response) => {
  res.status(200).json(store.getAll());
});

// GET /api/v1/pacientes/:id
pacientesRouter.get("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const paciente = store.getById(id);

  if (!paciente) {
    return res.status(404).json({ error: `Paciente con id ${id} no encontrado` });
  }
  res.status(200).json(paciente);
});

// POST /api/v1/pacientes
pacientesRouter.post("/", (req: Request, res: Response) => {
  const data = req.body as CreatePacienteDto;

  if (!data.nombre || !data.tipoTratamiento) {
    return res.status(400).json({ error: "nombre y tipoTratamiento son obligatorios" });
  }

  const nuevoPaciente = store.create(data);
  res.status(201).json(nuevoPaciente);
});

// PUT /api/v1/pacientes/:id
pacientesRouter.put("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const data = req.body as CreatePacienteDto;

  const actualizado = store.update(id, data);
  if (!actualizado) {
    return res.status(404).json({ error: `Paciente con id ${id} no encontrado` });
  }
  res.status(200).json(actualizado);
});

// DELETE /api/v1/pacientes/:id
pacientesRouter.delete("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const eliminado = store.remove(id);

  if (!eliminado) {
    return res.status(404).json({ error: `Paciente con id ${id} no encontrado` });
  }
  res.status(204).send();
});