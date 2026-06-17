// Zentrale Mock-Daten für den Calvin-Prototyp.
// Kein Backend – alle Daten werden hier im Frontend gehalten.

export type Ausstattung =
  | "Beamer"
  | "Whiteboard"
  | "Videokonferenz"
  | "Flipchart"
  | "TV-Bildschirm"

export const ALLE_AUSSTATTUNGEN: Ausstattung[] = [
  "Beamer",
  "Whiteboard",
  "Videokonferenz",
  "Flipchart",
  "TV-Bildschirm",
]

export interface Standort {
  id: string
  name: string
  land: "DE" | "CH"
  raeume: number
}

export interface Raum {
  id: string
  name: string
  standortId: string
  kapazitaet: number
  ausstattung: Ausstattung[]
  etage: string
  beschreibung: string
}

export interface Buchung {
  id: string
  raumId: string
  standortId: string
  titel: string
  datum: string // ISO: YYYY-MM-DD
  von: string // "09:00"
  bis: string // "10:00"
  notiz?: string
  organisator: string
}

export interface Kollege {
  id: string
  name: string
  initialen: string
  standortId: string
  /** ISO-Daten, an denen die Person vor Ort ist */
  anwesend: string[]
}

// --- Die acht INNOQ-Standorte ----------------------------------------------

export const STANDORTE: Standort[] = [
  { id: "koeln", name: "Köln", land: "DE", raeume: 5 },
  { id: "monheim", name: "Monheim", land: "DE", raeume: 4 },
  { id: "berlin", name: "Berlin", land: "DE", raeume: 4 },
  { id: "hamburg", name: "Hamburg", land: "DE", raeume: 3 },
  { id: "muenchen", name: "München", land: "DE", raeume: 3 },
  { id: "offenbach", name: "Offenbach", land: "DE", raeume: 2 },
  { id: "zuerich", name: "Zürich", land: "CH", raeume: 3 },
  { id: "baar", name: "Baar", land: "CH", raeume: 2 },
]

// --- Konferenzräume ---------------------------------------------------------

export const RAEUME: Raum[] = [
  // Köln
  { id: "koeln-rheinblick", name: "Rheinblick", standortId: "koeln", kapazitaet: 8, etage: "3. OG", ausstattung: ["Beamer", "Whiteboard", "Videokonferenz"], beschreibung: "Heller Raum mit Blick auf den Rhein, ideal für Kundenworkshops." },
  { id: "koeln-dom", name: "Dom", standortId: "koeln", kapazitaet: 14, etage: "3. OG", ausstattung: ["Beamer", "Whiteboard", "Videokonferenz", "Flipchart"], beschreibung: "Großer Workshop-Raum mit flexibler Bestuhlung." },
  { id: "koeln-veedel", name: "Veedel", standortId: "koeln", kapazitaet: 4, etage: "2. OG", ausstattung: ["TV-Bildschirm", "Whiteboard"], beschreibung: "Kompakter Besprechungsraum für kleine Runden." },
  { id: "koeln-fokus", name: "Fokusraum", standortId: "koeln", kapazitaet: 2, etage: "2. OG", ausstattung: ["TV-Bildschirm"], beschreibung: "Ruhiger Raum für 1:1-Gespräche und konzentrierte Calls." },
  { id: "koeln-kranhaus", name: "Kranhaus", standortId: "koeln", kapazitaet: 6, etage: "4. OG", ausstattung: ["Beamer", "Videokonferenz", "Flipchart"], beschreibung: "Modern ausgestatteter Raum für hybride Meetings." },

  // Monheim
  { id: "monheim-rheinbogen", name: "Rheinbogen", standortId: "monheim", kapazitaet: 10, etage: "1. OG", ausstattung: ["Beamer", "Whiteboard", "Videokonferenz"], beschreibung: "Geräumiger Hauptbesprechungsraum am Hauptstandort." },
  { id: "monheim-apfelbaum", name: "Apfelbaum", standortId: "monheim", kapazitaet: 6, etage: "1. OG", ausstattung: ["TV-Bildschirm", "Whiteboard", "Flipchart"], beschreibung: "Freundlicher Raum für Team-Meetings." },
  { id: "monheim-gaenseliesel", name: "Gänseliesel", standortId: "monheim", kapazitaet: 4, etage: "EG", ausstattung: ["TV-Bildschirm"], beschreibung: "Kleiner Raum nahe der Küche." },
  { id: "monheim-werkstatt", name: "Werkstatt", standortId: "monheim", kapazitaet: 12, etage: "EG", ausstattung: ["Beamer", "Whiteboard", "Flipchart", "Videokonferenz"], beschreibung: "Großer Kreativraum für Architektur-Workshops." },

  // Berlin
  { id: "berlin-spree", name: "Spree", standortId: "berlin", kapazitaet: 8, etage: "5. OG", ausstattung: ["Beamer", "Whiteboard", "Videokonferenz"], beschreibung: "Workshop-Raum mit Dachterrassenzugang." },
  { id: "berlin-kreuzberg", name: "Kreuzberg", standortId: "berlin", kapazitaet: 6, etage: "5. OG", ausstattung: ["TV-Bildschirm", "Whiteboard"], beschreibung: "Lockerer Raum im Loft-Stil." },
  { id: "berlin-brandenburg", name: "Brandenburg", standortId: "berlin", kapazitaet: 16, etage: "5. OG", ausstattung: ["Beamer", "Videokonferenz", "Flipchart", "Whiteboard"], beschreibung: "Größter Raum am Standort, auch für Schulungen." },
  { id: "berlin-box", name: "Telefonbox Ost", standortId: "berlin", kapazitaet: 1, etage: "5. OG", ausstattung: ["TV-Bildschirm"], beschreibung: "Schallisolierte Box für ungestörte Calls." },

  // Hamburg
  { id: "hamburg-elbe", name: "Elbe", standortId: "hamburg", kapazitaet: 10, etage: "2. OG", ausstattung: ["Beamer", "Whiteboard", "Videokonferenz"], beschreibung: "Repräsentativer Raum mit Hafenblick." },
  { id: "hamburg-alster", name: "Alster", standortId: "hamburg", kapazitaet: 4, etage: "2. OG", ausstattung: ["TV-Bildschirm", "Whiteboard"], beschreibung: "Ruhiger Besprechungsraum." },
  { id: "hamburg-speicher", name: "Speicher", standortId: "hamburg", kapazitaet: 8, etage: "1. OG", ausstattung: ["Beamer", "Flipchart", "Videokonferenz"], beschreibung: "Raum im Backstein-Charme der Speicherstadt." },

  // München
  { id: "muenchen-isar", name: "Isar", standortId: "muenchen", kapazitaet: 8, etage: "3. OG", ausstattung: ["Beamer", "Whiteboard", "Videokonferenz"], beschreibung: "Zentraler Workshop-Raum." },
  { id: "muenchen-olympia", name: "Olympia", standortId: "muenchen", kapazitaet: 12, etage: "3. OG", ausstattung: ["Beamer", "Whiteboard", "Flipchart", "Videokonferenz"], beschreibung: "Großzügiger Raum für Team-Events." },
  { id: "muenchen-viktualien", name: "Viktualien", standortId: "muenchen", kapazitaet: 4, etage: "2. OG", ausstattung: ["TV-Bildschirm"], beschreibung: "Kleine Besprechungsecke." },

  // Offenbach
  { id: "offenbach-main", name: "Main", standortId: "offenbach", kapazitaet: 8, etage: "1. OG", ausstattung: ["Beamer", "Whiteboard", "Videokonferenz"], beschreibung: "Heller Hauptraum." },
  { id: "offenbach-hafen", name: "Hafen", standortId: "offenbach", kapazitaet: 5, etage: "1. OG", ausstattung: ["TV-Bildschirm", "Flipchart"], beschreibung: "Gemütlicher Raum für Team-Runden." },

  // Zürich
  { id: "zuerich-limmat", name: "Limmat", standortId: "zuerich", kapazitaet: 10, etage: "4. OG", ausstattung: ["Beamer", "Whiteboard", "Videokonferenz"], beschreibung: "Eleganter Raum für Kundentermine." },
  { id: "zuerich-uetliberg", name: "Üetliberg", standortId: "zuerich", kapazitaet: 6, etage: "4. OG", ausstattung: ["TV-Bildschirm", "Whiteboard", "Flipchart"], beschreibung: "Raum mit Bergblick." },
  { id: "zuerich-niederdorf", name: "Niederdorf", standortId: "zuerich", kapazitaet: 4, etage: "3. OG", ausstattung: ["TV-Bildschirm"], beschreibung: "Kompakter Besprechungsraum." },

  // Baar
  { id: "baar-lorze", name: "Lorze", standortId: "baar", kapazitaet: 8, etage: "EG", ausstattung: ["Beamer", "Whiteboard", "Videokonferenz"], beschreibung: "Hauptbesprechungsraum am Standort Baar." },
  { id: "baar-zugersee", name: "Zugersee", standortId: "baar", kapazitaet: 4, etage: "EG", ausstattung: ["TV-Bildschirm", "Flipchart"], beschreibung: "Kleiner Raum mit Seeblick." },
]

// --- Datums-Helfer: relativ zu „heute", damit der Prototyp aktuell wirkt ----

function isoDatum(offsetTage: number): string {
  const d = new Date()
  d.setDate(d.getDate() + offsetTage)
  return d.toISOString().slice(0, 10)
}

export const HEUTE = isoDatum(0)

// --- Der aktuelle Nutzer (Persona) ------------------------------------------

export const AKTUELLER_NUTZER = {
  name: "Alex Berger",
  initialen: "AB",
  rolle: "Senior Consultant",
}

// --- Buchungen (eigene + fremde, zur Verfügbarkeitsberechnung) --------------

export const BUCHUNGEN: Buchung[] = [
  // Eigene kommende Buchungen
  { id: "b1", raumId: "koeln-fokus", standortId: "koeln", titel: "1:1 mit Teamlead", datum: isoDatum(1), von: "09:00", bis: "10:00", organisator: "Alex Berger", notiz: "Quartalsgespräch" },
  { id: "b2", raumId: "berlin-brandenburg", standortId: "berlin", titel: "Architektur-Workshop Kunde Meyer", datum: isoDatum(2), von: "13:00", bis: "15:00", organisator: "Alex Berger" },
  { id: "b3", raumId: "koeln-rheinblick", standortId: "koeln", titel: "Team Sync", datum: isoDatum(5), von: "11:00", bis: "12:00", organisator: "Alex Berger" },

  // Fremdbuchungen – erzeugen Belegungen in der Raumsuche
  { id: "b4", raumId: "koeln-rheinblick", standortId: "koeln", titel: "Sprint Planning", datum: isoDatum(0), von: "09:00", bis: "11:00", organisator: "Sina Wolf" },
  { id: "b5", raumId: "koeln-dom", standortId: "koeln", titel: "All Hands", datum: isoDatum(0), von: "10:00", bis: "12:00", organisator: "Jonas Becker" },
  { id: "b6", raumId: "koeln-kranhaus", standortId: "koeln", titel: "Retro", datum: isoDatum(0), von: "14:00", bis: "15:00", organisator: "Mara Klein" },
  { id: "b7", raumId: "koeln-rheinblick", standortId: "koeln", titel: "Kundencall", datum: isoDatum(1), von: "14:00", bis: "15:30", organisator: "Tom Richter" },
  { id: "b8", raumId: "koeln-dom", standortId: "koeln", titel: "Schulung", datum: isoDatum(1), von: "09:00", bis: "12:00", organisator: "Lena Fischer" },

  // Eigene vergangene Buchung
  { id: "b9", raumId: "koeln-veedel", standortId: "koeln", titel: "Code Review Session", datum: isoDatum(-3), von: "15:00", bis: "16:00", organisator: "Alex Berger" },
  { id: "b10", raumId: "hamburg-elbe", standortId: "hamburg", titel: "Kundenpräsentation", datum: isoDatum(-7), von: "10:00", bis: "11:30", organisator: "Alex Berger" },
]

// --- Kolleg:innen-Anwesenheit (Feature „Im Büro") ---------------------------

export const KOLLEGEN: Kollege[] = [
  { id: "k1", name: "Sina Wolf", initialen: "SW", standortId: "koeln", anwesend: [isoDatum(0), isoDatum(1), isoDatum(5)] },
  { id: "k2", name: "Jonas Becker", initialen: "JB", standortId: "koeln", anwesend: [isoDatum(0), isoDatum(2)] },
  { id: "k3", name: "Mara Klein", initialen: "MK", standortId: "koeln", anwesend: [isoDatum(0), isoDatum(1)] },
  { id: "k4", name: "Tom Richter", initialen: "TR", standortId: "koeln", anwesend: [isoDatum(1), isoDatum(5)] },
  { id: "k5", name: "Lena Fischer", initialen: "LF", standortId: "koeln", anwesend: [isoDatum(1)] },
  { id: "k6", name: "Paul Schmidt", initialen: "PS", standortId: "koeln", anwesend: [isoDatum(0), isoDatum(5)] },
  { id: "k7", name: "Nora Hartmann", initialen: "NH", standortId: "berlin", anwesend: [isoDatum(2)] },
  { id: "k8", name: "David Köhler", initialen: "DK", standortId: "berlin", anwesend: [isoDatum(2)] },
  { id: "k9", name: "Eva Sommer", initialen: "ES", standortId: "muenchen", anwesend: [isoDatum(0), isoDatum(1)] },
]

// --- Abgeleitete Helfer -----------------------------------------------------

export function standortName(id: string): string {
  return STANDORTE.find((s) => s.id === id)?.name ?? id
}

export function raumById(id: string): Raum | undefined {
  return RAEUME.find((r) => r.id === id)
}

export function raeumeFuerStandort(standortId: string): Raum[] {
  return RAEUME.filter((r) => r.standortId === standortId)
}

/** Wandelt "HH:MM" in Minuten seit Mitternacht. */
function zuMinuten(zeit: string): number {
  const [h, m] = zeit.split(":").map(Number)
  return h * 60 + m
}

/** Prüft, ob sich zwei Zeitfenster am selben Tag überlappen. */
export function ueberschneidet(
  vonA: string,
  bisA: string,
  vonB: string,
  bisB: string,
): boolean {
  return zuMinuten(vonA) < zuMinuten(bisB) && zuMinuten(vonB) < zuMinuten(bisA)
}

/** Liefert alle Buchungen für einen Raum an einem Datum. */
export function belegungen(raumId: string, datum: string): Buchung[] {
  return BUCHUNGEN.filter((b) => b.raumId === raumId && b.datum === datum).sort(
    (a, b) => zuMinuten(a.von) - zuMinuten(b.von),
  )
}

/** Ist der Raum im gewünschten Zeitfenster frei? */
export function istVerfuegbar(
  raumId: string,
  datum: string,
  von: string,
  bis: string,
): boolean {
  return !belegungen(raumId, datum).some((b) =>
    ueberschneidet(von, bis, b.von, b.bis),
  )
}
