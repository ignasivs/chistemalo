import type { APIRoute } from "astro";
import { pngPortada } from "../../utils/og";

export const GET: APIRoute = async () =>
  new Response(await pngPortada(), {
    headers: { "Content-Type": "image/png" },
  });
