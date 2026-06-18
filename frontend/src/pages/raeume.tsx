import { useMemo, useState } from "react"
import { Star, Building2, CalendarSearch } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RaumKarte } from "@/components/raum-karte"
import { BuchungDialog } from "@/components/buchung-dialog"
import { useApp } from "@/lib/store"
import {
  RAEUME,
  raeumeFuerStandort,
  standortName,
  type Raum,
} from "@/lib/mock-data"

export function RaeumePage() {
  const { standortId, favoriten } = useApp()
  const [bereich, setBereich] = useState<"standort" | "alle" | "favoriten">(
    "standort",
  )
  const [dialogRaum, setDialogRaum] = useState<Raum | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const heute = new Date().toISOString().slice(0, 10)
  const [datum, setDatum] = useState(heute)
  const [von, setVon] = useState("09:00")
  const [bis, setBis] = useState("10:00")
  const [verfuegbarkeitAktiv, setVerfuegbarkeitAktiv] = useState(false)

  const zeitOk = von < bis
  const verfuegbarkeit =
    verfuegbarkeitAktiv && zeitOk ? { datum, von, bis } : undefined

  const raeume = useMemo(() => {
    if (bereich === "alle") return RAEUME
    if (bereich === "favoriten")
      return RAEUME.filter((r) => favoriten.includes(r.id))
    return raeumeFuerStandort(standortId)
  }, [bereich, standortId, favoriten])

  function buchen(raum: Raum) {
    setDialogRaum(raum)
    setDialogOpen(true)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Räume</h1>
          <p className="text-muted-foreground">
            Alle Konferenzräume im Überblick.
          </p>
        </div>
        <Tabs value={bereich} onValueChange={(v) => setBereich(v as typeof bereich)}>
          <TabsList>
            <TabsTrigger value="standort">
              <Building2 className="size-4" />
              {standortName(standortId)}
            </TabsTrigger>
            <TabsTrigger value="alle">Alle Standorte</TabsTrigger>
            <TabsTrigger value="favoriten">
              <Star className="size-4" />
              Favoriten
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Verfügbarkeit prüfen */}
      <Card>
        <CardContent className="flex flex-wrap items-end gap-4 p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <CalendarSearch className="size-4" />
            Verfügbarkeit prüfen
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="r-datum">Datum</Label>
            <Input
              id="r-datum"
              type="date"
              className="w-[170px]"
              value={datum}
              min={heute}
              onChange={(e) => { setDatum(e.target.value); setVerfuegbarkeitAktiv(true) }}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="r-von">Von</Label>
            <Input
              id="r-von"
              type="time"
              className="w-[120px]"
              value={von}
              onChange={(e) => { setVon(e.target.value); setVerfuegbarkeitAktiv(true) }}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="r-bis">Bis</Label>
            <Input
              id="r-bis"
              type="time"
              className="w-[120px]"
              value={bis}
              onChange={(e) => { setBis(e.target.value); setVerfuegbarkeitAktiv(true) }}
            />
          </div>
          <Button
            variant={verfuegbarkeitAktiv ? "secondary" : "default"}
            onClick={() => setVerfuegbarkeitAktiv((v) => !v)}
          >
            {verfuegbarkeitAktiv ? "Anzeige zurücksetzen" : "Verfügbarkeit anzeigen"}
          </Button>
        </CardContent>
      </Card>

      {!zeitOk && verfuegbarkeitAktiv && (
        <p className="text-sm text-destructive">
          Die Endzeit muss nach der Startzeit liegen.
        </p>
      )}

      {raeume.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center text-muted-foreground">
            <Star className="size-8" />
            <p>
              Noch keine Favoriten markiert. Tippe auf den Stern einer
              Raumkarte, um ihn hier zu sammeln.
            </p>
            <Button variant="outline" onClick={() => setBereich("standort")}>
              Räume ansehen
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {raeume.map((raum) => (
            <RaumKarte
              key={raum.id}
              raum={raum}
              verfuegbarkeit={verfuegbarkeit}
              onBuchen={buchen}
            />
          ))}
        </div>
      )}

      <BuchungDialog
        raum={dialogRaum}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  )
}
