# Calvin – End-to-End-Tests (Playwright)

End-to-End-Tests für das Calvin-Frontend mit [Playwright](https://playwright.dev).

## Was wird getestet

`tests/raumbuchung.spec.ts` deckt den vollständigen **Raumbuchungsprozess** ab:

1. Buchungsübersicht öffnen (`/#/buchungen`) und Anzahl bestehender Buchungen merken
2. Zur Buchen-Seite navigieren (Sidebar)
3. Standort im Header auswählen (Berlin)
4. Datum wählen (konfliktfreier Tag)
5. Raum auswählen ("Wählen")
6. Buchung durchführen: Bestätigungs-Dialog → Meetingtitel eingeben → "Buchung absenden"
7. Zurück zur Buchungsübersicht navigieren
8. Verifizieren, dass eine **neue** Buchung existiert (Anzahl +1 und der neue Eintrag ist sichtbar)

### Wichtige Besonderheiten

- **In-Memory-State:** Der App-State (Buchungen, Standort, Favoriten) liegt im
  Frontend-Store ohne Persistenz. Ein Page-Reload setzt ihn zurück, daher läuft
  der gesamte Flow in **einer** Browser-Session ohne `page.reload()`.
- **HashRouter:** URLs haben die Form `http://localhost:5173/#/buchungen`.
- **Backend-Mock:** Der Buchungs-Flow ruft den Booking Service auf
  (`GET /api/raeume/{id}/verfuegbarkeit`, `POST /api/buchungen`). Diese beiden
  Endpunkte werden per Playwright-Route-Mock abgefangen, sodass der Test
  **ohne laufendes Backend** grün ist.

## Voraussetzungen

- Node.js (>= 18) und npm
- Die Frontend-Abhängigkeiten müssen installiert sein:

  ```bash
  cd ../frontend && npm install
  ```

- Ein Chromium-Browser für Playwright. In der Trainings-Umgebung liegt er
  bereits unter `~/.cache/ms-playwright/`. Falls nicht vorhanden:

  ```bash
  npx playwright install chromium
  # Systembibliotheken (einmalig, benötigt sudo):
  npx playwright install-deps chromium
  ```

## Installation

```bash
cd e2e
npm install
```

## Tests ausführen

```bash
cd e2e
npm test            # headless (Standard)
npm run report      # HTML-Report des letzten Laufs öffnen
```

Der `webServer`-Block in `playwright.config.ts` startet das Frontend automatisch
per `npm run build && npm run preview` auf Port 5173 (der dokumentierte Weg, da
`npm run dev` hinter dem Crucible-Proxy eine leere Seite liefert). Ein bereits
laufender Server auf Port 5173 wird wiederverwendet.

## Konfiguration

- **baseURL:** `http://localhost:5173`
- **Browser:** Chromium, headless. Über die Umgebungsvariable
  `PLAYWRIGHT_CHROMIUM_PATH` lässt sich ein abweichendes Chromium-Binary setzen;
  der Standard zeigt auf das gecachte Binary unter `~/.cache/ms-playwright/`.
- **Timeouts:** Test 60 s, Assertions 10 s, WebServer-Start bis 180 s.
