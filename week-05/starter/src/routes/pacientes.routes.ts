import { Router } from "express";
import * as controller from "../controllers/pacientes.controller.js";

export const pacientesRouter = Router();

pacientesRouter.get("/", controller.listar);
pacientesRouter.get("/:id", controller.obtenerPorId);
pacientesRouter.post("/", controller.crear);
pacientesRouter.put("/:id", controller.actualizar);
pacientesRouter.delete("/:id", controller.eliminar);