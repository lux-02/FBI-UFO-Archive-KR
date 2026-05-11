import type { APIRoute } from "astro";

const site = "https://ufo.n2f.site";

export const GET: APIRoute = () =>
  new Response(`User-agent: *\nAllow: /\nSitemap: ${site}/sitemap.xml\n`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
