import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  CalendarCheck,
  MapPin,
  Clock,
  Trash2,
  Share2,
  CalendarPlus,
  StickyNote,
  ChevronRight,
} from "lucide-react"
import { toast } from "sonner"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AusstattungListe } from "@/components/ausstattung-badge"
import { cn } from "@/lib/utils"
import { useApp } from "@/lib/store"
import {
  AKTUELLER_NUTZER,
  raumById,
  standortName,
  type Buchung,
} from "@/lib/mock-data"
import { formatDatum, istVergangen, relativesDatum } from "@/lib/format"

export function MeineBuchungenPage() {
  const { buchungen, removeBuchung } = useApp()
  const navigate = useNavigate()
  const heute = new Date().toISOString().slice(0, 10)
  const [tab, setTab] = useState<"kommend" | "vergangen">("kommend")
  const [detail, setDetail] = useState<Buchung | null>(null)

  const eigene = useMemo(
    () =>
      buchungen
        .filter((b) => b.organisator === AKTUELLER_NUTZER.name)
        .sort((a, b) => (a.datum + a.von).localeCompare(b.datum + b.von)),
    [buchungen],
  )

  const gefiltert = eigene.filter((b) =>
    tab === "vergangen" ? istVergangen(b.datum, heute) : !istVergangen(b.datum, heute),
  )

  function stornieren(b: Buchung) {
    removeBuchung(b.id)
    setDetail(null)
    toast.success("Buchung storniert", {
      description: `${raumById(b.raumId)?.name} · ${formatDatum(b.datum)}`,
    })
  }

  function teilen(b: Buchung) {
    const raum = raumById(b.raumId)
    const text = `Raumbuchung: ${b.titel}\n${raum?.name}, ${standortName(
      b.standortId,
    )}\n${formatDatum(b.datum)}, ${b.von}–${b.bis} Uhr`
    navigator.clipboard?.writeText(text)
    toast.success("In Zwischenablage kopiert", {
      description: "Du kannst die Buchungsdetails jetzt teilen.",
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Meine Buchungen</h1>
          <p className="text-muted-foreground">
            Deine Raumbuchungen im Überblick.
          </p>
        </div>
        <Button onClick={() => navigate("/buchen")}>
          <CalendarPlus />
          Neue Buchung
        </Button>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <TabsList>
          <TabsTrigger value="kommend" className="gap-1.5">
            Kommende
            {eigene.filter((b) => !istVergangen(b.datum, heute)).length > 0 && (
              <Badge variant="secondary" className="h-4.5 px-1.5 py-0 text-xs">
                {eigene.filter((b) => !istVergangen(b.datum, heute)).length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="vergangen" className="gap-1.5">
            Vergangene
            {eigene.filter((b) => istVergangen(b.datum, heute)).length > 0 && (
              <Badge variant="secondary" className="h-4.5 px-1.5 py-0 text-xs">
                {eigene.filter((b) => istVergangen(b.datum, heute)).length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {gefiltert.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center text-muted-foreground">
            <CalendarCheck className="size-8" />
            <p>
              {tab === "kommend"
                ? "Du hast keine kommenden Buchungen."
                : "Keine vergangenen Buchungen."}
            </p>
            {tab === "kommend" && (
              <Button variant="outline" onClick={() => navigate("/buchen")}>
                Jetzt Raum buchen
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {gefiltert.map((b) => {
            const raum = raumById(b.raumId)
            const vergangen = istVergangen(b.datum, heute)
            return (
              <Card
                key={b.id}
                className={cn(
                  "cursor-pointer transition-colors hover:bg-muted/50",
                  vergangen && "opacity-60",
                )}
                onClick={() => setDetail(b)}
              >
                <CardContent className="flex flex-wrap items-center gap-4 p-4">
                  <div
                    className={cn(
                      "flex min-w-[64px] flex-col items-center rounded-lg px-3 py-2",
                      vergangen ? "bg-muted/50" : "bg-muted",
                    )}
                  >
                    <span className="text-xs text-muted-foreground">
                      {relativesDatum(b.datum, heute)}
                    </span>
                    <span className={cn("text-sm font-semibold", vergangen && "text-muted-foreground")}>
                      {b.von}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className={cn("font-medium", vergangen && "text-muted-foreground")}>
                      {b.titel}
                    </div>
                    <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="size-3.5" />
                        {raum?.name} · {standortName(b.standortId)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="size-3.5" />
                        {b.von}–{b.bis} Uhr
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    {!vergangen && (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Stornieren"
                        onClick={() => stornieren(b)}
                      >
                        <Trash2 className="text-destructive" />
                      </Button>
                    )}
                    <ChevronRight className="size-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Detail-Dialog */}
      <Dialog open={Boolean(detail)} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent className="sm:max-w-md">
          {detail &&
            (() => {
              const raum = raumById(detail.raumId)
              return (
                <>
                  <DialogHeader>
                    <DialogTitle>{detail.titel}</DialogTitle>
                    <DialogDescription>
                      {raum?.name} · {standortName(detail.standortId)} ·{" "}
                      {raum?.etage}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <CalendarCheck className="size-4 text-muted-foreground" />
                      {formatDatum(detail.datum)}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="size-4 text-muted-foreground" />
                      {detail.von}–{detail.bis} Uhr
                    </div>
                    {detail.notiz && (
                      <div className="flex items-start gap-2">
                        <StickyNote className="mt-0.5 size-4 text-muted-foreground" />
                        {detail.notiz}
                      </div>
                    )}
                    {raum && <AusstattungListe werte={raum.ausstattung} />}
                  </div>
                  <DialogFooter className="gap-2 sm:justify-between">
                    <Button
                      variant="outline"
                      onClick={() => teilen(detail)}
                    >
                      <Share2 />
                      Teilen
                    </Button>
                    {!istVergangen(detail.datum, heute) && (
                      <Button
                        variant="destructive"
                        onClick={() => stornieren(detail)}
                      >
                        <Trash2 />
                        Stornieren
                      </Button>
                    )}
                  </DialogFooter>
                </>
              )
            })()}
        </DialogContent>
      </Dialog>
    </div>
  )
}
