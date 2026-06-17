import { Star, Users, MapPin, Check, X } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AusstattungListe } from "@/components/ausstattung-badge"
import { cn } from "@/lib/utils"
import { useApp } from "@/lib/store"
import { standortName, type Raum } from "@/lib/mock-data"

interface Props {
  raum: Raum
  /** Wenn gesetzt, wird der Verfügbarkeitsstatus angezeigt */
  verfuegbarkeit?: { datum: string; von: string; bis: string }
  onBuchen: (raum: Raum) => void
}

export function RaumKarte({ raum, verfuegbarkeit, onBuchen }: Props) {
  const { istFavorit, toggleFavorit, istVerfuegbar } = useApp()

  const frei = verfuegbarkeit
    ? istVerfuegbar(raum.id, verfuegbarkeit.datum, verfuegbarkeit.von, verfuegbarkeit.bis)
    : null

  const fav = istFavorit(raum.id)

  return (
    <Card className={cn(frei === false && "opacity-70")}>
      <CardContent className="flex flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{raum.name}</h3>
              {frei === true && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  <Check className="size-3" /> frei
                </span>
              )}
              {frei === false && (
                <span className="inline-flex items-center gap-1 rounded-full bg-destructive/15 px-2 py-0.5 text-xs font-medium text-destructive">
                  <X className="size-3" /> belegt
                </span>
              )}
            </div>
            <div className="mt-0.5 flex items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="size-3.5" />
                {standortName(raum.standortId)} · {raum.etage}
              </span>
              <span className="flex items-center gap-1">
                <Users className="size-3.5" />
                {raum.kapazitaet}
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={fav ? "Favorit entfernen" : "Als Favorit markieren"}
            onClick={() => toggleFavorit(raum.id)}
          >
            <Star
              className={cn(
                "size-4",
                fav && "fill-amber-400 text-amber-400",
              )}
            />
          </Button>
        </div>

        <p className="text-sm text-muted-foreground">{raum.beschreibung}</p>

        <AusstattungListe werte={raum.ausstattung} />

        <div className="mt-1">
          <Button
            className="w-full"
            variant={frei === false ? "outline" : "default"}
            disabled={frei === false}
            onClick={() => onBuchen(raum)}
          >
            {frei === false ? "Belegt" : "Wählen"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
