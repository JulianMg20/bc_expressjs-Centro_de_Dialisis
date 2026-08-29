#  API REST con MongoDB + Mongoose — Centro de Diálisis

API REST construida con **Express 5 + TypeScript + Mongoose**, sobre **MongoDB** corriendo en Docker, con dos entidades relacionadas mediante referencias y `populate()`.

## Dominio asignado
Centro de Diálisis

## Entidades

### `TipoTratamiento` (secundaria, sin referencias)

| Campo | Tipo | Descripción |
|---|---|---|
| `_id` | `ObjectId` | Identificador único |
| `nombre` | `String` (único) | Nombre del tratamiento |
| `descripcion` | `String?` | Descripción del tratamiento |

### `Paciente` (principal, referencia a `TipoTratamiento`)

| Campo | Tipo | Descripción |
|---|---|---|
| `_id` | `ObjectId` | Identificador único |
| `nombre` | `String` | Nombre completo del paciente |
| `turno` | `"mañana" \| "tarde" \| "noche"` | Turno asignado |
| `costoSesion` | `Number` | Costo de cada sesión |
| `diasPorSemana` | `Number` | Días a la semana que asiste |
| `activo` | `Boolean` | Si continúa en tratamiento |
| `tipoTratamiento` | `ObjectId` (ref: `TipoTratamiento`) | Referencia al tratamiento asignado |

## 📁 Estructura del proyecto

```
starter/
├── docker-compose.yml
├── package.json
├── tsconfig.json
├── pnpm-workspace.yaml
├── .env.example
└── src/
    ├── lib/mongoose.ts               # connectDB
    ├── config/logger.ts              # Winston + stream de Morgan
    ├── errors/AppError.ts
    ├── middlewares/
    │   ├── notFound.ts
    │   └── errorHandler.ts
    ├── models/
    │   ├── tipoTratamiento.model.ts
    │   └── paciente.model.ts
    ├── schemas/
    │   ├── tipoTratamiento.schema.ts
    │   └── paciente.schema.ts
    ├── repositories/
    │   ├── tipoTratamiento.repository.ts
    │   └── pacientes.repository.ts
    ├── services/
    │   ├── tipoTratamiento.service.ts
    │   └── pacientes.service.ts
    ├── controllers/
    │   ├── tipoTratamiento.controller.ts
    │   └── pacientes.controller.ts
    ├── routes/
    │   ├── tipoTratamiento.routes.ts
    │   └── pacientes.routes.ts
    ├── app.ts
    ├── server.ts
    └── seed.ts
```

##   Cómo correr el proyecto

```bash
docker compose up -d
pnpm install
pnpm seed
pnpm dev
```

El servidor queda disponible en `http://localhost:3000`.

##  Seed

`src/seed.ts` limpia las colecciones (pacientes primero, luego tipos de tratamiento, para no dejar referencias huérfanas) e inserta 3 tipos de tratamiento y 5 pacientes demo, cada uno referenciando su tratamiento correspondiente.

Log de ejecución:
```
$ tsx src/seed.ts
✅ Seed completado
```

##   Endpoints

### `TipoTratamiento`

| Método | Ruta | Descripción | Status |
|--------|------|-------------|--------|
| GET | `/api/v1/tipos-tratamiento` | Listar todos | 200 |
| GET | `/api/v1/tipos-tratamiento/:id` | Obtener por ID | 200 / 400 / 404 |
| POST | `/api/v1/tipos-tratamiento` | Crear | 201 / 400 / 409 |
| PUT | `/api/v1/tipos-tratamiento/:id` | Actualizar | 200 / 400 / 404 / 409 |
| DELETE | `/api/v1/tipos-tratamiento/:id` | Eliminar | 204 / 400 / 404 |

### `Paciente`

| Método | Ruta | Descripción | Status |
|--------|------|-------------|--------|
| GET | `/api/v1/pacientes?page&limit` | Listado paginado, con `tipoTratamiento` populado | 200 |
| GET | `/api/v1/pacientes/:id` | Obtener con populate | 200 / 400 / 404 |
| POST | `/api/v1/pacientes` | Crear (valida ObjectId de `tipoTratamiento`) | 201 / 400 / 409 |
| PUT | `/api/v1/pacientes/:id` | Actualizar | 200 / 400 / 404 |
| DELETE | `/api/v1/pacientes/:id` | Eliminar | 204 / 400 / 404 |

### Contrato de paginación

```json
{ "data": [...], "total": 5, "page": 1, "totalPages": 1 }
```

##  Manejo de errores

- **`CastError`** (ID con formato inválido para Mongoose) → `AppError(400, ...)`
- **Código `11000`** (violación de índice único, ej. nombre de tratamiento duplicado) → `AppError(409, ...)`
- **Documento no encontrado** → `AppError(404, ...)`
- **`ZodError`** (validación de entrada) → `400` con `issues[]`

Todos pasan por el `errorHandler` central, con `logger.warn()` para los `AppError` y `logger.error()` para errores no controlados.

##  Casos de prueba verificados

| Caso | Resultado |
|---|---|
| `GET /pacientes` con `tipoTratamiento` populado | 200 |
| `POST /pacientes` con `tipoTratamiento` inválido (no ObjectId) | 400 |
| `POST /pacientes` válido | 201, con populate incluido en la respuesta |
| `POST /tipos-tratamiento` con nombre duplicado | 409 |


## Capturas de pantalla
# get pacientes
![alt text](GET200.png)
# post Id de tratamiento inválido
![alt text](<ID de tratamiento inválido_400.png>)
# post paciente válido
![alt text](<POST paciente válido_201.png>)
# post tipo de tratamiento duplicado
![alt text](<POST tipo de tratamiento duplicado_409.png>) 

## ✅ Cumplimiento de requisitos

| Requisito | Estado |
|---|---|
| 2 entidades relacionadas con `populate()` | ✅ |
| Paginación (`page`, `limit`, `total`, `totalPages`) | ✅ |
| Manejo de error 11000 (único) → 409 | ✅ |
| Manejo de `CastError` → 400 | ✅ |
| Seed idempotente (limpia antes de insertar) con 5+ registros | ✅ |
| `pnpm build` sin errores TypeScript (modo estricto) | ✅ |

## Autor

- **Nombre:** Julián Esneyde Machado Garzón
- **Ficha:** 3228973B
- **GitHub:** [@JulianMg20](https://github.com/JulianMg20)
- **Programa:** Análisis y Desarrollo de Software (ADSI)
- **Trimestre:** 5
- **Instructor:** Erick Granados
- **Motor de base de datos :** MongoDB (con Mongoose)