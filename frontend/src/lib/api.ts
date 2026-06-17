// Zugriff auf den Booking Service (Backend).
//
// Frontend und Backend laufen in unterschiedlichen Umgebungen unter
// unterschiedlichen URLs. Die Backend-Basis-URL wird daher zur Laufzeit aus
// der aktuellen Browser-URL abgeleitet:
//
// - Crucible-Proxy:  …/proxy/5173/  ->  …/proxy/8081/
// - GitHub Codespaces: NAME-5173.app.github.dev  ->  NAME-8081.app.github.dev
// - lokale Entwicklung: http://localhost:8081

const BACKEND_PORT = "8081"
const FRONTEND_PORT = "5173"

export function apiBaseUrl(): string {
  const { origin, pathname, hostname } = window.location

  // Crucible-Proxy: Port-Segment im Pfad ersetzen
  const proxyMatch = pathname.match(new RegExp(`^(.*/proxy/)${FRONTEND_PORT}(?:/|$)`))
  if (proxyMatch) {
    return origin + proxyMatch[1] + BACKEND_PORT
  }

  // GitHub Codespaces: Port-Segment in der Subdomain ersetzen
  if (hostname.includes(`-${FRONTEND_PORT}.`)) {
    return origin.replace(`-${FRONTEND_PORT}.`, `-${BACKEND_PORT}.`)
  }

  // Lokale Entwicklung
  return `http://localhost:${BACKEND_PORT}`
}

/** Ruft GET /api/hello auf und liefert die Antwort als Text. */
export async function fetchHello(): Promise<string> {
  const res = await fetch(`${apiBaseUrl()}/api/hello`)
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`)
  }
  return res.text()
}
