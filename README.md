# 🩺 Testing de API REST — Centro de Diálisis

Suite completa de tests con **Jest + Supertest + MongoDB Memory Server** sobre la API del Centro de Diálisis, cubriendo unit tests de servicios e integration tests de rutas HTTP.

## Dominio asignado
Centro de Diálisis

## Recurso testeado: `Paciente`

Mismo modelo de las semanas anteriores (con `codigoExpediente` único, relación a `User` vía `registradoPor`, y RBAC en `DELETE`).

##   Cómo correr el proyecto

```bash
docker compose up -d
pnpm install
pnpm dev
```

## Comandos de testing

```bash
pnpm test              # ejecuta todos los tests
pnpm test:watch        # modo watch
pnpm test:coverage     # reporte de cobertura
```

##   Resultado de cobertura

```
Test Suites: 5 passed, 5 total
Tests:       37 passed, 37 total

File          | % Stmts | % Branch | % Funcs | % Lines
All files     |   93.71 |    70.27 |   97.61 |   96.17
```

| Umbral | Requerido | Obtenido |
|---|---|---|
| Statements | 80% | 93.71% ✅ |
| Branches | 70% | 70.27% ✅ |
| Functions | 80% | 97.61% ✅ |
| Lines | 80% | 96.17% ✅ |

##   Cumplimiento de requisitos

| Requisito | Estado |
|---|---|
| Unit tests para `pacientes.service.ts` (happy path + errores) | ✅ |
| Integration tests para `pacientes.routes.ts` con MongoDB Memory Server | ✅ |
| Auth unit tests (`auth.service.test.ts`) | ✅ |
| Cobertura ≥ 80% statements y lines | ✅ |
| `jest.clearAllMocks()` / `beforeEach` limpia estado entre tests | ✅ |
| Tests adaptados al dominio (Paciente, codigoExpediente) | ✅ |
| `pnpm build` sin errores TypeScript | ✅ |

## Caspturas de pantalla

### Tests pasando
<img width="1920" height="1140" alt="Tests pasando" src="https://github.com/user-attachments/assets/d788cb80-10fa-4930-8abe-687bd73fb6c4" />

### Tabla de cobertura
<img width="1920" height="1140" alt="Tabla de cobertura" src="https://github.com/user-attachments/assets/cb179da6-cfed-4344-9adf-eb6d21812000" />

### Reporte HTML
<img width="1920" height="1140" alt="Reporte HTML" src="https://github.com/user-attachments/assets/85dbefcc-c28f-4ef0-bbbb-4d0aa2630743" />


## Autor

- **Nombre:** Julián Esneyde Machado Garzón
- **Ficha:** 3228973B
- **GitHub:** [@JulianMg20](https://github.com/JulianMg20)
- **Programa:** Análisis y Desarrollo de Software (ADSI)
- **Trimestre:** 5
- **Instructor:** Erick Granados
- **Motor de base de datos :** MongoDB (con Mongoose)
