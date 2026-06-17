import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  // Relative Asset-Pfade im Build, damit die App hinter dem Crucible-Proxy
  // (…/proxy/5173/) ihre Skripte/Assets findet. Greift nur im Build/Preview,
  // nicht im Dev-Server (der relative base ignoriert) – darum läuft die App
  // hinter dem Proxy über `npm run build` + `npm run preview`.
  base: "./",
  plugins: [react(), tailwindcss()],
  server: {
    host: "0.0.0.0",
    allowedHosts: true,
  },
  preview: {
    host: "0.0.0.0",
    port: 5173,
    // Fremden Proxy-Host akzeptieren, statt die Anfrage zu blocken.
    allowedHosts: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
