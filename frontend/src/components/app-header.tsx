import { MapPin, Moon, Sun } from "lucide-react"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { STANDORTE, standortName } from "@/lib/mock-data"
import { useApp } from "@/lib/store"
import { useTheme } from "@/lib/theme"

export function AppHeader() {
  const { standortId, setStandortId } = useApp()
  const { theme, toggleTheme } = useTheme()

  const standorteDE = STANDORTE.filter((s) => s.land === "DE")
  const standorteCH = STANDORTE.filter((s) => s.land === "CH")

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-2 border-b bg-background/95 px-4 backdrop-blur">
      <SidebarTrigger />
      <Separator orientation="vertical" className="mr-1 h-5" />

      <MapPin className="size-4 text-muted-foreground" />
      <Select
        value={standortId}
        onValueChange={(v) => v && setStandortId(v)}
      >
        <SelectTrigger size="sm" className="w-[180px]">
          <SelectValue placeholder="Standort wählen">
            {(value) => standortName(value as string)}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Deutschland</SelectLabel>
            {standorteDE.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.name}
              </SelectItem>
            ))}
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>Schweiz</SelectLabel>
            {standorteCH.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <div className="ml-auto flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label="Theme wechseln"
        >
          {theme === "dark" ? <Sun /> : <Moon />}
        </Button>
      </div>
    </header>
  )
}
