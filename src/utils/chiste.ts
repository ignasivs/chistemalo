import chistes from "../data/chistes.json";

// Primer día en el que se muestra el primer chiste (formato AAAA-MM-DD)
const FECHA_INICIO = "2026-10-10";

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

export function chisteDelDia(fecha: string = fechaEnMadrid()) {
  const dias = diasDesde(FECHA_INICIO, fecha);
  const n = chistes.length;
  const indice = ((dias % n) + n) % n; // al acabar la lista vuelve a empezar
  return { fecha, chiste: chistes[indice] };
}
