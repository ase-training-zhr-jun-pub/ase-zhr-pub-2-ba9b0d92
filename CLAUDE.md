# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projekt

**Calvin** ist INNOQs internes Raum- und Arbeitsplatzbuchungssystem (8 Standorte). Architektur: React-SPA (Prototyp) + Spring-Boot-Booking-Service (in Entwicklung). Alle Architekturentscheidungen und Qualitätsanforderungen liegen unter `docs/`.

## Commits

Conventional Commits verwenden (feat, fix, docs, chore, …).

## Dokumentation

Bei Unklarheiten immer zuerst `docs/` lesen – insbesondere:
- `docs/produkt/glossar.md` – Ubiquitous Language (Begriffe konsequent so verwenden)
- `docs/arc42/adrs/` – Architekturentscheidungen (ADR-001 bis ADR-004)
- `docs/architektur/technische-schulden.md` – bewusst eingegangene Vereinfachungen

## Frontend (`frontend/`)

**Stack:** React 19 · TypeScript · Vite · Tailwind CSS v4 · ShadCN UI (base-nova)

```bash
cd frontend
npm run dev        # Dev-Server auf :5173 (hot reload, nur lokal)
npm run build      # Production-Build (notwendig für Proxy-Betrieb)
npm run preview    # Production-Build hinter Proxy ausliefern (Port 5173)
npm run lint       # ESLint
npx shadcn@latest add <name> --overwrite  # ShadCN-Komponente hinzufügen
```

**Wichtig – Proxy-Betrieb (Crucible):** Der Dev-Server (`npm run dev`) funktioniert hinter dem Crucible-Proxy **nicht** (absolute Asset-Pfade). Für den Proxy-Betrieb immer `npm run build && npm run preview` verwenden. Port-URL aus `$VSCODE_PROXY_URI` ableiten.

**Konventionen:**
- Import-Alias `@/` → `frontend/src/`
- Eigene Komponenten: `frontend/src/components/` · ShadCN-Komponenten: `frontend/src/components/ui/`
- Seiten: `frontend/src/pages/`
- Zentrale Mock-Daten (kein Backend): `frontend/src/lib/mock-data.ts`
- App-State (Buchungen, Favoriten, Standort): `frontend/src/lib/store.tsx`
- Routing via HashRouter (proxy-kompatibel), Routen in `frontend/src/App.tsx`
- Styling: Tailwind-Klassen + `cn()` aus `@/lib/utils`

## Backend (`backend/`)

**Stack (ADR-002):** Java 21 · Spring Boot 4.1 · Spring Web (REST) · Maven  
Läuft auf **Port 8081** (8080 ist in der Crucible-Umgebung durch den VS-Code-Server belegt).

```bash
# SDK installieren (einmalig nach Codespace-Neustart):
bash scripts/install-sdk.sh

cd backend
./mvnw spring-boot:run              # Dev-Server starten
./mvnw test                         # Alle Tests
./mvnw test -Dtest=KlassenName      # Einzelner Test
./mvnw verify                       # Build + Tests
```

**Frontend→Backend URL:** `frontend/src/lib/api.ts` leitet `apiBaseUrl()` aus `window.location` ab — kein Hard-coding nötig. Funktioniert in Crucible (`…/proxy/8081/`), Codespaces und lokal.

**Auth (ADR-004):** Im Prototyp passwortlose Basic-Auth (kein Passwort-Check). Okta/OIDC folgt beim Produktivbetrieb – siehe technische Schulden TS-1.

**Stammdaten (ADR-003):** Der Booking Service arbeitet nur mit IDs aus den Mock-Daten der SPA. Eigene Stammdaten-Persistenz ist TS-2.

## Skills (`.claude/skills/`)

Wiederverwendbare Prompt-Skills – aufrufbar mit `/skillname`:

| Skill | Aufruf | Zweck |
|---|---|---|
| `epic` | `/epic <Backbone-Item>` | Epic aus User-Story-Map erstellen |
| `user-story` | `/user-story @docs/produkt/backlog/CLVN-XXX-EPIC-name.md` | Alle fehlenden Story-Tickets eines Epics erstellen |
| `pr` | `/pr` | Pull Request erstellen |
| `frontend-prototype` | `/frontend-prototype` | Geführter Frontend-Prototyping-Workflow |
| `subtasks` | `/subtasks` | Subtasks aus einer User Story erstellen |

Ticket-Nummern folgen dem Schema `CLVN-XXX`. Die nächste freie Nummer ermittelt `.claude/skills/epic/scripts/get-next-ticket-number`.

## MCP-Server

- **context7** – aktuelle Bibliotheks-Doku abrufen (bei unbekannten APIs immer zuerst nutzen)
- **playwright** – Browser-Automatisierung zur visuellen Verifikation von Frontend-Änderungen (Chromium unter `/opt/playwright-browsers/`)
