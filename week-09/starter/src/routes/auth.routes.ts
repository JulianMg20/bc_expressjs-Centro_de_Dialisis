import { Router } from "express";
import * as controller from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export const authRouter = Router();

authRouter.post("/register", controller.register);
authRouter.post("/login", controller.login);
authRouter.get("/me", authMiddleware, controller.me);
authRouter.post("/refresh", controller.refresh);
authRouter.post("/logout", authMiddleware, controller.logout);