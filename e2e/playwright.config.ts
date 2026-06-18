import { defineConfig, devices } from "@playwright/test"

/**
 * Playwright-Konfiguration für die Calvin-E2E-Tests.
 *
 * Das Frontend wird über `npm run build && npm run preview` gestartet
 * (dokumentierter Weg, da `npm run dev` hinter dem Crucible-Proxy eine leere
 * Seite liefert). Der `webServer`-Block baut + startet die App automatisch.
 *
 * Tests laufen headless gegen ein gecachtes Chromium. Falls die Umgebungs-
 * variable PLAYWRIGHT_CHROMIUM_PATH gesetzt ist, wird dieser Browser genutzt
 * (vermeidet einen erneuten Download).
 */

const BASE_URL = "http://localhost:5173"

// Pfad zum vollständigen Chromium-Binary aus dem Cache. Wir nutzen bewusst das
// vollständige `chrome`-Binary (nicht den `chrome-headless-shell`), da diesem
// in der Trainings-Umgebung Systembibliotheken (libglib) fehlen. Über
// PLAYWRIGHT_CHROMIUM_PATH lässt sich der Pfad bei Bedarf überschreiben.
const chromiumPath =
  process.env.PLAYWRIGHT_CHROMIUM_PATH ??
  "/home/coder/.cache/ms-playwright/chromium-1228/chrome-linux64/chrome"

export default defineConfig({
  testDir: "./tests",
  // Der gesamte Buchungs-Flow muss in EINER Session ohne Reload ablaufen
  // (In-Memory-Store) – daher keine Parallelisierung innerhalb der Datei.
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [["list"], ["html", { open: "never" }]],
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  use: {
    baseURL: BASE_URL,
    headless: true,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        ...(chromiumPath
          ? { launchOptions: { executablePath: chromiumPath } }
          : {}),
      },
    },
  ],
  webServer: {
    // Baut das Frontend und startet den Vite-Preview-Server auf Port 5173.
    command: "npm run build && npm run preview -- --port 5173 --host 127.0.0.1",
    cwd: "../frontend",
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    stdout: "pipe",
    stderr: "pipe",
  },
})
