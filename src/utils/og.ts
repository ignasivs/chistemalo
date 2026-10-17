import { Resvg } from "@resvg/resvg-js";
import { readFileSync } from "node:fs";
import satori from "satori";

const fuente = (peso: number) =>
  readFileSync(
    `node_modules/@fontsource/nunito/files/nunito-latin-${peso}-normal.woff`,
  );

const fuentes = [
  {
    name: "Nunito",
    data: fuente(700),
    weight: 700 as const,
    style: "normal" as const,
  },
  {
    name: "Nunito",
    data: fuente(800),
    weight: 800 as const,
    style: "normal" as const,
  },
];

const NARANJA = "#ff6b35";
const TEXTO = "#2b2118";
const SUAVE = "#7a6a5a";
const FONDO = "linear-gradient(135deg, #fff8ec 0%, #ffe2b8 100%)";

// Pequeño ayudante para describir elementos sin necesidad de JSX
const el = (
  type: string,
  style: Record<string, unknown>,
  children?: unknown,
) => ({
  type,
  props: { style, children },
});

const titulo = (tamano: number) =>
  el(
    "div",
    {
      display: "flex",
      gap: tamano * 0.28,
      fontSize: tamano,
      fontWeight: 800,
      color: TEXTO,
    },
    [
      el("div", { display: "flex" }, "Chiste malo"),
      el("div", { display: "flex", color: NARANJA }, "del día"),
    ],
  );

function tarjetaPortada() {
  const carita = el(
    "div",
    {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 22,
      width: 190,
      height: 190,
      borderRadius: 95,
      background: NARANJA,
    },
    [
      el("div", { display: "flex", gap: 46 }, [
        el("div", {
          display: "flex",
          width: 20,
          height: 20,
          borderRadius: 10,
          background: "#2b2118",
        }),
        el("div", {
          display: "flex",
          width: 20,
          height: 20,
          borderRadius: 10,
          background: "#2b2118",
        }),
      ]),
      el("div", {
        display: "flex",
        width: 84,
        height: 40,
        borderBottom: "12px solid #2b2118",
        borderRadius: "0 0 84px 84px",
      }),
    ],
  );

  return el(
    "div",
    {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 34,
      width: 1200,
      height: 630,
      background: FONDO,
      fontFamily: "Nunito",
    },
    [
      carita,
      titulo(100),
      el(
        "div",
        { display: "flex", fontSize: 38, fontWeight: 700, color: SUAVE },
        "Un chiste malo nuevo cada día",
      ),
      el(
        "div",
        { display: "flex", fontSize: 34, fontWeight: 800, color: NARANJA },
        "chistemalo.com",
      ),
    ],
  );
}

function tamanoTexto(largo: number): number {
  if (largo <= 60) return 76;
  if (largo <= 100) return 64;
  if (largo <= 140) return 54;
  return 44;
}

function tarjetaChiste(texto: string, categoria: string) {
  // Sin relleno (padding) en ningún contenedor: el margen se consigue centrando
  // una caja interior de tamaño fijo (1200 - 2*64 = 1072; 630 - 2*64 = 502).
  // Así el resultado es el mismo aunque satori calcule el relleno de otra forma.
  const interior = el(
    "div",
    {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      width: 1072,
      height: 502,
    },
    [
      // Arriba: título
      el("div", { display: "flex" }, [titulo(36)]),
      // Centro: texto del chiste
      el(
        "div",
        {
          display: "flex",
          flex: 1,
          alignItems: "center",
          fontSize: tamanoTexto(texto.length),
          fontWeight: 800,
          lineHeight: 1.25,
          color: TEXTO,
        },
        texto,
      ),
      // Abajo: web y categoría, alineadas a la izquierda
      el("div", { display: "flex", alignItems: "center", gap: 18 }, [
        el(
          "div",
          { display: "flex", fontSize: 32, fontWeight: 700, color: SUAVE },
          "chistemalo.com",
        ),
        el(
          "div",
          { display: "flex", fontSize: 32, fontWeight: 700, color: SUAVE },
          "·",
        ),
        el(
          "div",
          { display: "flex", fontSize: 32, fontWeight: 800, color: NARANJA },
          categoria,
        ),
      ]),
    ],
  );

  return el(
    "div",
    {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: 1200,
      height: 630,
      background: FONDO,
      fontFamily: "Nunito",
    },
    [interior],
  );
}

async function aPng(arbol: unknown) {
  const svg = await satori(arbol as any, {
    width: 1200,
    height: 630,
    fonts: fuentes,
  });
  // Se copia a un Uint8Array "limpio" para que TypeScript lo acepte como cuerpo de Response
  return new Uint8Array(new Resvg(svg).render().asPng());
}

export const pngPortada = () => aPng(tarjetaPortada());
export const pngChiste = (texto: string, categoria: string) =>
  aPng(tarjetaChiste(texto, categoria));
