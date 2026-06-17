import { createContext, useContext, useMemo, useState } from "react"
import {
  BUCHUNGEN,
  ueberschneidet,
  type Buchung,
} from "@/lib/mock-data"

interface AppState {
  // Standort-Auswahl (global im Header)
  standortId: string
  setStandortId: (id: string) => void

  // Buchungen
  buchungen: Buchung[]
  addBuchung: (b: Omit<Buchung, "id">) => Buchung
  removeBuchung: (id: string) => void
  updateBuchung: (id: string, patch: Partial<Buchung>) => void

  // Favoriten-Räume
  favoriten: string[]
  toggleFavorit: (raumId: string) => void
  istFavorit: (raumId: string) => boolean

  // Verfügbarkeit auf Basis des aktuellen Buchungs-States
  istVerfuegbar: (
    raumId: string,
    datum: string,
    von: string,
    bis: string,
  ) => boolean
  belegungenFuer: (raumId: string, datum: string) => Buchung[]
}

const AppContext = createContext<AppState | undefined>(undefined)

let idZaehler = 1000

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [standortId, setStandortId] = useState("koeln")
  const [buchungen, setBuchungen] = useState<Buchung[]>(BUCHUNGEN)
  const [favoriten, setFavoriten] = useState<string[]>([
    "koeln-rheinblick",
    "berlin-spree",
  ])

  const value = useMemo<AppState>(() => {
    const belegungenFuer = (raumId: string, datum: string) =>
      buchungen
        .filter((b) => b.raumId === raumId && b.datum === datum)
        .sort((a, b) => a.von.localeCompare(b.von))

    return {
      standortId,
      setStandortId,
      buchungen,
      addBuchung: (b) => {
        const neu: Buchung = { ...b, id: `b${++idZaehler}` }
        setBuchungen((prev) => [...prev, neu])
        return neu
      },
      removeBuchung: (id) =>
        setBuchungen((prev) => prev.filter((b) => b.id !== id)),
      updateBuchung: (id, patch) =>
        setBuchungen((prev) =>
          prev.map((b) => (b.id === id ? { ...b, ...patch } : b)),
        ),
      favoriten,
      toggleFavorit: (raumId) =>
        setFavoriten((prev) =>
          prev.includes(raumId)
            ? prev.filter((r) => r !== raumId)
            : [...prev, raumId],
        ),
      istFavorit: (raumId) => favoriten.includes(raumId),
      istVerfuegbar: (raumId, datum, von, bis) =>
        !belegungenFuer(raumId, datum).some((b) =>
          ueberschneidet(von, bis, b.von, b.bis),
        ),
      belegungenFuer,
    }
  }, [standortId, buchungen, favoriten])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useApp must be used within AppProvider")
  return ctx
}
