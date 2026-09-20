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
![alt text](<Tests pasando.png>)

### Tabla de cobertura
![alt text](<Tabla de cobertura.png>)

### Reporte HTML
![alt text](<Reporte HTML.png>) 

## Autor

- **Nombre:** Julián Esneyde Machado Garzón
- **Ficha:** 3228973B
- **GitHub:** [@JulianMg20](https://github.com/JulianMg20)
- **Programa:** Análisis y Desarrollo de Software (ADSI)
- **Trimestre:** 5
- **Instructor:** Erick Granados
- **Motor de base de datos :** MongoDB (con Mongoose)