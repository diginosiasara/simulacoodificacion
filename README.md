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

## Modelo de datos (ampliado)
`fuentes → temas → preguntas → opciones`, `soluciones_codigo`, `pregunta_codigo` y, nuevas:
`manuales` (UF1-UF4 con título y nº de páginas), `referencias` (pregunta → manual, apartado, página/rango)
y `pares_relacion` (pares término↔descripción del tipo «relacionar»; `izquierda` nula = opción sobrante).
Cada pregunta lleva 3 pistas (`pistas`) de menos a más reveladoras.

## Tipos de ejercicio
Selección única, múltiple, verdadero/falso, codificación (DP/DS/morfología) y **relacionar columnas**
(pulsa un término y su pareja; puntuación parcial; cada enlace erróneo resta ⅓ del valor de un par).

## Contenido actual
308 preguntas (Sesiones 1, 3 y 4; Unidades 1-3), 21 de ellas de relacionar. Cada una cita el manual UAX
(UF1-UF4) con apartado y página, además de su apunte de origen. Las referencias se localizaron por
similitud de texto con el PDF: conviene revisarlas.

## Marca, licencia y datos legales
Se editan en `js/config/legal.js` (los campos vacíos no se muestran). Pendientes de completar antes de
publicar: correo de contacto, domicilio y NIF/CIF del titular. `LICENSE`: todos los derechos reservados.

## Criterio del profesor (clase del 27-oct-2026)
No hace falta memorizar códigos: en el examen se evalúa terminología y método de búsqueda.

## Cuentas y datos (modo local, sin servidor)
Roles: **Super usuario** (gestiona usuarios), **Profesor** (ve el progreso de todos), **Alumno** e **Invitado** (pide nombre o nick).
Las claves se guardan solo como hash PBKDF2-SHA256 con sal; la política exige 8+ caracteres con mayúsculas, minúsculas y números, sin caracteres seguidos.
Noelia debe cambiar su clave temporal al entrar. Recuperación: aviso por correo → enlace de confirmación (un solo uso, 30 min) → enlace protegido (15 min).
Solicitud de usuario: formulario (usuario, correo, cómo conoció la app, para qué la usará, consentimiento) a `mailAdmin`.
Comparar: solo ven a quien comparte (el Profesor y el Super usuario, a todos); entre dispositivos se intercambian archivos de progreso compartido.
Foto: se recorta y reduce sola a 100-300 px (WebP/JPEG), sin límite al subirla.
**Limitación**: al ser una web estática, las cuentas y los enlaces de recuperación solo valen en el navegador donde se crean y el control de acceso no equivale a seguridad de servidor. Ver `docs/PUBLICAR.md` y `db/schema.sql`.

## Documentación
`docs/modelo-conocimiento.md`, `docs/PUBLICAR.md`, `db/schema.sql`, `tools/hash-user.js`.
