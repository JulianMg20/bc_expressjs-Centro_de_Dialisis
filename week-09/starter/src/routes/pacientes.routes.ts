import { Router } from "express";
import * as controller from "../controllers/pacientes.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";

export const pacientesRouter = Router();

pacientesRouter.get("/", controller.listar);
pacientesRouter.get("/:id", controller.obtenerPorId);
pacientesRouter.post("/", authMiddleware, controller.crear);
pacientesRouter.put("/:id", authMiddleware, controller.actualizar);
pacientesRouter.delete("/:id", authMiddleware, requireRole("admin"), controller.eliminar);