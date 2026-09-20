#  Servidor Express CRUD — Centro de Diálisis

API REST construida con **Express 5 + TypeScript** que expone operaciones CRUD sobre pacientes de un centro de diálisis, usando un store en memoria.

## Dominio asignado
Centro de Diálisis

## Recurso principal: `Paciente`

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | `number` | Identificador único, asignado automáticamente por el store |
| `nombre` | `string` | Nombre completo del paciente |
| `tipoTratamiento` | `"hemodialisis" \| "dialisis_peritoneal" \| "hemodiafiltracion"` | Tipo de tratamiento de diálisis recibido |
| `turno` | `"mañana" \| "tarde" \| "noche"` | Turno asignado para las sesiones |
| `costoSesion` | `number` | Costo de cada sesión de tratamiento |
| `diasPorSemana` | `number` | Días a la semana que asiste a sesión |
| `activo` | `boolean` | Si el paciente continúa en tratamiento actualmente |

## 📁 Estructura del proyecto

```
starter/
├── package.json
├── tsconfig.json
├── .env.example
└── src/
    ├── app.ts                     # Middlewares + rutas
    ├── server.ts                  # Arranque del servidor + graceful shutdown
    ├── types.ts                   # Interfaz Paciente y DTOs
    ├── store.ts                   # CRUD en memoria
    └── routes/
        └── pacientes.routes.ts    # 5 endpoints CRUD
```

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

##   Endpoints

| Método | Ruta | Descripción | Status code |
|--------|------|-------------|-------------|
| GET | `/api/v1/pacientes` | Listar todos los pacientes | 200 |
| GET | `/api/v1/pacientes/:id` | Obtener un paciente por ID | 200 / 404 |
| POST | `/api/v1/pacientes` | Crear un nuevo paciente | 201 / 400 |
| PUT | `/api/v1/pacientes/:id` | Actualizar un paciente completo | 200 / 404 |
| DELETE | `/api/v1/pacientes/:id` | Eliminar un paciente | 204 / 404 |

### Ejemplo de body para POST / PUT

```json
{
  "nombre": "Sofia Mora",
  "tipoTratamiento": "hemodialisis",
  "turno": "tarde",
  "costoSesion": 180000,
  "diasPorSemana": 3,
  "activo": true
}
```

##   Middlewares (en orden de registro)

1. **`express.json()`** — parsea el body de las peticiones entrantes
2. **Logger personalizado** — registra método, ruta, status code y tiempo de respuesta de cada petición
3. **Rutas** (`/api/v1/pacientes`)
4. **Handler 404** — captura cualquier ruta no definida
5. **Error handler global** — middleware de 4 parámetros, siempre al final, captura errores no manejados

##   Store en memoria

El store (`store.ts`) mantiene los pacientes en un arreglo en memoria (sin base de datos) y expone:

- `getAll()` — retorna todos los pacientes
- `getById(id)` — retorna un paciente o `undefined`
- `create(data)` — agrega un paciente nuevo, asignando el `id` con un contador independiente (`nextId`) para evitar colisiones tras eliminar registros
- `update(id, data)` — reemplaza un paciente existente o retorna `undefined`
- `remove(id)` — elimina un paciente y retorna `true`/`false` según si existía

##   Graceful shutdown

El servidor escucha las señales `SIGINT` y `SIGTERM` para cerrar las conexiones activas antes de terminar el proceso, evitando cortar peticiones en curso.

##   Pruebas

Las 5 operaciones se probaron con **Thunder Client**, verificando tanto los casos exitosos como los de error (ID inexistente → 404).

## Capturas de pantalla

## pruebas de las operaciones CRUD

### Prueba POST (crear paciente)
![alt text](<Prueba POST (crear paciente).png>)

### Prueba PUT (actualizar paciente)
![alt text](<Prueba PUT (actualizar paciente).png>) 

### Prueba DELETE (eliminar paciente)
![alt text](<Prueba PUT a un ID inexistente (caso de error).png>)

### Prueba DELETE (eliminar paciente)
![alt text](<Prueba DELETE.png>) 

### Prueba DELETE a un ID inexistente (caso de error)
![alt text](<Prueba DELETE a un ID inexistente.png>) 



## ✅ Cumplimiento de requisitos

| Requisito | Estado |
|---|---|
| 5 endpoints CRUD con status codes correctos | ✅ |
| Middlewares en el orden correcto | ✅ |
| Store en memoria con las 5 operaciones | ✅ |
| Graceful shutdown (SIGTERM + SIGINT) | ✅ |
| `pnpm build` sin errores TypeScript (modo estricto) | ✅ |

## 👤 Autor

- **Nombre:** Julián Esneyde Machado Garzón
- **Ficha:** 3228973B
- **GitHub:** [@JulianMg20](https://github.com/JulianMg20)
- **Programa:** Análisis y Desarrollo de Software (ADSI)
- **Trimestre:** 5
- **Instructor:** Erick Granados
- **Motor de base de datos (este trimestre):** SQLite