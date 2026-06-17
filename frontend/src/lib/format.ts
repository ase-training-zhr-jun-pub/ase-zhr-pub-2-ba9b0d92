// Formatierungs-Helfer für deutsche Datums-/Zeitanzeige.

const WOCHENTAGE = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"]

/** "2026-06-18" -> "Mi, 18.06.2026" */
export function formatDatum(iso: string): string {
  const d = new Date(iso + "T00:00:00")
  const tag = WOCHENTAGE[d.getDay()]
  return `${tag}, ${d.toLocaleDateString("de-DE")}`
}

/** "2026-06-18" -> "18.06." */
export function formatDatumKurz(iso: string): string {
  const d = new Date(iso + "T00:00:00")
  return d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" })
}

/** Liefert "Heute", "Morgen" oder das kurze Datum. */
export function relativesDatum(iso: string, heute: string): string {
  const d = new Date(iso + "T00:00:00").getTime()
  const h = new Date(heute + "T00:00:00").getTime()
  const diff = Math.round((d - h) / 86_400_000)
  if (diff === 0) return "Heute"
  if (diff === 1) return "Morgen"
  if (diff === -1) return "Gestern"
  return formatDatumKurz(iso)
}

export function istVergangen(iso: string, heute: string): boolean {
  return new Date(iso + "T00:00:00") < new Date(heute + "T00:00:00")
}
