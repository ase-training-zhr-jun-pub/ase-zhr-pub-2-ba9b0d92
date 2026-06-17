import {
  Projector,
  PenLine,
  Video,
  Presentation,
  Tv,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import type { Ausstattung } from "@/lib/mock-data"

const ICONS: Record<Ausstattung, React.ComponentType<{ className?: string }>> = {
  Beamer: Projector,
  Whiteboard: PenLine,
  Videokonferenz: Video,
  Flipchart: Presentation,
  "TV-Bildschirm": Tv,
}

export function AusstattungBadge({ wert }: { wert: Ausstattung }) {
  const Icon = ICONS[wert]
  return (
    <Badge variant="secondary" className="gap-1 font-normal">
      <Icon className="size-3" />
      {wert}
    </Badge>
  )
}

export function AusstattungListe({ werte }: { werte: Ausstattung[] }) {
  return (
    <div className="flex flex-wrap gap-1">
      {werte.map((w) => (
        <AusstattungBadge key={w} wert={w} />
      ))}
    </div>
  )
}
