---
Ticket-ID: CLVN-030
Type: Subtask
Story: CLVN-016
Status: TODO
---

# Verfügbarkeitsprüfung-Endpoint

## Kontext

Bei der Bestätigung einer Raumauswahl muss geprüft werden, ob der gewählte Konferenzraum im gewünschten Zeitraum noch frei ist, um Doppelbuchungen zu vermeiden. Die Prüfung nutzt das Buchung-Domain-Model und Repository aus CLVN-029.

## Beschreibung

Einen REST-Endpoint bereitstellen, der für einen Konferenzraum und einen Zeitraum zurückgibt, ob dieser verfügbar ist.

- Service mit der fachlichen Logik zur Konflikt- bzw. Doppelbuchungs-Prüfung (Überlappung mit bestehenden Buchungen desselben Raums)
- REST-Controller unter `/api/...` mit Request-Parametern für Raum-ID, Datum und Zeitraum
- Klar getrennte Response-DTOs (keine Entity direkt serialisieren)
- Controller-Test mit MockMvc für verfügbare und belegte Fälle

Geschäftslogik liegt im Service, nicht im Controller.
