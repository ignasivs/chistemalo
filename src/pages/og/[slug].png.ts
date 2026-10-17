import type { APIRoute } from "astro";
import { chistes } from "../../utils/chiste";
import { pngChiste } from "../../utils/og";

export function getStaticPaths() {
  return chistes.map((chiste) => ({
    params: { slug: chiste.slug },
    props: { chiste },
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const { chiste } = props as { chiste: (typeof chistes)[number] };
  return new Response(await pngChiste(chiste.texto, chiste.categoria), {
    headers: { "Content-Type": "image/png" },
  });
};
