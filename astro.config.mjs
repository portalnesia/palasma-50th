import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  output: "static",
  site: "https://plm-50th.portalnesia.com",
  vite: {
    plugins: [tailwindcss()],
  },
});
