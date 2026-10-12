import chistesJson from "../data/chistes.json";

export const SITIO = "https://chistemalo.com";

// Primer día en el que se muestra el primer chiste (formato AAAA-MM-DD)
export const FECHA_INICIO = "2026-10-10";

export interface Chiste {
  id: number;
  texto: string;
  categoria: string;
  slug: string;
  catSlug: string;
}

export function slugify(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const usados = new Set<string>();

export const chistes: Chiste[] = chistesJson.map((c) => {
  let slug = slugify(c.texto).split("-").slice(0, 8).join("-");
  if (usados.has(slug)) slug = `${slug}-${c.id}`;
  usados.add(slug);
  return { ...c, slug, catSlug: slugify(c.categoria) };
});

export function categorias() {
  const mapa = new Map<
    string,
    { nombre: string; slug: string; chistes: Chiste[] }
  >();
  for (const c of chistes) {
    if (!mapa.has(c.catSlug))
      mapa.set(c.catSlug, {
        nombre: c.categoria,
        slug: c.catSlug,
        chistes: [],
      });
    mapa.get(c.catSlug)!.chistes.push(c);
  }
  return [...mapa.values()].sort((a, b) => b.chistes.length - a.chistes.length);
}

// "¿Qué le dice un techo a otro techo?" (sin revelar el remate)
export function tituloDelChiste(texto: string): string {
  const i = texto.indexOf("?");
  const base = i > 0 && i < 90 ? texto.slice(0, i + 1) : texto;
  return base.length > 80 ? base.slice(0, 77).trimEnd() + "…" : base;
}

export function resumen(texto: string, max = 155): string {
  return texto.length > max ? texto.slice(0, max - 1).trimEnd() + "…" : texto;
}

// Fecha de hoy en España (AAAA-MM-DD), da igual la zona horaria del servidor
export function fechaEnMadrid(ahora: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Madrid" }).format(
    ahora,
  );
}

function diasDesde(inicio: string, fecha: string): number {
  const [y1, m1, d1] = inicio.split("-").map(Number);
  const [y2, m2, d2] = fecha.split("-").map(Number);
  return Math.round(
    (Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 86400000,
  );
}

function sumarDias(fecha: string, dias: number): string {
  const [y, m, d] = fecha.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + dias)).toISOString().slice(0, 10);
}

function indiceDelDia(fecha: string): number {
  const n = chistes.length;
  return ((diasDesde(FECHA_INICIO, fecha) % n) + n) % n; // al acabar la lista vuelve a empezar
}

export function chisteDelDia(fecha: string = fechaEnMadrid()) {
  return { fecha, chiste: chistes[indiceDelDia(fecha)] };
}

// Chistes de los días anteriores a hoy (como máximo una vuelta completa)
export function chistesAnteriores(hoy: string = fechaEnMadrid()) {
  const dias = diasDesde(FECHA_INICIO, hoy);
  const lista: { fecha: string; chiste: Chiste }[] = [];
  for (let k = 1; k <= Math.min(dias, chistes.length); k++) {
    const fecha = sumarDias(hoy, -k);
    lista.push({ fecha, chiste: chistes[indiceDelDia(fecha)] });
  }
  return lista;
}
