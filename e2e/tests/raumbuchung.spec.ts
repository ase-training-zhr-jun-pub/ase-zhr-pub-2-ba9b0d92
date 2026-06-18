import { test, expect, type Page } from "@playwright/test"

/**
 * E2E-Test für den Raumbuchungsprozess von Calvin.
 *
 * Abgedeckter Flow:
 *   1. Buchungsübersicht öffnen (/#/buchungen) und bestehende Buchungen zählen
 *   2. Zur Buchen-Seite navigieren
 *   3. Standort im Header auswählen
 *   4. Datum wählen (freier, konfliktfreier Tag)
 *   5. Raum auswählen ("Wählen")
 *   6. Buchung durchführen (Bestätigungs-Dialog -> Meetingtitel -> Absenden)
 *   7. Zurück zur Buchungsübersicht
 *   8. Verifizieren, dass eine NEUE Buchung existiert (Anzahl +1, neuer Titel sichtbar)
 *
 * WICHTIG: Der App-State liegt in-memory (Reset bei Reload), daher läuft der
 * gesamte Flow in EINER Browser-Session ohne page.reload(). Wir navigieren
 * ausschließlich über die App-eigene Sidebar / Buttons bzw. Hash-Routen.
 *
 * Das Backend (Booking Service) wird nicht benötigt: Die beiden Aufrufe
 * (Verfügbarkeitsprüfung + Entwurf anlegen) werden per Route-Mock abgefangen,
 * damit der Test unabhängig vom laufenden Spring-Boot-Service grün ist.
 */

// Gewählter Standort und Raum für den Test.
const STANDORT_NAME = "Berlin"
// Berlin-Räume aus mock-data; "Spree" ist an einem konfliktfreien Tag frei.
const RAUM_NAME = "Spree"

// Konfliktfreies Datum: weit jenseits der geseedeten Buchungen (-7 .. +5 Tage).
function konfliktfreiesDatum(): string {
  const d = new Date()
  d.setDate(d.getDate() + 14)
  return d.toISOString().slice(0, 10)
}

// Eindeutiger Meetingtitel, um die neue Buchung sicher zu identifizieren.
const MEETING_TITEL = `E2E Buchung ${Date.now()}`

/** Mockt die beiden Backend-Endpunkte des Booking Service. */
async function mockBackend(page: Page) {
  // GET /api/raeume/{id}/verfuegbarkeit -> { verfuegbar: true }
  await page.route(/\/api\/raeume\/.+\/verfuegbarkeit/, (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ verfuegbar: true }),
    }),
  )

  // POST /api/buchungen -> 201 mit Entwurf
  await page.route(/\/api\/buchungen$/, (route) =>
    route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({
        id: 9999,
        raumId: "berlin-spree",
        standortId: "berlin",
        datum: konfliktfreiesDatum(),
        von: "09:00",
        bis: "10:00",
        status: "ENTWURF",
      }),
    }),
  )
}

test("Raumbuchungsprozess: neue Buchung anlegen und in der Übersicht sehen", async ({
  page,
}) => {
  await mockBackend(page)

  // --- 1. Buchungsübersicht öffnen ----------------------------------------
  await page.goto("/#/buchungen")
  await expect(
    page.getByRole("heading", { name: "Meine Buchungen" }),
  ).toBeVisible()

  // --- 2. Anzahl der bisherigen (kommenden) Buchungen merken ---------------
  // Buchungskarten haben eine "Stornieren"-Aktion (nur bei kommenden Buchungen).
  const buchungsKarten = page.getByRole("button", { name: "Stornieren" })
  const anzahlVorher = await buchungsKarten.count()

  // --- 3. Zur Buchen-Seite navigieren (Sidebar) ----------------------------
  await page.getByRole("link", { name: "Raum buchen" }).click()
  await expect(
    page.getByRole("heading", { name: "Raum buchen" }),
  ).toBeVisible()

  // --- 4. Standort im Header auswählen -------------------------------------
  // ShadCN/base-ui Select: Trigger ist eine Combobox.
  const standortSelect = page.getByRole("combobox").first()
  await standortSelect.click()
  await page.getByRole("option", { name: STANDORT_NAME }).click()
  // Header zeigt jetzt den gewählten Standort.
  await expect(standortSelect).toContainText(STANDORT_NAME)

  // --- 5. Datum wählen (konfliktfrei) --------------------------------------
  const datum = konfliktfreiesDatum()
  await page.locator("#f-datum").fill(datum)

  // --- 6. Raum auswählen ----------------------------------------------------
  // Karte des gewünschten Raums finden und "Wählen" klicken.
  const raumKarte = page
    .locator("div")
    .filter({ has: page.getByRole("heading", { name: RAUM_NAME, exact: true }) })
    .filter({ has: page.getByRole("button", { name: "Wählen" }) })
    .last()
  await expect(raumKarte).toBeVisible()
  await raumKarte.getByRole("button", { name: "Wählen" }).click()

  // --- 7a. Bestätigungs-Dialog: "Weiter zur Buchung" -----------------------
  const bestaetigungDialog = page.getByRole("dialog")
  await expect(
    bestaetigungDialog.getByText("Raumauswahl bestätigen"),
  ).toBeVisible()
  await page.getByRole("button", { name: "Weiter zur Buchung" }).click()

  // --- 7b. Buchungs-Dialog: Meetingtitel + Absenden ------------------------
  await expect(
    page.getByRole("dialog").getByText("Konferenzraum buchen"),
  ).toBeVisible()
  await page.locator("#titel").fill(MEETING_TITEL)

  const absendenButton = page.getByRole("button", { name: "Buchung absenden" })
  await expect(absendenButton).toBeEnabled()
  await absendenButton.click()

  // --- 7c. Bestätigungsseite -----------------------------------------------
  await expect(
    page.getByText("Konferenzraum erfolgreich gebucht!"),
  ).toBeVisible()
  await expect(page.getByText(MEETING_TITEL)).toBeVisible()

  // --- 8. Zurück zur Buchungsübersicht -------------------------------------
  await page.getByRole("button", { name: "Meine Buchungen" }).click()
  await expect(
    page.getByRole("heading", { name: "Meine Buchungen" }),
  ).toBeVisible()

  // --- 9. Verifizieren: neue Buchung existiert -----------------------------
  // Die neue Buchung (Datum +14) ist eine "kommende" Buchung.
  const anzahlNachher = await buchungsKarten.count()
  expect(anzahlNachher).toBe(anzahlVorher + 1)

  // Und der konkrete neue Eintrag ist sichtbar.
  await expect(page.getByText(MEETING_TITEL)).toBeVisible()
})
