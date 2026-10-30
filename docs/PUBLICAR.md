# Publicar y comprobar
1. Sube la carpeta al repositorio `diginosiasara/simulacoodificacion` y activa **Settings → Pages** (rama `main`, carpeta raíz). Es https, requisito del cifrado de claves.
2. Abre la URL y recorre: vídeo de entrada (PC y móvil), acceso, simulacro, banco, corrección, pistas, relacionar, progreso, comparar, Mi cuenta, cambio de tema, exportar/importar.
3. Completa en `js/config/legal.js`: domicilio y NIF/CIF (aviso legal) y, si quieres correos automáticos, `mailEndpoint`.
4. Para cambiar claves del archivo de usuarios: `node tools/hash-user.js <usuario> <rol> <correo> [--temporal]` y pega la salida en `data/usuarios.js`.
5. Cuentas compartidas entre dispositivos, correos con enlace que funcionen desde cualquier equipo y progreso comparado en vivo requieren servidor: usa `db/schema.sql` (p. ej. en Supabase) y sustituye `js/core/auth.js` por su cliente.
