# Banco de Conocimiento: cómo encaja con CodiSalud

| Propuesta del informe | En CodiSalud | Estado |
|---|---|---|
| `modules` | `manuales` (UF1-UF4) y `fuentes` (Sesión 1/3/4, Unidades 1-3) | hecho |
| `topics` | `temas` | hecho |
| `exercises` (polimórfico) | `preguntas` + `tipo` (mc, multi, vf, code, **match**) | hecho |
| `hints` JSONB | `preguntas.pistas` (siempre 3) | hecho |
| `reference_page` | `referencias` (manual, apartado, página/rango) | hecho |
| `exercise_options` / `matching_columns` | `opciones` / `pares_relacion` | hecho |
| `exercise_solutions` | `soluciones_codigo` (DP/DS/morfología) + `explicacion` | hecho |
| `user_progress` | `intentos` + `respuestas_intento` (ver `db/schema.sql`); en local, `cs:<usuario>:rec` | local hecho; servidor pendiente |
| `knowledge_items` (teoría, glosario, enlaces) | tabla `conocimiento` en `db/schema.sql` | **sin datos todavía** |

Diferencias deliberadas: la solución se valida con tolerancia (alternativas de código y morfología),
cada intento guarda una copia del enunciado y la versión (el historial no cambia al editar el banco)
y el progreso se calcula, no se almacena.

Siguiente paso natural: cargar los glosarios de los PDF en `conocimiento` y enlazar cada término con su apartado.
