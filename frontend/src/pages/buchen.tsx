import { useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { SlidersHorizontal, Search } from "lucide-react"
import { toast } from "sonner"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { RaumKarte } from "@/components/raum-karte"
import { BuchungDialog } from "@/components/buchung-dialog"
import { RaumauswahlBestaetigungDialog } from "@/components/raumauswahl-bestaetigung-dialog"
import { useApp } from "@/lib/store"
import {
  ALLE_AUSSTATTUNGEN,
  raeumeFuerStandort,
  standortName,
  type Ausstattung,
  type Raum,
} from "@/lib/mock-data"
import { formatDatum } from "@/lib/format"
import {
  pruefeVerfuegbarkeit,
  erstelleBuchungsentwurf,
  RaumBelegtError,
} from "@/lib/api"

export function BuchenPage() {
  const { standortId, istVerfuegbar } = useApp()
  const [params] = useSearchParams()

  const heute = new Date().toISOString().slice(0, 10)
  const [datum, setDatum] = useState(params.get("datum") ?? heute)
  const [von, setVon] = useState(params.get("von") ?? "09:00")
  const [bis, setBis] = useState(params.get("bis") ?? "10:00")
  const [minKapazitaet, setMinKapazitaet] = useState("")
  const [ausstattungFilter, setAusstattungFilter] = useState<Ausstattung[]>([])
  const [nurFreie, setNurFreie] = useState(true)

  const [dialogRaum, setDialogRaum] = useState<Raum | null>(null)
  const [bestaetigungOpen, setBestaetigungOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [laedt, setLaedt] = useState(false)

  function toggleAusstattung(a: Ausstattung) {
    setAusstattungFilter((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a],
    )
  }

  function zuruecksetzen() {
    setMinKapazitaet("")
    setAusstattungFilter([])
    setNurFreie(true)
  }

  const verfuegbarkeit = { datum, von, bis }
  const zeitOk = von < bis

  const ergebnisse = useMemo(() => {
    const min = Number(minKapazitaet) || 0
    return raeumeFuerStandort(standortId)
      .filter((r) => r.kapazitaet >= min)
      .filter((r) =>
        ausstattungFilter.every((a) => r.ausstattung.includes(a)),
      )
      .filter((r) =>
        nurFreie && zeitOk ? istVerfuegbar(r.id, datum, von, bis) : true,
      )
  }, [standortId, minKapazitaet, ausstattungFilter, nurFreie, datum, von, bis, zeitOk, istVerfuegbar])

  function buchen(raum: Raum) {
    setDialogRaum(raum)
    setBestaetigungOpen(true)
  }

  async function weiterZurBuchung() {
    if (!dialogRaum) return
    setLaedt(true)
    try {
      const verfuegbar = await pruefeVerfuegbarkeit(dialogRaum.id, datum, von, bis)
      if (!verfuegbar) {
        toast.error("Raum nicht verfügbar", {
          description: `${dialogRaum.name} ist im gewählten Zeitfenster belegt.`,
        })
        return
      }
      await erstelleBuchungsentwurf({
        raumId: dialogRaum.id,
        standortId: dialogRaum.standortId,
        datum,
        von,
        bis,
      })
      setBestaetigungOpen(false)
      setDialogOpen(true)
    } catch (err) {
      if (err instanceof RaumBelegtError) {
        toast.error("Raum belegt", { description: err.message })
      } else {
        toast.error("Fehler beim Prüfen", {
          description: "Das Backend ist nicht erreichbar. Bitte versuche es später.",
        })
      }
    } finally {
      setLaedt(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Raum buchen</h1>
        <p className="text-muted-foreground">
          Finde einen freien Konferenzraum in {standortName(standortId)} für{" "}
          {formatDatum(datum)}.
        </p>
      </div>

      {/* Zeitraum-Auswahl */}
      <Card>
        <CardContent className="flex flex-wrap items-end gap-4 p-4">
          <div className="grid gap-1.5">
            <Label htmlFor="f-datum">Datum</Label>
            <Input
              id="f-datum"
              type="date"
              className="w-[170px]"
              value={datum}
              min={heute}
              onChange={(e) => setDatum(e.target.value)}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="f-von">Von</Label>
            <Input
              id="f-von"
              type="time"
              className="w-[120px]"
              value={von}
              onChange={(e) => setVon(e.target.value)}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="f-bis">Bis</Label>
            <Input
              id="f-bis"
              type="time"
              className="w-[120px]"
              value={bis}
              onChange={(e) => setBis(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 pb-1">
            <Checkbox
              id="nur-freie"
              checked={nurFreie}
              onCheckedChange={(v) => setNurFreie(Boolean(v))}
            />
            <Label htmlFor="nur-freie" className="font-normal">
              Nur freie Räume
            </Label>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        {/* Filter-Sidebar */}
        <Card className="h-fit">
          <CardContent className="flex flex-col gap-4 p-4">
            <div className="flex items-center gap-2 font-medium">
              <SlidersHorizontal className="size-4" />
              Filter
            </div>
            <Separator />
            <div className="grid gap-1.5">
              <Label htmlFor="min-kap">Mindest-Kapazität</Label>
              <Input
                id="min-kap"
                type="number"
                min={1}
                placeholder="Personen"
                value={minKapazitaet}
                onChange={(e) => setMinKapazitaet(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>Ausstattung</Label>
              {ALLE_AUSSTATTUNGEN.map((a) => (
                <div key={a} className="flex items-center gap-2">
                  <Checkbox
                    id={`a-${a}`}
                    checked={ausstattungFilter.includes(a)}
                    onCheckedChange={() => toggleAusstattung(a)}
                  />
                  <Label htmlFor={`a-${a}`} className="font-normal">
                    {a}
                  </Label>
                </div>
              ))}
            </div>
            <Separator />
            <Button variant="ghost" size="sm" onClick={zuruecksetzen}>
              Filter zurücksetzen
            </Button>
          </CardContent>
        </Card>

        {/* Ergebnisliste */}
        <div className="flex flex-col gap-4">
          <div className="text-sm text-muted-foreground">
            {ergebnisse.length}{" "}
            {ergebnisse.length === 1 ? "Raum" : "Räume"} gefunden
          </div>
          {ergebnisse.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center gap-2 py-12 text-center text-muted-foreground">
                <Search className="size-8" />
                <p>
                  Keine Räume entsprechen deinen Kriterien. Passe Filter oder
                  Zeitraum an.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {ergebnisse.map((raum) => (
                <RaumKarte
                  key={raum.id}
                  raum={raum}
                  verfuegbarkeit={zeitOk ? verfuegbarkeit : undefined}
                  onBuchen={buchen}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <RaumauswahlBestaetigungDialog
        raum={dialogRaum}
        open={bestaetigungOpen}
        onOpenChange={setBestaetigungOpen}
        datum={datum}
        von={von}
        bis={bis}
        laedt={laedt}
        onWeiter={weiterZurBuchung}
      />

      <BuchungDialog
        raum={dialogRaum}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initial={verfuegbarkeit}
      />
    </div>
  )
}
