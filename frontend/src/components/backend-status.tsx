import { useEffect, useState } from "react"
import { CheckCircle2, XCircle, Loader2, Server } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { apiBaseUrl, fetchHello } from "@/lib/api"

type Status =
  | { state: "loading" }
  | { state: "ok"; message: string }
  | { state: "error"; message: string }

/**
 * Prüft beim Laden die Verbindung zum Booking Service über GET /api/hello
 * und zeigt das Ergebnis an – als sichtbarer Beleg für eine laufende
 * Front-/Backend-Verbindung.
 */
export function BackendStatus() {
  const [status, setStatus] = useState<Status>({ state: "loading" })

  useEffect(() => {
    let aktiv = true
    fetchHello()
      .then((text) => aktiv && setStatus({ state: "ok", message: text }))
      .catch(
        (err) =>
          aktiv &&
          setStatus({ state: "error", message: String(err.message ?? err) }),
      )
    return () => {
      aktiv = false
    }
  }, [])

  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <Server className="size-5 text-muted-foreground" />
        <div className="flex-1">
          <div className="text-sm font-medium">Booking Service</div>
          <div className="text-xs text-muted-foreground">{apiBaseUrl()}/api/hello</div>
        </div>
        {status.state === "loading" && (
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Verbinde…
          </span>
        )}
        {status.state === "ok" && (
          <span
            className={cn(
              "flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-1 text-sm font-medium",
              "text-emerald-600 dark:text-emerald-400",
            )}
          >
            <CheckCircle2 className="size-4" />
            {status.message}
          </span>
        )}
        {status.state === "error" && (
          <span className="flex items-center gap-1.5 rounded-full bg-destructive/15 px-2.5 py-1 text-sm font-medium text-destructive">
            <XCircle className="size-4" />
            Nicht erreichbar ({status.message})
          </span>
        )}
      </CardContent>
    </Card>
  )
}
