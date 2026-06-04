import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  output: "static",
  site: "https://portalnesia.github.io",
  base: "/palasma-50th",
  vite: {
    plugins: [tailwindcss()],
  },
});
