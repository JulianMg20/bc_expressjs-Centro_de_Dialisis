import { jest, describe, it, expect, beforeEach } from "@jest/globals";

jest.unstable_mockModule("../repositories/pacientes.repository.js", () => ({
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
}));

const repo = await import("../repositories/pacientes.repository.js");
const service = await import("../services/pacientes.service.js");

describe("PacientesService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("retorna todos los pacientes", async () => {
    const pacientesFalsos = [{ _id: "1", nombre: "Carlos Ramírez" }];
    (repo.findAll as jest.Mock<any, any>).mockResolvedValue(pacientesFalsos);

    await expect(service.listar()).resolves.toEqual(pacientesFalsos);
  });

  it("retorna el paciente por id", async () => {
    const pacienteFalso = { _id: "1", nombre: "Ana Torres" };
    (repo.findById as jest.Mock<any, any>).mockResolvedValue(pacienteFalso);

    await expect(service.obtener("1")).resolves.toEqual(pacienteFalso);
  });

  it("lanza AppError 404 si el paciente no existe", async () => {
    (repo.findById as jest.Mock<any, any>).mockResolvedValue(null);

    await expect(service.obtener("id-inexistente")).rejects.toMatchObject({ statusCode: 404 });
  });

  it("crea un paciente con datos válidos", async () => {
    const datosPaciente = {
      nombre: "Sofia Mora",
      codigoExpediente: "EXP-010",
      turno: "tarde" as const,
      tipoTratamiento: "hemodialisis" as const,
      costoSesion: 180000,
      diasPorSemana: 3,
      activo: true,
    };
    const pacienteCreado = { _id: "nuevo-id", ...datosPaciente };
    (repo.create as jest.Mock<any, any>).mockResolvedValue(pacienteCreado);

    await expect(service.crear(datosPaciente, "usuario-id-1")).resolves.toEqual(pacienteCreado);
  });

  it("propaga un error al crear un código duplicado", async () => {
    const { AppError } = await import("../errors/AppError.js");
    (repo.create as jest.Mock<any, any>).mockRejectedValue(new AppError(409, "Código duplicado"));

    await expect(service.crear({} as any, "usuario-id-1")).rejects.toMatchObject({ statusCode: 409 });
  });

  it("actualiza un paciente existente", async () => {
    const pacienteActualizado = { _id: "1", nombre: "Carlos Ramírez", activo: false };
    (repo.update as jest.Mock<any, any>).mockResolvedValue(pacienteActualizado);

    await expect(service.actualizar("1", { activo: false })).resolves.toEqual(pacienteActualizado);
  });

  it("lanza AppError 404 al actualizar un paciente inexistente", async () => {
    (repo.update as jest.Mock<any, any>).mockResolvedValue(null);

    await expect(service.actualizar("id-inexistente", {})).rejects.toMatchObject({ statusCode: 404 });
  });

  it("elimina un paciente", async () => {
    (repo.remove as jest.Mock<any, any>).mockResolvedValue(undefined);

    await expect(service.eliminar("1")).resolves.toBeUndefined();
  });

  it("propaga el error 404 al eliminar un paciente inexistente", async () => {
    const { AppError } = await import("../errors/AppError.js");
    (repo.remove as jest.Mock<any, any>).mockRejectedValue(new AppError(404, "Paciente no encontrado"));

    await expect(service.eliminar("id-inexistente")).rejects.toMatchObject({ statusCode: 404 });
  });
});