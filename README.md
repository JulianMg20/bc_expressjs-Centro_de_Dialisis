#   API con PostgreSQL y Prisma ORM — Centro de Diálisis

API REST construida con **Express 5 + TypeScript + Prisma ORM**, que migra el almacenamiento en memoria de las semanas anteriores a una base de datos **PostgreSQL** real, corriendo en Docker.

## Dominio asignado
Centro de Diálisis

## Modelo de datos (relación 1:N)

Esta semana el dominio se dividió en dos entidades relacionadas:

### `TipoTratamiento` (recurso secundario)

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | `String @db.Uuid` | Identificador único |
| `nombre` | `String @unique` | Nombre del tratamiento (Hemodiálisis, Diálisis Peritoneal, Hemodiafiltración) |
| `descripcion` | `String?` | Descripción del tratamiento |

### `Paciente` (recurso principal)

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | `String @db.Uuid` | Identificador único |
| `nombre` | `String` | Nombre completo del paciente |
| `turno` | `String` | Turno asignado (mañana, tarde, noche) |
| `costoSesion` | `Float` | Costo de cada sesión |
| `diasPorSemana` | `Int` | Días a la semana que asiste |
| `activo` | `Boolean` | Si continúa en tratamiento |
| `createdAt` | `DateTime` | Fecha de registro |
| `tipoTratamientoId` | `String @db.Uuid` | Llave foránea hacia `TipoTratamiento` |

**Relación:** un `TipoTratamiento` tiene muchos `Paciente` (1:N).

## 📁 Estructura del proyecto

```
starter/
├── docker-compose.yml
├── package.json
├── tsconfig.json
├── pnpm-workspace.yaml
├── .env.example
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
└── src/
    ├── lib/prisma.ts
    ├── config/logger.ts
    ├── errors/AppError.ts
    ├── middlewares/
    │   ├── notFound.ts
    │   └── errorHandler.ts
    ├── schemas/pacientes.schema.ts
    ├── repositories/pacientes.repository.ts
    ├── services/pacientes.service.ts
    ├── controllers/pacientes.controller.ts
    ├── routes/pacientes.routes.ts
    ├── app.ts
    └── server.ts
```

##  Cómo correr el proyecto

```bash
docker compose up -d
pnpm install
pnpm exec prisma migrate dev --name init
pnpm seed
pnpm dev
```

El servidor queda disponible en `http://localhost:3000`.

##   Nota sobre la versión de Prisma

El proyecto usa **Prisma 5.22.0** en lugar de la última versión disponible (7.x/6.19.x). Se detectó un problema de compatibilidad del motor de conexión de Prisma 6.19.3 en el entorno de desarrollo (Windows + Docker Desktop), que impedía autenticar contra PostgreSQL a pesar de que las credenciales eran correctas (verificado conectando directamente con el driver `pg` de Node, sin pasar por Prisma). El downgrade a la versión 5.22.0 resolvió el problema sin cambiar ninguna otra configuración.

##   Seed

`prisma/seed.ts` carga 3 tipos de tratamiento y 5 pacientes demo, usando `upsert` para los tratamientos (garantiza idempotencia por el campo `nombre @unique`) y una verificación manual de existencia para los pacientes.

Log de ejecución del seed:

```
$ tsx prisma/seed.ts
✅ Seed completado
```

##  Endpoints

| Método | Ruta | Descripción | Status |
|--------|------|-------------|--------|
| GET | `/api/v1/pacientes?page&limit` | Listado paginado, incluye `tipoTratamiento` anidado | 200 |
| GET | `/api/v1/pacientes/:id` | Detalle con relación | 200 / 400 / 404 |
| POST | `/api/v1/pacientes` | Crear (validado con Zod) | 201 / 400 / 409 |
| PUT | `/api/v1/pacientes/:id` | Actualizar | 200 / 400 / 404 |
| DELETE | `/api/v1/pacientes/:id` | Eliminar | 204 / 404 |

### Ejemplo de request/response

**POST** `/api/v1/pacientes`
```json
{
  "nombre": "Sofia Mora",
  "turno": "tarde",
  "costoSesion": 180000,
  "diasPorSemana": 3,
  "activo": true,
  "tipoTratamientoId": "50f82590-2841-4cb6-81f1-8f6297090f50"
}
```

**Respuesta 201:**
```json
{
  "data": {
    "id": "30bdfbf3-d67b-4c19-93c5-4507bc640828",
    "nombre": "Sofia Mora",
    "turno": "tarde",
    "costoSesion": 180000,
    "diasPorSemana": 3,
    "activo": true,
    "createdAt": "2026-08-24T11:14:44.073Z",
    "tipoTratamientoId": "50f82590-2841-4cb6-81f1-8f6297090f50",
    "tipoTratamiento": {
      "id": "50f82590-2841-4cb6-81f1-8f6297090f50",
      "nombre": "Hemodiálisis",
      "descripcion": "Filtrado de sangre mediante máquina"
    }
  }
}
```

##   Manejo de errores de Prisma

El repository traduce los códigos de error de Prisma a `AppError`:

- **`P2025`** (registro no encontrado) → `AppError(404, "Recurso no encontrado")`
- **`P2002`** (violación de constraint único, ej. nombre de tratamiento duplicado) → `AppError(409, "Ya existe un registro con ese valor")`

Todos los errores pasan por el `errorHandler` central, que distingue `ZodError` (400), `AppError` (su `statusCode`), y errores genéricos (500).

##  Casos de prueba verificados

| Caso | Resultado |
|---|---|
| GET listado paginado | 200, con `tipoTratamiento` anidado |
| GET por id válido | 200 |
| GET con id no-UUID | 400 con `issues[]` |
| GET con UUID válido pero inexistente | 404 |
| POST crear paciente | 201 |
| PUT actualizar paciente | 200 |
| DELETE paciente | 204 |

##  Cumplimiento de requisitos

| Requisito | Estado |
|---|---|
| 2 modelos con relación 1:N, PK/FK en UUID | ✅ |
| Migraciones versionadas (`prisma/migrations/`, no ignoradas en git) | ✅ |
| Seed idempotente con mínimo 5 registros | ✅ |
| CRUD completo con Prisma | ✅ |
| Manejo de errores P2025/P2002 → AppError | ✅ |
| Paginación `?page&limit` | ✅ |
| `pnpm build` sin errores TypeScript | ✅ |

## Capturas de Pantalla
# Post 
![alt text](<POST crear paciente.png>)
# Get
![alt text](GET_por_ID.png)
# Get con UUID inválido
![alt text](<GET con UUID inválido.png>)
# Get con UUID válido pero inexistente
![alt text](<GET con UUID válido pero inexistente.png>)
# Put
![alt text](PUT_actualizar.png)
# Delete
![alt text](DELETE_.png) 

## Autor

- **Nombre:** Julián Esneyde Machado Garzón
- **Ficha:** 3228973B
- **GitHub:** [@JulianMg20](https://github.com/JulianMg20)
- **Programa:** Análisis y Desarrollo de Software (ADSI)
- **Trimestre:** 5
- **Instructor:** Erick Granados
