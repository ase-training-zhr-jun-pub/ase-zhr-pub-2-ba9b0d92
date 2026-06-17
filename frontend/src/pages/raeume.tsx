import { useMemo, useState } from "react"
import { Star, Building2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
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
            <RaumKarte key={raum.id} raum={raum} onBuchen={buchen} />
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
