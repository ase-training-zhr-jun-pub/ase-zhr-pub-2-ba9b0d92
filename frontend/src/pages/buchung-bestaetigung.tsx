import { useNavigate } from "react-router-dom"
import { CalendarCheck, MapPin, Clock, StickyNote, CheckCircle2, CalendarDays } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useApp } from "@/lib/store"
import { raumById, standortName } from "@/lib/mock-data"
import { formatDatum } from "@/lib/format"

export function BuchungBestaetigungPage() {
  const { letzteBuchung } = useApp()
  const navigate = useNavigate()

  if (!letzteBuchung) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold">Buchungsbestätigung</h1>
          <p className="text-muted-foreground">Keine aktuelle Buchung gefunden.</p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center text-muted-foreground">
            <CalendarCheck className="size-8" />
            <p>Es liegt keine aktuelle Buchung vor.</p>
            <Button variant="outline" onClick={() => navigate("/buchen")}>
              Raum buchen
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const raum = raumById(letzteBuchung.raumId)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Buchungsbestätigung</h1>
        <p className="text-muted-foreground">
          Deine Buchung wurde erfolgreich gespeichert.
        </p>
      </div>

      <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
        <CardContent className="flex items-center gap-3 p-4">
          <CheckCircle2 className="size-6 shrink-0 text-green-600 dark:text-green-400" />
          <p className="font-medium text-green-800 dark:text-green-300">
            Konferenzraum erfolgreich gebucht!
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Buchungsdetails</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          {letzteBuchung.titel && (
            <div className="flex items-start gap-3">
              <CalendarCheck className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Meetingtitel
                </p>
                <p className="font-medium">{letzteBuchung.titel}</p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Raum &amp; Standort
              </p>
              <p className="font-medium">
                {raum?.name ?? letzteBuchung.raumId}
              </p>
              <p className="text-sm text-muted-foreground">
                {standortName(letzteBuchung.standortId)}
                {raum?.etage ? ` · ${raum.etage}` : ""}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CalendarDays className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Datum
              </p>
              <p className="font-medium">{formatDatum(letzteBuchung.datum)}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Zeitraum
              </p>
              <p className="font-medium">
                {letzteBuchung.von}–{letzteBuchung.bis} Uhr
              </p>
            </div>
          </div>

          {letzteBuchung.notiz && (
            <div className="flex items-start gap-3">
              <StickyNote className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Buchungsnotiz
                </p>
                <p className="text-sm">{letzteBuchung.notiz}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Button onClick={() => navigate("/buchungen")}>
          <CalendarCheck />
          Meine Buchungen
        </Button>
        <Button variant="outline" onClick={() => navigate("/buchen")}>
          Weiteren Raum buchen
        </Button>
      </div>
    </div>
  )
}
