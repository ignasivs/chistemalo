import type { APIRoute } from "astro";
import { chisteDelDia } from "../../utils/chiste";

export const GET: APIRoute = () => {
  const { fecha, chiste } = chisteDelDia();
  return new Response(JSON.stringify({ fecha, ...chiste }), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
};
