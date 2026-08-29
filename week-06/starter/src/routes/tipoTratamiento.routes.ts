import { Router } from "express";
import * as controller from "../controllers/tipoTratamiento.controller.js";

export const tipoTratamientoRouter = Router();

tipoTratamientoRouter.get("/", controller.listar);
tipoTratamientoRouter.get("/:id", controller.obtenerPorId);
tipoTratamientoRouter.post("/", controller.crear);
tipoTratamientoRouter.put("/:id", controller.actualizar);
tipoTratamientoRouter.delete("/:id", controller.eliminar);