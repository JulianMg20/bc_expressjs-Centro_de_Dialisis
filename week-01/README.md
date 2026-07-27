# git init

CLI construida con **Node.js + TypeScript** que lee, filtra y genera reportes sobre pacientes de un centro de dialisis.

## Dominio asignado
Centro de Diálisis

## Recurso principal: `Paciente`

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | `number` | Identificador único del paciente |
| `nombre` | `string` | Nombre completo del paciente |
| `tipoTratamiento` | `"hemodialisis" \| "dialisis_peritoneal" \| "hemodiafiltracion"` | Tipo de tratamiento de dialisis recibido |
| `turno` | `"mañana" \| "tarde" \| "noche"` | Turno asignado para las sesiones |
| `costoSesion` | `number` | Costo de cada sesión de tratamiento |
| `diasPorSemana` | `number` | Días a la semana que asiste a sesión |
| `activo` | `boolean` | Si el paciente continúa en tratamiento actualmente |

## 📁 Estructura del proyecto

```
starter/
├── data/
│   └── pacientes.json      # datos de entrada (11 registros)
├── output/
│   └── report.json         # reporte generado
├── src/
│   ├── types.ts             # interfaces Paciente y ResumenCatalogo
│   ├── lector.ts             # lectura del JSON con fs/promises
│   ├── resumen.ts            # cálculo de totales, promedio y extremos
│   ├── argumentos.ts         # parseo de --category desde process.argv
│   ├── reporte.ts            # escritura del reporte final
│   └── index.ts              # punto de entrada, ensambla todo
├── package.json
└── tsconfig.json
```

## 🚀 Cómo correr el proyecto

```bash
pnpm install
pnpm dev                              # sin filtro — muestra todos los pacientes
pnpm dev -- --category hemodialisis   # filtra por tipo de tratamiento
```

Para la versión compilada:

```bash
pnpm build
pnpm start
```

## 🔎 Categorías disponibles para `--category`
- `hemodialisis`
- `dialisis_peritoneal`
- `hemodiafiltracion`

##  Manejo de errores

- Si `data/pacientes.json` no existe, la herramienta muestra un error descriptivo y termina con `process.exit(1)`.
- Si la categoría indicada en `--category` no existe, muestra una advertencia con las categorías disponibles y continúa mostrando el resumen completo sin filtrar.

##  Salida

El reporte se genera en `output/report.json`, con esta estructura:

```json
{
  "generadoEn": "fecha ISO",
  "resumen": { "totalPacientes": 0, "activos": 0, "inactivos": 0, "costoPromedio": 0, "tratamientoMasCaro": {}, "tratamientoMasBarato": {} },
  "pacientesFiltrados": []
}
```

## Cumplimiento de requisitos

| Requisito | Estado |
|---|---|
| Lee datos desde JSON (`fs/promises`) | ✅ |
| Resumen del catálogo (total, activos/inactivos, promedio, extremos) | ✅ |
| Filtro por `--category` | ✅ |
| Genera `output/report.json` | ✅ |
| Manejo de errores (archivo no encontrado / categoría inexistente) | ✅ |
| `pnpm build` sin errores TypeScript (modo estricto) | ✅ |

##  Autor
 
- **Nombre:** Julián Esneyde Machado Garzón
- **Ficha:** 3228973B
- **GitHub:** [@JulianMg20](https://github.com/JulianMg20)
- **Proyecto:** SENA - Análisis y Desarrollo de Software
- **Trimestre:** 5
- **Instructor:** Erick Granados