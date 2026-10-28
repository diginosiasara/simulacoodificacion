# Simulacro CIE-10-ES

Abre `index.html` con doble clic (no necesita servidor ni instalación).

## Responsabilidades
| Capa | Archivos | Qué hace |
|---|---|---|
| Estructura | `index.html` | Solo el esqueleto y el orden de carga |
| Estilo | `css/*.css` | `tokens` (colores/temas) → `base` → `components` → `temas` → `exam` → `dashboard` → `responsive` → `config` (el orden importa) |
| Datos | `data/banco.js`, `data/*.json`, `assets/img/` | Banco de preguntas en forma relacional |
| Acceso a datos | `js/data/repo.js` | Único archivo que conoce la forma de los datos |
| Dominio | `js/domain/` | Catálogo, puntuación, dificultad adaptativa, selección |
| Persistencia | `js/core/storage.js`, `backup.js` | localStorage y export/import JSON |
| Interfaz | `js/ui/`, `js/views/`, `js/app.js` | Componentes, vistas y eventos |

## Modelo de datos (alineado con el informe de diseño lógico)
`fuentes` (Sesión/Unidad) → `temas` → `preguntas` → `opciones`
+ `soluciones_codigo` (DP/DS esperados) y `pregunta_codigo` (relación N:M pregunta ↔ código CIE).
Cada pregunta lleva `version` y `estado`. Los `.json` tienen una fila por registro y las mismas claves
que las columnas, así que se pueden importar tal cual a PostgreSQL/SQLite.

## Añadir una pregunta
1. Añade el registro en `preguntas` (con su `tema_id`) y sus filas en `opciones` dentro de `data/banco.js`.
2. Si es de tipo `code`, añade su fila en `soluciones_codigo`.
No hay que tocar JavaScript.

## Compatibilidad
Se conservan las claves de localStorage (`sim_rec`, `sim_fail`) y el `id` de cada pregunta:
el progreso guardado con la versión anterior sigue funcionando.

## Contenido actual
279 preguntas: Sesión 1, Sesión 3, Unidades 1-3 y **Sesión 4** (74 preguntas: diabetes, tiroides, salud mental y
sustancias, renal y urinario, genitales y mama, método). Cada pregunta cita su fuente en `referencia`
(`sesion4.docx · §…` y/o `UAX UF4 pág. …`). Para añadir una fuente nueva basta con una fila en `fuentes`
(con su `hue`) y añadir su color en `css/temas.css`; los botones de «Solo Sesión N» se generan solos.
