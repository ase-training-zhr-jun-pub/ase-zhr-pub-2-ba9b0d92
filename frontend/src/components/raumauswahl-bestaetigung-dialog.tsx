import { ArrowRight, CalendarDays, Clock, Loader2, MapPin, Users } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AusstattungListe } from "@/components/ausstattung-badge"
import { standortName, type Raum } from "@/lib/mock-data"
import { formatDatum } from "@/lib/format"

interface Props {
  raum: Raum | null
  open: boolean
  onOpenChange: (open: boolean) => void
  datum: string
  von: string
  bis: string
  onWeiter: () => void
  laedt?: boolean
}

export function RaumauswahlBestaetigungDialog({
  raum,
  open,
  onOpenChange,
  datum,
  von,
  bis,
  onWeiter,
  laedt = false,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        {raum && open && (
          <>
            <DialogHeader>
              <DialogTitle>Raumauswahl bestätigen</DialogTitle>
              <DialogDescription>
                Bitte überprüfe deine Auswahl vor dem Fortfahren.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4">
              <div className="rounded-lg border bg-card p-4 grid gap-3">
                <div>
                  <p className="text-lg font-semibold">{raum.name}</p>
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3.5" />
                      {standortName(raum.standortId)} · {raum.etage}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="size-3.5" />
                      {raum.kapazitaet} Personen
                    </span>
                  </div>
                </div>

                {raum.ausstattung.length > 0 && (
                  <AusstattungListe werte={raum.ausstattung} />
                )}
              </div>

              <div className="rounded-lg bg-muted p-3 grid gap-1.5">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Gewählter Zeitraum
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="size-4 text-muted-foreground" />
                    {formatDatum(datum)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="size-4 text-muted-foreground" />
                    {von}–{bis} Uhr
                  </span>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Auswahl ändern
              </Button>
              <Button onClick={onWeiter} disabled={laedt}>
                {laedt ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <ArrowRight />
                )}
                Weiter zur Buchung
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
