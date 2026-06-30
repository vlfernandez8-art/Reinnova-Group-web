# Reinnova Group Web

Sitio institucional de Reinnova Group con módulo interactivo de auto-diagnóstico empresarial. La aplicación presenta el ecosistema de soluciones SaaS de Reinnova Group y permite que una empresa complete un diagnóstico de madurez operativa, visualice impacto económico estimado y envíe automáticamente un reporte interno por email.

## Tecnologías

- Next.js 14 con App Router
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- React Hook Form
- Zod
- Lucide React
- jsPDF y jsPDF AutoTable
- Resend para envío de reportes por email

## Requisitos

- Node.js 18 o superior
- npm
- Cuenta de Resend con dominio verificado para envío de reportes

## Instalación

```bash
npm install
```

Crear las variables de entorno a partir del ejemplo:

```bash
cp .env.example .env.local
```

Configurar:

```env
NEXT_PUBLIC_WHATSAPP_NUMBER=5492995201981
NEXT_PUBLIC_EMAIL_CONTACTO=administracion@reinnova.com.ar
NEXT_PUBLIC_SITE_URL=https://www.reinnovagroup.com.ar
RESEND_API_KEY=tu_api_key_de_resend
RESEND_FROM_EMAIL=Reinnova Diagnostico <administracion@reinnovagroup.com.ar>
```

## Desarrollo

```bash
npm run dev
```

Por defecto Next.js levanta en `http://localhost:3000`. Para usar el puerto local empleado durante desarrollo:

```bash
npm run dev -- -p 5178
```

## Build

```bash
npm run build
```

## Producción

```bash
npm run start
```

## Deploy en Vercel

El proyecto está preparado para Vercel. Configurar en el panel del proyecto las mismas variables de entorno indicadas en `.env.example`.

Comando de build:

```bash
npm run build
```

Comando de instalación:

```bash
npm install
```

## Módulo de diagnóstico

Ruta principal:

```text
/diagnostico
```

El flujo incluye:

- Datos de empresa y contacto
- Rubro y perfil de madurez declarado
- Banco de preguntas dinámicas por rubro
- Cuantificación económica
- Resultados con nivel de madurez, impacto estimado y puntos de dolor
- Envío automático de reporte PDF interno vía Resend
- CTAs a WhatsApp para diagnóstico profesional y servicios

## MÃ³dulo de Eventos y acceso interno

Se agregÃ³ la secciÃ³n de eventos en la home y un panel interno para cargar capacitaciones.

Rutas sugeridas:

- Home: secciÃ³n `Eventos` integrada en `src/app/page.tsx` y ruta `/eventos`.
- Login interno: `/soy-reinnova/login`.
- Admin eventos: `/soy-reinnova/admin/eventos`.
- Crear/editar: `/soy-reinnova/admin/eventos/nuevo`, `/soy-reinnova/admin/eventos/:id`.
- Inscriptos: `/soy-reinnova/admin/eventos/:id/inscriptos`.
- CSV: descarga directa desde ese bloque (`/api/admin/events/:id/registrations/csv`).

Variables nuevas:

- `ADMIN_EMAILS`
- `ADMIN_TEMP_PASSWORD`
- `ADMIN_SESSION_TTL_SECONDS`
- `ADMIN_PASSWORD_PEPPER` (opcional)

Para probar:

1. Levantar con `npm run dev -- --port 5185`.
2. Ingresar a `/soy-reinnova/login` con cualquiera de los mails de `ADMIN_EMAILS` y `ADMIN_TEMP_PASSWORD`.
3. Crear una capacitaciÃ³n en borrador y luego publicarla.
4. Probar inscripciÃ³n desde home o `/eventos`.

## Reinnova Group

Reinnova Group desarrolla plataformas SaaS y automatizaciones para mejorar la eficiencia operativa en contabilidad, obra, campo y talento. El sitio integra el ecosistema de soluciones Reinnova Group con un diagnóstico inicial orientado a detectar oportunidades de mejora y priorizar implementación.

Soluciones destacadas:

- Contannova
- Infrannova
- Sitennova
- Safennova
- Diagnóstico empresarial
- Implementación acompañada con alianza Reinnova Consulting
