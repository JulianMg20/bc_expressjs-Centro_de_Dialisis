import { jest, describe, it, expect, beforeEach } from "@jest/globals";

jest.unstable_mockModule("../models/paciente.model.js", () => ({
  Paciente: {
    find: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  },
}));

const { Paciente } = await import("../models/paciente.model.js");
const repo = await import("../repositories/pacientes.repository.js");

describe("PacientesRepository - manejo de errores", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("findById", () => {
    it("lanza AppError 400 cuando Mongoose lanza CastError", async () => {
      const errorFalso: any = new Error("Cast failed");
      errorFalso.name = "CastError";

      (Paciente.findById as jest.Mock).mockReturnValue({
        populate: jest.fn().mockRejectedValue(errorFalso),
      });

      await expect(repo.findById("id-cualquiera")).rejects.toMatchObject({ statusCode: 400 });
    });
  });

  describe("create", () => {
    it("lanza AppError 409 cuando Mongoose lanza código 11000", async () => {
      const errorFalso: any = new Error("Duplicate key");
      errorFalso.code = 11000;

      (Paciente.create as jest.Mock).mockRejectedValue(errorFalso);

      await expect(repo.create({} as any, "user-id")).rejects.toMatchObject({ statusCode: 409 });
    });

    it("propaga errores no reconocidos sin transformarlos", async () => {
      const errorFalso = new Error("Error desconocido");
      (Paciente.create as jest.Mock).mockRejectedValue(errorFalso);

      await expect(repo.create({} as any, "user-id")).rejects.toThrow("Error desconocido");
    });
  });

  describe("update", () => {
    it("lanza AppError 409 cuando Mongoose lanza código 11000", async () => {
      const errorFalso: any = new Error("Duplicate key");
      errorFalso.code = 11000;

      (Paciente.findByIdAndUpdate as jest.Mock).mockRejectedValue(errorFalso);

      await expect(repo.update("id-cualquiera", {})).rejects.toMatchObject({ statusCode: 409 });
    });

    it("lanza AppError 400 cuando Mongoose lanza CastError", async () => {
      const errorFalso: any = new Error("Cast failed");
      errorFalso.name = "CastError";

      (Paciente.findByIdAndUpdate as jest.Mock).mockRejectedValue(errorFalso);

      await expect(repo.update("id-invalido", {})).rejects.toMatchObject({ statusCode: 400 });
    });

    it("propaga errores no reconocidos sin transformarlos", async () => {
      const errorFalso = new Error("Error desconocido en update");
      (Paciente.findByIdAndUpdate as jest.Mock).mockRejectedValue(errorFalso);

      await expect(repo.update("id-cualquiera", {})).rejects.toThrow("Error desconocido en update");
    });
  });

  describe("remove", () => {
    it("lanza AppError 400 cuando Mongoose lanza CastError", async () => {
      const errorFalso: any = new Error("Cast failed");
      errorFalso.name = "CastError";

      (Paciente.findByIdAndDelete as jest.Mock).mockRejectedValue(errorFalso);

      await expect(repo.remove("id-invalido")).rejects.toMatchObject({ statusCode: 400 });
    });

    it("propaga errores no reconocidos sin transformarlos", async () => {
      const errorFalso = new Error("Error desconocido en remove");
      (Paciente.findByIdAndDelete as jest.Mock).mockRejectedValue(errorFalso);

      await expect(repo.remove("id-cualquiera")).rejects.toThrow("Error desconocido en remove");
    });
  });
});