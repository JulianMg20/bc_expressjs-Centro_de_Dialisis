import { describe, it, expect, jest } from "@jest/globals";
import { errorHandler } from "../middlewares/error.middleware.js";

describe("errorHandler", () => {
  it("responde 500 para un error genérico no controlado", () => {
    const req: any = {};
    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    const next = jest.fn();

    errorHandler(new Error("Algo inesperado"), req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: "Internal Server Error" })
    );
  });

  it("responde 401 en requireRole cuando no hay req.user", async () => {
    const { requireRole } = await import("../middlewares/role.middleware.js");
    const req: any = {};
    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    const next = jest.fn();

    const middleware = requireRole("admin");
    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
    const errorPasado: any = next.mock.calls[0][0];
    expect(errorPasado.statusCode).toBe(401);
  });
});