import type { APIRoute } from "astro";
import { chisteDelDia, SITIO } from "../../utils/chiste";

export const GET: APIRoute = () => {
  const { fecha, chiste } = chisteDelDia();
  return new Response(
    JSON.stringify({
      fecha,
      id: chiste.id,
      texto: chiste.texto,
      categoria: chiste.categoria,
      url: `${SITIO}/chiste/${chiste.slug}/`,
    }),
    { headers: { "Content-Type": "application/json; charset=utf-8" } },
  );
};
