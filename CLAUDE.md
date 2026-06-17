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

## Anwendung starten

### Frontend (`frontend/`, Port 5173)

```bash
cd frontend
npm run build && npm run preview   # Proxy-Betrieb (Crucible) – immer so starten
npm run dev                        # nur lokal ohne Proxy (hot reload)
npm run lint
npx shadcn@latest add <name> --overwrite
```

**Wichtig – Proxy-Betrieb (Crucible):** `npm run dev` liefert hinter dem Proxy eine leere Seite (absolute Asset-Pfade). **Immer** `npm run build && npm run preview` verwenden.

**Frontend-URL (Crucible):**
```bash
echo "${VSCODE_PROXY_URI/\{\{port\}\}/5173}"
```

### Backend (`backend/`, Port 8081)

```bash
bash scripts/install-sdk.sh   # einmalig nach Codespace-Neustart (Java/Maven via SDKMAN)

cd backend
./mvnw spring-boot:run        # starten
./mvnw test                   # alle Tests
./mvnw test -Dtest=KlassenName  # einzelner Test
./mvnw verify                 # Build + Tests
```

**Backend-URL (Crucible):**
```bash
echo "${VSCODE_PROXY_URI/\{\{port\}\}/8081}"
# → z. B. https://crucible.ch.innoq.io/t/.../s/.../proxy/8081/
# REST-Endpunkt: <backend-url>/api/hello
```

**Stack (ADR-002):** Java 21 · Spring Boot 4.1 · Spring Web (REST) · Maven · Port 8081 (Port 8080 in Crucible durch VS-Code-Server belegt)

## Frontend-Konventionen

- Import-Alias `@/` → `frontend/src/`
- Eigene Komponenten: `frontend/src/components/` · ShadCN-Komponenten: `frontend/src/components/ui/`
- Seiten: `frontend/src/pages/`
- Zentrale Mock-Daten: `frontend/src/lib/mock-data.ts`
- App-State (Buchungen, Favoriten, Standort): `frontend/src/lib/store.tsx`
- Routing via HashRouter (proxy-kompatibel), Routen in `frontend/src/App.tsx`
- Styling: Tailwind-Klassen + `cn()` aus `@/lib/utils`

## Backend-Konventionen

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
- **playwright** – Browser-Automatisierung zur visuellen Verifikation von Frontend-Änderungen (Chromium unter `~/.cache/ms-playwright/`)
