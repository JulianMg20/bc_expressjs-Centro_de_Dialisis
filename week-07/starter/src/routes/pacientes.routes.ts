import { Router } from "express";
import * as controller from "../controllers/pacientes.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export const pacientesRouter = Router();

pacientesRouter.use(authMiddleware); // protege TODAS las rutas de este router

pacientesRouter.get("/", controller.listar);
pacientesRouter.get("/:id", controller.obtenerPorId);
pacientesRouter.post("/", controller.crear);
pacientesRouter.patch("/:id", controller.actualizar);
pacientesRouter.delete("/:id", controller.eliminar);