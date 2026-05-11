import type { APIRoute } from "astro";
import { formatPage, getPublishedDatasetParts, getReaderPagesForPart } from "@/lib/public-dataset";

const site = "https://ufo.n2f.site";

function xmlEscape(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function routeUrl(path: string): string {
  const normalizedPath = path === "/" ? path : `${path}/`;
  return new URL(normalizedPath, site).toString();
}

export const GET: APIRoute = () => {
  const staticPaths = ["/", "/search", "/about"];
  const readerPaths = getPublishedDatasetParts()
    .filter((part) => part.hasReader)
    .flatMap((part) => [
      `/archive/${part.slug}`,
      ...getReaderPagesForPart(part.part).map((page) => `/archive/${part.slug}/page-${formatPage(page.page)}`),
    ]);
  const urls = [...staticPaths, ...readerPaths];
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((path) => `  <url><loc>${xmlEscape(routeUrl(path))}</loc></url>`)
    .join("\n")}\n</urlset>\n`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
};
