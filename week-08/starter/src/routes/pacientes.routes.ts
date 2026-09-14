import { Router } from "express";
import * as controller from "../controllers/pacientes.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";

export const pacientesRouter = Router();

pacientesRouter.use(authMiddleware); // todas requieren estar logueado

pacientesRouter.get("/", controller.listar);
pacientesRouter.get("/:id", controller.obtenerPorId);
pacientesRouter.post("/", controller.crear);
pacientesRouter.patch("/:id", controller.actualizar);
pacientesRouter.delete("/:id", requireRole("admin"), controller.eliminar); // solo admin