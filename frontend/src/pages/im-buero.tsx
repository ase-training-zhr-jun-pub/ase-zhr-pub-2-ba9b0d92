import { useMemo, useState } from "react"
import { Users, UserCheck } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useApp } from "@/lib/store"
import { KOLLEGEN, standortName } from "@/lib/mock-data"
import { formatDatum, relativesDatum } from "@/lib/format"
import { cn } from "@/lib/utils"

function naechsteTage(anzahl: number): string[] {
  const tage: string[] = []
  const d = new Date()
  for (let i = 0; i < anzahl; i++) {
    tage.push(d.toISOString().slice(0, 10))
    d.setDate(d.getDate() + 1)
  }
  return tage
}

export function ImBueroPage() {
  const { standortId } = useApp()
  const heute = new Date().toISOString().slice(0, 10)
  const tage = useMemo(() => naechsteTage(7), [])
  const [tag, setTag] = useState(heute)

  const amStandort = KOLLEGEN.filter((k) => k.standortId === standortId)
  const anwesend = amStandort.filter((k) => k.anwesend.includes(tag))
  const quote = amStandort.length
    ? Math.round((anwesend.length / amStandort.length) * 100)
    : 0

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Im Büro</h1>
        <p className="text-muted-foreground">
          Wer ist wann in {standortName(standortId)} vor Ort? Plane deine
          Bürotage rund um persönliche Treffen.
        </p>
      </div>

      {/* Tagesauswahl */}
      <div className="flex flex-wrap gap-2">
        {tage.map((t) => (
          <Button
            key={t}
            variant={t === tag ? "default" : "outline"}
            size="sm"
            onClick={() => setTag(t)}
          >
            {relativesDatum(t, heute)}
          </Button>
        ))}
      </div>

      {/* Auslastung */}
      <Card>
        <CardContent className="flex flex-col gap-3 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-medium">
              <Users className="size-4" />
              Auslastung am {formatDatum(tag)}
            </div>
            <span className="text-sm text-muted-foreground">
              {anwesend.length} von {amStandort.length} Kolleg:innen
            </span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${quote}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Anwesende */}
      {anwesend.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-12 text-center text-muted-foreground">
            <UserCheck className="size-8" />
            <p>An diesem Tag ist niemand in {standortName(standortId)} angemeldet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {anwesend.map((k) => (
            <Card key={k.id}>
              <CardContent className="flex items-center gap-3 p-4">
                <div
                  className={cn(
                    "flex size-10 items-center justify-center rounded-full bg-primary/10 font-medium text-primary",
                  )}
                >
                  {k.initialen}
                </div>
                <div>
                  <div className="font-medium">{k.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {standortName(k.standortId)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
