# App municipal

Directorio de negocios con mapa, noticias y eventos, y avisos parroquiales. Flutter + Strapi.

## Estructura
- `backend/` Strapi 5 (API y panel de administración)
- `app/` Flutter (Android primero)

## Arranque del backend
1. Copia estos archivos sobre tu proyecto (`backend/src/api`, `backend/src/index.ts`).
2. `cd backend && npm run develop`
3. En el primer arranque se cargan las 14 categorías con sus subcategorías y se abre la lectura pública de Negocio, Categoría, Noticia y Aviso parroquial.

## Rol Capturista (se crea a mano en el panel)
En Settings > Administration Panel > Roles, crea «Capturista» con crear/leer/actualizar sobre Negocio, Noticia y Aviso parroquial, sin borrar ni publicar negocios, y sin acceso a usuarios, roles ni configuración.

## Seguridad
Nunca subas `.env`, tokens ni documentos de consentimiento. El consentimiento se guarda como folio de referencia; el archivo vive fuera del repo.
