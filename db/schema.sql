-- CodiSalud · esquema PostgreSQL (fase con servidor). Equivale al modelo de data/*.json más cuentas, intentos y comparación.
-- Pensado para Supabase/PostgreSQL: las políticas RLS implementan «solo ve quien comparte; el profesor ve a todos».
CREATE TYPE rol_usuario AS ENUM ('root','profesor','usuario','invitado');
CREATE TYPE tipo_pregunta AS ENUM ('mc','multi','vf','code','match');
CREATE TABLE manuales   (id text PRIMARY KEY, titulo text NOT NULL, archivo text, paginas int);
CREATE TABLE fuentes    (id text PRIMARY KEY, tipo text CHECK (tipo IN ('sesion','unidad')), titulo text NOT NULL, orden int, hue int);
CREATE TABLE temas      (id serial PRIMARY KEY, fuente_id text REFERENCES fuentes, nombre text UNIQUE NOT NULL);
CREATE TABLE preguntas  (id int PRIMARY KEY, tema_id int REFERENCES temas, tipo tipo_pregunta NOT NULL, dificultad smallint CHECK (dificultad BETWEEN 1 AND 4),
  enunciado text NOT NULL, explicacion text, referencia text, pistas jsonb NOT NULL DEFAULT '[]' CHECK (jsonb_array_length(pistas)=3),
  media jsonb DEFAULT '[]', version int NOT NULL DEFAULT 1, estado text NOT NULL DEFAULT 'publicada', actualizado timestamptz DEFAULT now());
CREATE TABLE opciones   (id int PRIMARY KEY, pregunta_id int REFERENCES preguntas ON DELETE CASCADE, orden int, texto text NOT NULL, es_correcta boolean NOT NULL, UNIQUE (pregunta_id, orden));
CREATE TABLE pares_relacion (id int PRIMARY KEY, pregunta_id int REFERENCES preguntas ON DELETE CASCADE, orden int, izquierda text, derecha text NOT NULL); -- izquierda NULL = opción sobrante
CREATE TABLE soluciones_codigo (pregunta_id int PRIMARY KEY REFERENCES preguntas ON DELETE CASCADE, dp text, ds jsonb DEFAULT '[]', alt_dp jsonb, alt_ds jsonb, patron_dp text);
CREATE TABLE pregunta_codigo   (pregunta_id int REFERENCES preguntas ON DELETE CASCADE, codigo text, rol text CHECK (rol IN ('dp','ds','morfologia')), PRIMARY KEY (pregunta_id,codigo,rol));
CREATE TABLE referencias (pregunta_id int REFERENCES preguntas ON DELETE CASCADE, orden int, manual_id text REFERENCES manuales, seccion text, pagina int NOT NULL, pagina_fin int, PRIMARY KEY (pregunta_id,orden));
-- Conocimiento (propuesta «Banco de Conocimiento»): teoría, glosario y enlaces vinculados a temas/manuales.
CREATE TABLE conocimiento (id serial PRIMARY KEY, tema_id int REFERENCES temas, tipo text CHECK (tipo IN ('teoria','glosario','enlace')), titulo text NOT NULL, contenido text, url text, manual_id text REFERENCES manuales, pagina int,
  tsv tsvector GENERATED ALWAYS AS (to_tsvector('spanish', coalesce(titulo,'')||' '||coalesce(contenido,''))) STORED);
CREATE INDEX ON conocimiento USING gin(tsv);
-- Personas
CREATE TABLE usuarios (id text PRIMARY KEY, nombre text NOT NULL, rol rol_usuario NOT NULL DEFAULT 'usuario', email_hash text, avatar text, comparte boolean NOT NULL DEFAULT false,
  must_change boolean NOT NULL DEFAULT false, desactivado boolean NOT NULL DEFAULT false, creado timestamptz DEFAULT now(), ultimo_acceso timestamptz); -- la clave la gestiona el proveedor de autenticación (nunca en claro)
CREATE TABLE solicitudes_acceso (id serial PRIMARY KEY, usuario_deseado text, email text, origen text, uso text, consentimiento boolean NOT NULL CHECK (consentimiento), creada timestamptz DEFAULT now(), estado text DEFAULT 'pendiente');
CREATE TABLE restablecimientos (token_hash text PRIMARY KEY, usuario_id text REFERENCES usuarios, etapa char(1) CHECK (etapa IN ('A','B')), caduca timestamptz NOT NULL); -- un solo uso: se borra al consumirse
-- Evaluación
CREATE TABLE intentos (id bigserial PRIMARY KEY, usuario_id text REFERENCES usuarios ON DELETE CASCADE, inicio timestamptz NOT NULL, segundos int, modo text, preguntas int, aciertos int, nota numeric(4,1));
CREATE TABLE respuestas_intento (intento_id bigint REFERENCES intentos ON DELETE CASCADE, pregunta_id int REFERENCES preguntas, version int, enunciado_snapshot text, respuesta jsonb, puntuacion numeric(4,2), PRIMARY KEY (intento_id,pregunta_id));
CREATE INDEX ON intentos (usuario_id, inicio DESC);
-- Comparación: solo quien comparte (y el propio usuario); profesor/root ven todo.
CREATE VIEW v_comparativa AS SELECT u.id, u.nombre, u.avatar, count(i.*) intentos, round(avg(i.nota),1) nota_media, round(sum(i.aciertos)::numeric/NULLIF(sum(i.preguntas),0)*100) pct_acierto, max(i.inicio) ultimo
  FROM usuarios u LEFT JOIN intentos i ON i.usuario_id=u.id GROUP BY u.id;
ALTER TABLE intentos ENABLE ROW LEVEL SECURITY;
CREATE POLICY ver_intentos ON intentos FOR SELECT USING (usuario_id = current_setting('app.user_id',true)
  OR EXISTS (SELECT 1 FROM usuarios u WHERE u.id=intentos.usuario_id AND u.comparte)
  OR EXISTS (SELECT 1 FROM usuarios v WHERE v.id=current_setting('app.user_id',true) AND v.rol IN ('root','profesor')));
