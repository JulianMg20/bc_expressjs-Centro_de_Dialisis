#   API REST con Arquitectura en Capas — Centro de Diálisis

API REST construida con **Express 5 + TypeScript**, organizada en 4 capas (`routes → controllers → services → repositories`), que expone operaciones CRUD paginadas sobre pacientes de un centro de diálisis.

## Dominio asignado
Centro de Diálisis

## Recurso principal: `Paciente`

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | `number` | Identificador único, asignado automáticamente |
| `nombre` | `string` | Nombre completo del paciente |
| `tipoTratamiento` | `"hemodialisis" \| "dialisis_peritoneal" \| "hemodiafiltracion"` | Tipo de tratamiento de diálisis recibido |
| `turno` | `"mañana" \| "tarde" \| "noche"` | Turno asignado para las sesiones |
| `costoSesion` | `number` | Costo de cada sesión de tratamiento |
| `diasPorSemana` | `number` | Días a la semana que asiste a sesión |
| `activo` | `boolean` | Si el paciente continúa en tratamiento actualmente |
| `createdAt` | `string` (ISO) | Fecha de registro del paciente |

## 📁 Estructura del proyecto

```
starter/
├── package.json
├── tsconfig.json
├── pnpm-workspace.yaml
├── .env.example
└── src/
    ├── app.ts                        # Middlewares + rutas
    ├── server.ts                     # Arranque + graceful shutdown
    ├── types.ts                      # Interfaz Paciente, DTOs y contratos de respuesta
    ├── routes/
    │   └── pacientes.routes.ts       # Mapeo URL → controller
    ├── controllers/
    │   └── pacientes.controller.ts   # Traducción HTTP ↔ service
    ├── services/
    │   └── pacientes.service.ts      # Paginación y lógica de negocio
    └── repositories/
        └── pacientes.repository.ts   # Único punto de acceso a los datos
```

##   Arquitectura en capas

- **Repository** — única capa que toca el store en memoria. Todos los métodos son `async` y devuelven copias defensivas de los objetos, para que nada fuera de esta capa pueda mutar los datos directamente.
- **Service** — contiene la lógica de negocio (paginación, reglas de dominio). No importa nada de Express, así que es independiente del transporte HTTP.
- **Controller** — sigue 3 pasos siempre: extrae datos de la petición, llama al service, responde con el status code correcto.
- **Routes** — solo mapea método + URL a la función del controller correspondiente.

##   Cómo correr el proyecto

```bash
pnpm install
pnpm dev
```

El servidor queda disponible en `http://localhost:3000`.

Para la versión compilada:

```bash
pnpm build
pnpm start
```

## 🔌 Endpoints

| Método | Ruta | Descripción | Status exitoso |
|--------|------|-------------|-----------------|
| GET | `/api/v1/pacientes?page&limit` | Listar pacientes con paginación | 200 |
| GET | `/api/v1/pacientes/:id` | Obtener un paciente por ID | 200 / 404 |
| POST | `/api/v1/pacientes` | Crear un nuevo paciente | 201 / 400 |
| PUT | `/api/v1/pacientes/:id` | Actualizar un paciente completo | 200 / 404 |
| DELETE | `/api/v1/pacientes/:id` | Eliminar un paciente | 204 / 404 |

### Contratos de respuesta

```json
// GET /pacientes?page=1&limit=2 → 200
{ "data": [ /* pacientes */ ], "total": 3, "page": 1, "limit": 2 }

// GET /pacientes/1 → 200
{ "data": { "id": 1, "nombre": "Carlos Ramírez", ... } }

// POST /pacientes → 201
{ "data": { "id": 4, "nombre": "Sofia Mora", ... } }

// GET /pacientes/999 → 404
{ "error": "Not Found", "message": "Paciente 999 not found" }
```

##   CAPTURAS DE PANTALLA

Las 5 operaciones (incluyendo paginación y casos de error 404) se probaron con **Thunder Client**, verificando tanto las respuestas exitosas como los contratos de error.

# GET lista
![alt text](<GET lista.png>)
# GET por ID
![alt text](<GET por ID.png>)
# GET por ID inexistente.
![alt text](<GET por ID inexistente.png>)
# POST crear
![alt text](<POST crear.png>)
# PUT actualizar
![alt text](<PUT actualizar.png>)
# DELETE eliminar
![alt text](<DELETE eliminar.png>) 
##   Cumplimiento de requisitos

| Requisito | Estado |
|---|---|
| Arquitectura en 4 capas (routes → controllers → services → repositories) | ✅ |
| Paginación con `?page&limit` | ✅ |
| Contratos de respuesta tipados (`data`, `total`, `page`, `limit` / `error`, `message`) | ✅ |
| Repository 100% async con copias defensivas | ✅ |
| Service sin dependencias de Express | ✅ |
| Controller de 3 pasos (extraer → llamar service → responder) | ✅ |
| `pnpm build` sin errores TypeScript (modo estricto) | ✅ |

##   Autor

- **Nombre:** Julián Esneyde Machado Garzón
- **Ficha:** 3228973B
- **GitHub:** [@JulianMg20](https://github.com/JulianMg20)
- **Programa:** Análisis y Desarrollo de Software (ADSI)
- **Trimestre:** 5
- **Instructor:** Erick Granados