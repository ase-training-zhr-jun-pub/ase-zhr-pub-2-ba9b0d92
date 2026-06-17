---
Ticket-ID: CLVN-032
Type: Subtask
Story: CLVN-016
Status: TODO
---

# Frontend-API-Anbindung an den Booking Service

## Kontext

Das Frontend arbeitet bisher rein mit dem lokalen Store (Mock). Für die Raumauswahl-Bestätigung muss es die neuen Backend-Endpoints aus CLVN-030 (Verfügbarkeitsprüfung) und CLVN-031 (Buchungs-Entwurf) aufrufen. Die Basis-URL des Backends wird bereits in `frontend/src/lib/api.ts` zur Laufzeit abgeleitet.

## Beschreibung

Die Backend-Aufrufe für die Raumauswahl-Bestätigung im Frontend bereitstellen.

- `api.ts` um eine Funktion zur Verfügbarkeitsprüfung erweitern (Raum-ID + Zeitraum → verfügbar ja/nein)
- `api.ts` um eine Funktion zum Anlegen eines Buchungs-Entwurfs erweitern
- Fehlerbehandlung analog zu `fetchHello` (HTTP-Status auswerten)
- Typen für Request/Response passend zu den Backend-DTOs

Reine Anbindungsschicht — keine UI-Änderungen in diesem Ticket.
