import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  CalendarCheck,
  Users,
  Zap,
  MapPin,
  Clock,
  ArrowRight,
} from "lucide-react"
import { toast } from "sonner"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BuchungDialog } from "@/components/buchung-dialog"
import { useApp } from "@/lib/store"
import {
  AKTUELLER_NUTZER,
  KOLLEGEN,
  raeumeFuerStandort,
  raumById,
  standortName,
  type Raum,
} from "@/lib/mock-data"
import { istVergangen, relativesDatum } from "@/lib/format"

export function DashboardPage() {
  const { standortId, buchungen, istVerfuegbar } = useApp()
  const navigate = useNavigate()
  const heute = new Date().toISOString().slice(0, 10)

  const [dialogRaum, setDialogRaum] = useState<Raum | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [quickSlot, setQuickSlot] = useState({ datum: heute, von: "09:00", bis: "10:00" })

  const kommende = useMemo(
    () =>
      buchungen
        .filter(
          (b) =>
            b.organisator === AKTUELLER_NUTZER.name &&
            !istVergangen(b.datum, heute),
        )
        .sort((a, b) => (a.datum + a.von).localeCompare(b.datum + b.von)),
    [buchungen, heute],
  )

  const naechste = kommende[0]
  const naechsterRaum = naechste ? raumById(naechste.raumId) : undefined

  const heuteImBuero = KOLLEGEN.filter(
    (k) => k.standortId === standortId && k.anwesend.includes(heute),
  )
  const gesamtStandort = KOLLEGEN.filter((k) => k.standortId === standortId)
  const quote = gesamtStandort.length
    ? Math.round((heuteImBuero.length / gesamtStandort.length) * 100)
    : 0

  function schnellbuchung() {
    const jetzt = new Date().getHours()
    const startStunde = Math.min(Math.max(jetzt + 1, 8), 17)
    const von = `${String(startStunde).padStart(2, "0")}:00`
    const bis = `${String(startStunde + 1).padStart(2, "0")}:00`
    const frei = raeumeFuerStandort(standortId).find((r) =>
      istVerfuegbar(r.id, heute, von, bis),
    )
    if (!frei) {
      toast.info("Kein Raum spontan frei", {
        description: "Probiere es im Buchungs-Flow mit einem anderen Zeitfenster.",
      })
      navigate("/buchen")
      return
    }
    setQuickSlot({ datum: heute, von, bis })
    setDialogRaum(frei)
    setDialogOpen(true)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">
          Hallo {AKTUELLER_NUTZER.name.split(" ")[0]} 👋
        </h1>
        <p className="text-muted-foreground">
          Hier ist dein Überblick für {standortName(standortId)}.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Nächste Buchung */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CalendarCheck className="size-4" />
              Nächste Buchung
            </CardTitle>
          </CardHeader>
          <CardContent>
            {naechste ? (
              <div className="flex flex-col gap-1">
                <div className="font-semibold">{naechsterRaum?.name}</div>
                <div className="text-sm text-muted-foreground">
                  {naechste.titel}
                </div>
                <div className="mt-1 flex items-center gap-2 text-sm">
                  <MapPin className="size-3.5 text-muted-foreground" />
                  {standortName(naechste.standortId)}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="size-3.5 text-muted-foreground" />
                  {relativesDatum(naechste.datum, heute)}, {naechste.von}–
                  {naechste.bis} Uhr
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Keine kommenden Buchungen.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Heute im Büro */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="size-4" />
              Heute im Büro
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="text-3xl font-semibold">
              {heuteImBuero.length}
              <span className="ml-1 text-base font-normal text-muted-foreground">
                Kolleg:innen
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${quote}%` }}
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="-ml-2 w-fit"
              onClick={() => navigate("/im-buero")}
            >
              Wer ist da? <ArrowRight />
            </Button>
          </CardContent>
        </Card>

        {/* Schnellbuchung */}
        <Card className="bg-primary text-primary-foreground">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Zap className="size-4" />
              Schnellbuchung
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <p className="text-sm text-primary-foreground/80">
              Buche mit einem Klick den nächsten freien Raum in{" "}
              {standortName(standortId)}.
            </p>
            <Button variant="secondary" onClick={schnellbuchung}>
              <Zap />
              Jetzt Raum sichern
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Kommende Buchungen */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Meine kommenden Buchungen</h2>
          <Button variant="outline" size="sm" onClick={() => navigate("/buchungen")}>
            Alle ansehen
          </Button>
        </div>
        {kommende.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 py-10 text-center text-muted-foreground">
              <CalendarCheck className="size-8" />
              <p>Du hast aktuell keine Buchungen.</p>
              <Button onClick={() => navigate("/buchen")}>Raum buchen</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col gap-2">
            {kommende.slice(0, 4).map((b) => {
              const raum = raumById(b.raumId)
              return (
                <Card key={b.id}>
                  <CardContent className="flex flex-wrap items-center gap-4 p-3 px-4">
                    <div className="w-20 text-sm font-medium">
                      {relativesDatum(b.datum, heute)}
                    </div>
                    <div className="w-28 text-sm text-muted-foreground">
                      {b.von}–{b.bis} Uhr
                    </div>
                    <div className="flex-1 font-medium">{b.titel}</div>
                    <div className="text-sm text-muted-foreground">
                      {raum?.name} · {standortName(b.standortId)}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      <BuchungDialog
        raum={dialogRaum}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initial={quickSlot}
      />
    </div>
  )
}
