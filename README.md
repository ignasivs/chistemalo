# 😅 Chiste malo del día

Web de [chistemalo.com](https://chistemalo.com): un chiste malo distinto cada día, sin repetirse, con archivo de días anteriores, categorías y una API pública.

- **Sin servidor ni base de datos.** Es una web estática generada con [Astro](https://astro.build) y publicada en GitHub Pages.
- **Los chistes viven en un fichero JSON** dentro del repo.
- **El chiste cambia solo cada día** gracias a una recompilación nocturna con GitHub Actions.

## Cómo funciona

1. Los chistes están en `src/data/chistes.json`, en el orden en que se van a publicar.
2. El chiste de cada día se calcula por posición: días transcurridos desde `FECHA_INICIO` (en `src/utils/chiste.ts`), contados con la zona horaria de Madrid, módulo el número de chistes. Al llegar al final de la lista, vuelve a empezar.
3. Astro genera todas las páginas estáticas durante la compilación, así que el chiste queda fijado en ese momento. Por eso el workflow recompila la web cada noche.

## Estructura

```
.github/workflows/deploy.yml   Compila y publica en GitHub Pages (en cada push y cada noche)
public/                        favicon.svg, robots.txt
src/
  data/chistes.json            Lista de chistes (id, texto, categoria)
  data/categorias.ts           Título y texto introductorio de cada categoría
  utils/chiste.ts              Lógica: chiste del día, categorías, archivo, slugs
  layouts/Layout.astro         Cabecera, menú, pie, SEO y analítica
  components/Compartir.astro   Botones de compartir (WhatsApp, X, copiar)
  pages/
    index.astro                Portada con el chiste del día
    chistes-anteriores.astro   Chistes de los días anteriores
    categorias.astro           Índice de categorías
    categoria/[categoria].astro  Una página por categoría
    chiste/[slug].astro        Una página por chiste
    api/hoy.json.ts            Endpoint del chiste del día
    404.astro                  Página de error
```

## Añadir chistes

Edita `src/data/chistes.json` y añade el chiste **al final** de la lista:

```json
{
  "id": 81,
  "texto": "¿Qué le dice un techo a otro techo? Techo de menos.",
  "categoria": "juegos de palabras"
}
```

Reglas para no romper nada:

- **Añade siempre al final.** El orden del fichero es el orden de publicación; si insertas chistes en medio, cambias los de días ya pasados y los próximos.
- **El `id` debe ser único.** Usa el siguiente número libre.
- **Evita repetir categoría seguida,** ni entre dos chistes consecutivos ni entre el último y el primero de la lista (al dar la vuelta).
- **No cambies el texto de un chiste ya publicado.** Su dirección (`/chiste/<slug>/`) se genera con sus primeras palabras, y cambiarla rompe los enlaces existentes.
- **Categoría nueva:** añade su título y su introducción en `src/data/categorias.ts` (la clave es la categoría sin tildes y con guiones, por ejemplo `juegos-de-palabras`). Las categorías con menos de 3 chistes llevan `noindex` para no ser indexadas.

Con N chistes, la lista dura N días antes de repetirse. Conviene ampliarla con antelación.

## API

Devuelve el chiste del día en JSON.

```
GET https://chistemalo.com/api/hoy.json
```

```json
{
  "fecha": "2026-10-16",
  "id": 12,
  "texto": "¿Qué le dice un techo a otro techo? Techo de menos.",
  "categoria": "juegos de palabras",
  "url": "https://chistemalo.com/chiste/que-le-dice-un-techo-a-otro-techo/"
}
```

Es un fichero estático: se actualiza con la recompilación nocturna (poco después de las 00:00 hora de España).

## Desarrollo en local

Requisitos: Node.js 22 y Git.

```bash
npm install
npm run dev       # servidor de desarrollo en http://localhost:4321
npm run build     # compila a ./dist
npm run preview   # sirve la compilación para revisarla
```

## Despliegue

- Cada `push` a `main` compila y publica la web con GitHub Actions (`.github/workflows/deploy.yml`).
- Además, una tarea programada la recompila cada noche (22:05 y 23:05 UTC) para que cambie el chiste del día. Las dos horas cubren el cambio entre horario de verano e invierno.
- GitHub desactiva las tareas programadas de un repo público tras 60 días sin actividad: conviene hacer algún commit de vez en cuando.
- Si falla el despliegue, GitHub avisa por correo (si están activadas las notificaciones de Actions).

## Dominios

- **Principal:** `chistemalo.com` (apuntado a GitHub Pages con registros A, AAAA y CNAME para `www`).
- **Redirecciones 301** hacia el principal: `chistemalo.es` y `chistemalo.net`.

## Analítica y SEO

- [Umami Cloud](https://umami.is), sin cookies. Eventos personalizados: `compartir` (con la red: whatsapp, x o copiar), `chiste-visto` (con la categoría) y `error-404` (con la ruta).
- Sitemap generado con `@astrojs/sitemap` (`/sitemap-index.xml`) y `public/robots.txt`.
- Propiedades verificadas en Google Search Console y Bing Webmaster Tools.

## Licencia

El código se distribuye bajo licencia MIT (ver `LICENSE`). Los textos de los chistes no se incluyen en esa licencia.
