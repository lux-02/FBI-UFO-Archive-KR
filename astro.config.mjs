// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://ufo.n2f.site",
  output: "static",
  trailingSlash: "ignore",
  vite: {
    plugins: [tailwindcss()],
  },
});
