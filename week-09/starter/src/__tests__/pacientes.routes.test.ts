import { describe, it, expect, beforeAll, afterAll, beforeEach } from "@jest/globals";
import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { app } from "../app.js";
import { User } from "../models/user.model.js";
import { Paciente } from "../models/paciente.model.js";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
  await Paciente.deleteMany({});
});

async function crearUsuarioYObtenerCookies(role: "admin" | "recepcionista" = "recepcionista") {
  await request(app).post("/api/v1/auth/register").send({
    nombre: "Usuario Test",
    email: `test-${Date.now()}@dialisis.com`,
    password: "clave12345",
  });

  const loginRes = await request(app).post("/api/v1/auth/login").send({
    email: undefined, // se completa abajo
    password: "clave12345",
  });

  return loginRes;
}

describe("Pacientes - Integration", () => {
  describe("GET /api/v1/pacientes", () => {
    it("retorna 200 con array vacío inicialmente", async () => {
      const res = await request(app).get("/api/v1/pacientes");

      expect(res.status).toBe(200);
      expect(res.body.data).toEqual([]);
    });
  });

  describe("POST /api/v1/pacientes", () => {
    it("retorna 401 sin token", async () => {
      const res = await request(app).post("/api/v1/pacientes").send({
        nombre: "Carlos Ramírez",
        codigoExpediente: "EXP-001",
        turno: "mañana",
        tipoTratamiento: "hemodialisis",
        costoSesion: 185000,
        diasPorSemana: 3,
      });

      expect(res.status).toBe(401);
    });

    it("retorna 422 con datos inválidos", async () => {
      const email = `admin-${Date.now()}@dialisis.com`;
      await request(app).post("/api/v1/auth/register").send({ nombre: "Admin", email, password: "clave12345" });
      const loginRes = await request(app).post("/api/v1/auth/login").send({ email, password: "clave12345" });
      const cookies = loginRes.headers["set-cookie"];

      const res = await request(app)
        .post("/api/v1/pacientes")
        .set("Cookie", cookies)
        .send({ nombre: "" }); // body inválido a propósito

      expect(res.status).toBe(422);
      expect(res.body.issues).toBeDefined();
    });

    it("retorna 201 con datos válidos", async () => {
      const email = `admin2-${Date.now()}@dialisis.com`;
      await request(app).post("/api/v1/auth/register").send({ nombre: "Admin", email, password: "clave12345" });
      const loginRes = await request(app).post("/api/v1/auth/login").send({ email, password: "clave12345" });
      const cookies = loginRes.headers["set-cookie"];

      const res = await request(app)
        .post("/api/v1/pacientes")
        .set("Cookie", cookies)
        .send({
          nombre: "Ana Torres",
          codigoExpediente: `EXP-${Date.now()}`,
          turno: "tarde",
          tipoTratamiento: "dialisis_peritoneal",
          costoSesion: 210000,
          diasPorSemana: 7,
          activo: true,
        });

      expect(res.status).toBe(201);
      expect(res.body.data.nombre).toBe("Ana Torres");
    });
  });

  describe("GET /api/v1/pacientes/:id", () => {
    it("retorna 404 con ID inexistente", async () => {
      const idFalsoValido = new mongoose.Types.ObjectId().toString();
      const res = await request(app).get(`/api/v1/pacientes/${idFalsoValido}`);

      expect(res.status).toBe(404);
    });
  });

  describe("DELETE /api/v1/pacientes/:id", () => {
    it("retorna 403 si no es admin", async () => {
      const email = `recep-${Date.now()}@dialisis.com`;
      await request(app).post("/api/v1/auth/register").send({ nombre: "Recep", email, password: "clave12345" });
      const loginRes = await request(app).post("/api/v1/auth/login").send({ email, password: "clave12345" });
      const cookies = loginRes.headers["set-cookie"];

      const crearRes = await request(app)
        .post("/api/v1/pacientes")
        .set("Cookie", cookies)
        .send({
          nombre: "Luis Fernández",
          codigoExpediente: `EXP-${Date.now()}`,
          turno: "noche",
          tipoTratamiento: "hemodiafiltracion",
          costoSesion: 240000,
          diasPorSemana: 3,
          activo: false,
        });

      const res = await request(app)
        .delete(`/api/v1/pacientes/${crearRes.body.data._id}`)
        .set("Cookie", cookies);

      expect(res.status).toBe(403);
    });

    it("retorna 204 al eliminar como admin", async () => {
      const email = `admin3-${Date.now()}@dialisis.com`;
      await request(app).post("/api/v1/auth/register").send({ nombre: "Admin", email, password: "clave12345" });

      // Promover a admin directamente en la base en memoria
      await User.updateOne({ email }, { $set: { role: "admin" } });

      const loginRes = await request(app).post("/api/v1/auth/login").send({ email, password: "clave12345" });
      const cookies = loginRes.headers["set-cookie"];

      const crearRes = await request(app)
        .post("/api/v1/pacientes")
        .set("Cookie", cookies)
        .send({
          nombre: "María Gómez",
          codigoExpediente: `EXP-${Date.now()}`,
          turno: "tarde",
          tipoTratamiento: "hemodialisis",
          costoSesion: 175000,
          diasPorSemana: 3,
          activo: true,
        });

      const res = await request(app)
        .delete(`/api/v1/pacientes/${crearRes.body.data._id}`)
        .set("Cookie", cookies);

      expect(res.status).toBe(204);
    });

    it("retorna 400 al eliminar con ID mal formado como admin", async () => {
      const email = `deletebad-${Date.now()}@dialisis.com`;
      await request(app).post("/api/v1/auth/register").send({ nombre: "DeleteBad", email, password: "clave12345" });
      await User.updateOne({ email }, { $set: { role: "admin" } });

      const loginRes = await request(app).post("/api/v1/auth/login").send({ email, password: "clave12345" });
      const cookies = loginRes.headers["set-cookie"];
      const res = await request(app).delete("/api/v1/pacientes/id-mal-formado").set("Cookie", cookies);

      expect([400, 422]).toContain(res.status);
    });
  });
});

describe("Auth flow completo - Integration", () => {
  it("permite refresh y logout, y refresh posterior falla", async () => {
    const email = `flujo-${Date.now()}@dialisis.com`;
    await request(app).post("/api/v1/auth/register").send({ nombre: "Flujo", email, password: "clave12345" });
    const loginRes = await request(app).post("/api/v1/auth/login").send({ email, password: "clave12345" });
    const cookiesLogin = loginRes.headers["set-cookie"];

    const meRes = await request(app).get("/api/v1/auth/me").set("Cookie", cookiesLogin);
    expect(meRes.status).toBe(200);

    const refreshRes = await request(app).post("/api/v1/auth/refresh").set("Cookie", cookiesLogin);
    expect(refreshRes.status).toBe(200);
    const cookiesRefresh = refreshRes.headers["set-cookie"];

    const logoutRes = await request(app).post("/api/v1/auth/logout").set("Cookie", cookiesRefresh);
    expect(logoutRes.status).toBe(200);

    const refreshTrasLogout = await request(app).post("/api/v1/auth/refresh").set("Cookie", cookiesRefresh);
    expect(refreshTrasLogout.status).toBe(401);
  });

  it("retorna 401 en /me sin cookie", async () => {
    const res = await request(app).get("/api/v1/auth/me");
    expect(res.status).toBe(401);
  });
});

describe("PUT /api/v1/pacientes/:id", () => {
  it("actualiza el paciente con datos válidos", async () => {
    const email = `update-${Date.now()}@dialisis.com`;
    await request(app).post("/api/v1/auth/register").send({ nombre: "Update", email, password: "clave12345" });
    const loginRes = await request(app).post("/api/v1/auth/login").send({ email, password: "clave12345" });
    const cookies = loginRes.headers["set-cookie"];

    const crearRes = await request(app).post("/api/v1/pacientes").set("Cookie", cookies).send({
      nombre: "Jorge Salazar",
      codigoExpediente: `EXP-UPD-${Date.now()}`,
      turno: "mañana",
      tipoTratamiento: "hemodialisis",
      costoSesion: 190000,
      diasPorSemana: 3,
      activo: true,
    });

    const res = await request(app)
      .put(`/api/v1/pacientes/${crearRes.body.data._id}`)
      .set("Cookie", cookies)
      .send({ activo: false });

    expect(res.status).toBe(200);
    expect(res.body.data.activo).toBe(false);
  });

  it("retorna 404 al actualizar un id inexistente", async () => {
    const email = `update404-${Date.now()}@dialisis.com`;
    await request(app).post("/api/v1/auth/register").send({ nombre: "Update404", email, password: "clave12345" });
    const loginRes = await request(app).post("/api/v1/auth/login").send({ email, password: "clave12345" });
    const cookies = loginRes.headers["set-cookie"];

    const idFalso = new mongoose.Types.ObjectId().toString();
    const res = await request(app).put(`/api/v1/pacientes/${idFalso}`).set("Cookie", cookies).send({ activo: false });

    expect(res.status).toBe(404);
  });
  it("retorna 400 al actualizar con ID mal formado", async () => {
    const email = `updatebad-${Date.now()}@dialisis.com`;
    await request(app).post("/api/v1/auth/register").send({ nombre: "UpdateBad", email, password: "clave12345" });
    const loginRes = await request(app).post("/api/v1/auth/login").send({ email, password: "clave12345" });
    const cookies = loginRes.headers["set-cookie"];

    const res = await request(app)
      .put("/api/v1/pacientes/id-mal-formado")
      .set("Cookie", cookies)
      .send({ activo: false });

    expect([400, 422]).toContain(res.status);
  });

  it("retorna 409 al actualizar con código de expediente duplicado", async () => {
    const email = `updatedup-${Date.now()}@dialisis.com`;
    await request(app).post("/api/v1/auth/register").send({ nombre: "UpdateDup", email, password: "clave12345" });
    const loginRes = await request(app).post("/api/v1/auth/login").send({ email, password: "clave12345" });
    const cookies = loginRes.headers["set-cookie"];
    const codigoA = `EXP-A-${Date.now()}`;
    const codigoB = `EXP-B-${Date.now()}`;

    await request(app).post("/api/v1/pacientes").set("Cookie", cookies).send({
      nombre: "Paciente A", codigoExpediente: codigoA, turno: "mañana",
      tipoTratamiento: "hemodialisis", costoSesion: 100000, diasPorSemana: 3, activo: true,
    });
    const crearB = await request(app).post("/api/v1/pacientes").set("Cookie", cookies).send({
      nombre: "Paciente B", codigoExpediente: codigoB, turno: "tarde",
      tipoTratamiento: "hemodialisis", costoSesion: 100000, diasPorSemana: 3, activo: true,
    });

    const res = await request(app)
      .put(`/api/v1/pacientes/${crearB.body.data._id}`)
      .set("Cookie", cookies)
      .send({ codigoExpediente: codigoA });

    expect(res.status).toBe(409);
  });
});