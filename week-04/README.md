# Validación, Errores y Logging — Centro de Diálisis

API REST construida con **Express 5 + TypeScript**, que añade validación estructurada con **Zod**, manejo de errores centralizado con **AppError**, y logging profesional con **Winston + Morgan**, sobre la arquitectura en capas de la semana anterior.

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

##  Estructura del proyecto

```
starter/
├── package.json
├── tsconfig.json
├── pnpm-workspace.yaml
├── .env.example
└── src/
    ├── config/
    │   └── logger.ts                 # Winston + stream para Morgan
    ├── errors/
    │   └── AppError.ts               # Clase de error operacional
    ├── middlewares/
    │   ├── notFound.ts               # 404 para rutas no definidas
    │   └── errorHandler.ts           # Middleware de 4 parámetros
    ├── schemas/
    │   └── paciente.schema.ts        # Validaciones Zod (create/update/id)
    ├── repositories/
    │   └── pacientes.repository.ts
    ├── services/
    │   └── pacientes.service.ts      # Lanza AppError cuando no existe
    ├── controllers/
    │   └── pacientes.controller.ts   # next(err) en cada catch
    ├── routes/
    │   └── pacientes.routes.ts
    ├── types.ts
    ├── app.ts
    └── server.ts
```

##  Cómo correr el proyecto

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
## CAPTURAS DE PANTALLA

# Crea una request
![alt text](<Crea una request.png>)
# GET con ID
![alt text](<GET con ID no numerico.png>)
# GET con ID inexistente.
![alt text](<GET con ID inexistente.png>)
# GET con ID inexistente.
![alt text](<Ruta inexistente.png>) 


## Validación con Zod

### Schema de creación (`createPacienteSchema`)

| Campo | Validación |
|---|---|
| `nombre` | string, mínimo 1 carácter, sin espacios extremos |
| `tipoTratamiento` | uno de: `hemodialisis`, `dialisis_peritoneal`, `hemodiafiltracion` |
| `turno` | uno de: `mañana`, `tarde`, `noche` |
| `costoSesion` | número positivo |
| `diasPorSemana` | entero entre 1 y 7 |
| `activo` | booleano, por defecto `true` |

El schema de actualización (`updatePacienteSchema`) reutiliza el de creación con `.partial()`, haciendo todos los campos opcionales. El parámetro `:id` se valida con `z.coerce.number().int().positive()`.

## Manejo de errores

- **`AppError`** — clase con `statusCode` e `isOperational`, usada por el service cuando un paciente no existe (`404`).
- **`errorHandler`** — middleware de 4 parámetros, distingue:
  - `ZodError` → 400 con `issues[]`
  - `AppError` → el `statusCode` que traiga la instancia
  - Cualquier otro error → 500 genérico
- Todos los controladores usan `try/catch` con `next(err)` para delegar el manejo al `errorHandler`.

## Logging con Winston + Morgan

- Nivel `http` en desarrollo (muestra cada petición), `warn` en producción.
- Formato colorizado en desarrollo; JSON estructurado en producción.
- En producción, los errores también se guardan en `logs/error.log`.
- Morgan está conectado al stream de Winston, así cada petición HTTP queda registrada con el mismo formato que el resto de logs.
- `logger.info()` al arrancar el servidor; `logger.warn()` en cada `AppError` capturado por el `errorHandler`.

##  Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/v1/pacientes?page&limit` | Listar con paginación |
| GET | `/api/v1/pacientes/:id` | Obtener por id |
| POST | `/api/v1/pacientes` | Crear validando con Zod |
| PUT | `/api/v1/pacientes/:id` | Actualizar (campos opcionales) |
| DELETE | `/api/v1/pacientes/:id` | Eliminar |

##  Casos de prueba verificados

| Caso | Resultado |
|---|---|
| `POST` con body inválido (`{ "nombre": "" }`) | 400 con `issues[]` detallando cada campo faltante |
| `GET /:id` con id no numérico (`/abc`) | 400 con `issues[]` |
| `GET /:id` con id inexistente (`/999`) | 404 vía `AppError` |
| `GET` a ruta inexistente | 404 en JSON (no HTML) vía `notFound` |

## ✅ Cumplimiento de requisitos

| Requisito | Estado |
|---|---|
| Validación con Zod (create, update, id) | ✅ |
| `AppError` con `statusCode` e `isOperational` | ✅ |
| `errorHandler` de 4 parámetros distinguiendo ZodError/AppError/genérico | ✅ |
| `next(err)` en todos los controladores | ✅ |
| Logger Winston con niveles según entorno | ✅ |
| Morgan integrado con el stream de Winston | ✅ |
| Arquitectura en capas + paginación | ✅ |
| `pnpm build` sin errores TypeScript (modo estricto) | ✅ |

##  Autor

- **Nombre:** Julián Esneyde Machado Garzón
- **Ficha:** 3228973B
- **GitHub:** [@JulianMg20](https://github.com/JulianMg20)
- **Programa:** Análisis y Desarrollo de Software (ADSI)
- **Trimestre:** 5
- **Instructor:** Erick Granados
