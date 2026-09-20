import { jest, describe, it, expect, beforeEach } from "@jest/globals";

jest.unstable_mockModule("../repositories/users.repository.js", () => ({
  findByEmail: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  updateRefreshTokenHash: jest.fn(),
}));

const repo = await import("../repositories/users.repository.js");
const bcrypt = await import("bcrypt");
const authService = await import("../services/auth.service.js");

describe("AuthService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("crea un usuario nuevo con contraseña hasheada", async () => {
      (repo.findByEmail as jest.Mock<any, any>).mockResolvedValue(null);
      (repo.create as jest.Mock<any, any>).mockResolvedValue({
        _id: "user-1",
        nombre: "Ana Admin",
        email: "ana@dialisis.com",
        role: "recepcionista",
      });

      const resultado = await authService.register({
        nombre: "Ana Admin",
        email: "ana@dialisis.com",
        password: "clave12345",
      });

      expect(resultado.email).toBe("ana@dialisis.com");
      expect(repo.create).toHaveBeenCalled();
    });

    it("lanza 409 si el email ya existe", async () => {
      (repo.findByEmail as jest.Mock<any, any>).mockResolvedValue({ email: "ana@dialisis.com" });

      await expect(
        authService.register({ nombre: "Ana", email: "ana@dialisis.com", password: "clave12345" })
      ).rejects.toMatchObject({ statusCode: 409 });
    });
  });

  describe("login", () => {
    it("lanza 401 si el usuario no existe", async () => {
      (repo.findByEmail as jest.Mock<any, any>).mockResolvedValue(null);

      await expect(
        authService.login({ email: "no-existe@dialisis.com", password: "clave12345" })
      ).rejects.toMatchObject({ statusCode: 401 });
    });

    it("lanza 401 si la contraseña es incorrecta", async () => {
      const hashFalso = await bcrypt.hash("clave-correcta", 10);
      (repo.findByEmail as jest.Mock<any, any>).mockResolvedValue({
        _id: "user-1",
        email: "ana@dialisis.com",
        password: hashFalso,
        role: "recepcionista",
      });

      await expect(
        authService.login({ email: "ana@dialisis.com", password: "clave-incorrecta" })
      ).rejects.toMatchObject({ statusCode: 401 });
    });
  });
});