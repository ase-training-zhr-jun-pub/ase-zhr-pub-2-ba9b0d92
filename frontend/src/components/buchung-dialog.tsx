import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { CalendarCheck, TriangleAlert } from "lucide-react"
import { toast } from "sonner"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AusstattungListe } from "@/components/ausstattung-badge"
import { useApp } from "@/lib/store"
import { AKTUELLER_NUTZER, standortName, type Raum } from "@/lib/mock-data"
import { formatDatum } from "@/lib/format"

interface Props {
  raum: Raum | null
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Vorbelegte Werte aus der Raumsuche */
  initial?: { datum: string; von: string; bis: string }
}

export function BuchungDialog({ raum, open, onOpenChange, initial }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        {raum && open && (
          // key sorgt für frischen State bei jedem Öffnen / Raumwechsel
          <BuchungForm
            key={`${raum.id}-${initial?.datum ?? ""}-${initial?.von ?? ""}`}
            raum={raum}
            initial={initial}
            onClose={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

function BuchungForm({
  raum,
  initial,
  onClose,
}: {
  raum: Raum
  initial?: { datum: string; von: string; bis: string }
  onClose: () => void
}) {
  const { addBuchung, istVerfuegbar } = useApp()
  const navigate = useNavigate()
  const heute = new Date().toISOString().slice(0, 10)
  const [datum, setDatum] = useState(initial?.datum ?? heute)
  const [von, setVon] = useState(initial?.von ?? "09:00")
  const [bis, setBis] = useState(initial?.bis ?? "10:00")
  const [titel, setTitel] = useState("")
  const [notiz, setNotiz] = useState("")

  const zeitOk = von < bis
  const frei = zeitOk && istVerfuegbar(raum.id, datum, von, bis)
  const kannBuchen = Boolean(datum) && zeitOk && frei && titel.trim().length > 0

  function buchen() {
    if (!kannBuchen) return
    addBuchung({
      raumId: raum.id,
      standortId: raum.standortId,
      titel: titel.trim(),
      datum,
      von,
      bis,
      notiz: notiz.trim() || undefined,
      organisator: AKTUELLER_NUTZER.name,
    })
    onClose()
    navigate("/buchung-bestaetigung")
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Konferenzraum buchen</DialogTitle>
        <DialogDescription>
          {raum.name} · {standortName(raum.standortId)} · {raum.kapazitaet}{" "}
          Personen
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4">
        <AusstattungListe werte={raum.ausstattung} />

        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-3 grid gap-1.5 sm:col-span-1">
            <Label htmlFor="datum">Datum</Label>
            <Input
              id="datum"
              type="date"
              value={datum}
              onChange={(e) => setDatum(e.target.value)}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="von">Von</Label>
            <Input
              id="von"
              type="time"
              value={von}
              onChange={(e) => setVon(e.target.value)}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="bis">Bis</Label>
            <Input
              id="bis"
              type="time"
              value={bis}
              onChange={(e) => setBis(e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="titel">Meetingtitel</Label>
          <Input
            id="titel"
            placeholder="z. B. Team Sync"
            value={titel}
            onChange={(e) => setTitel(e.target.value)}
          />
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="notiz">Buchungsnotiz (optional)</Label>
          <Input
            id="notiz"
            placeholder="z. B. Bitte Bestuhlung für 8 Personen"
            value={notiz}
            onChange={(e) => setNotiz(e.target.value)}
          />
        </div>

        {!zeitOk && (
          <p className="flex items-center gap-1.5 text-sm text-destructive">
            <TriangleAlert className="size-4" />
            Die Endzeit muss nach der Startzeit liegen.
          </p>
        )}
        {zeitOk && !frei && (
          <p className="flex items-center gap-1.5 text-sm text-destructive">
            <TriangleAlert className="size-4" />
            Der Raum ist in diesem Zeitfenster bereits belegt.
          </p>
        )}
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Abbrechen
        </Button>
        <Button onClick={buchen} disabled={!kannBuchen}>
          <CalendarCheck />
          Buchung bestätigen
        </Button>
      </DialogFooter>
    </>
  )
}
