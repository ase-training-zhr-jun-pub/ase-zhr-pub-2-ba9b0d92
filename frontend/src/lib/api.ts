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

// --- Buchungen (Booking Service) -------------------------------------------

export type BuchungStatus = "ENTWURF" | "BESTAETIGT"

/** Eingabe für das Anlegen eines Buchungs-Entwurfs. */
export interface BuchungEntwurfRequest {
  raumId: string
  standortId: string
  datum: string // ISO YYYY-MM-DD
  von: string // "HH:mm"
  bis: string // "HH:mm"
}

/** Vom Backend zurückgelieferte Buchung. */
export interface BuchungDto {
  id: number
  raumId: string
  standortId: string
  datum: string
  von: string
  bis: string
  status: BuchungStatus
}

/** Wird geworfen, wenn der Raum im gewählten Zeitfenster belegt ist (HTTP 409). */
export class RaumBelegtError extends Error {}

/**
 * Prüft beim Backend, ob ein Konferenzraum im gewünschten Zeitfenster frei ist.
 * Ruft GET /api/raeume/{raumId}/verfuegbarkeit auf.
 */
export async function pruefeVerfuegbarkeit(
  raumId: string,
  datum: string,
  von: string,
  bis: string,
): Promise<boolean> {
  const params = new URLSearchParams({ datum, von, bis })
  const res = await fetch(
    `${apiBaseUrl()}/api/raeume/${encodeURIComponent(raumId)}/verfuegbarkeit?${params}`,
  )
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`)
  }
  const data = (await res.json()) as { verfuegbar: boolean }
  return data.verfuegbar
}

/**
 * Legt einen Buchungs-Entwurf (Status ENTWURF) an. Ruft POST /api/buchungen auf.
 *
 * @throws RaumBelegtError wenn der Raum im Zeitfenster bereits belegt ist (HTTP 409)
 */
export async function erstelleBuchungsentwurf(
  request: BuchungEntwurfRequest,
): Promise<BuchungDto> {
  const res = await fetch(`${apiBaseUrl()}/api/buchungen`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  })
  if (res.status === 409) {
    throw new RaumBelegtError(
      "Der Konferenzraum ist im gewählten Zeitfenster bereits belegt.",
    )
  }
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`)
  }
  return (await res.json()) as BuchungDto
}
