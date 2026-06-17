---
Ticket-ID: CLVN-031
Type: Subtask
Story: CLVN-016
Status: TODO
---

# Buchungs-Entwurf-Endpoint

## Kontext

Nach Bestätigung der Raumauswahl legt das Frontend einen vorläufigen Buchungs-Entwurf an, der in späteren Schritten (Meetingtitel, Buchungsnotiz) vervollständigt wird. Der Endpoint nutzt das Buchung-Domain-Model (CLVN-029) und die Verfügbarkeitslogik (CLVN-030).

## Beschreibung

Einen REST-Endpoint bereitstellen, der einen Buchungs-Entwurf für einen Konferenzraum und Zeitraum erstellt und persistiert.

- `POST /api/buchungen` nimmt Raum-ID, Standort-ID, Datum und Zeitraum entgegen und legt eine Buchung mit Status `ENTWURF` an
- Service-Methode mit `@Transactional`, die vor dem Anlegen die Verfügbarkeit prüft (Schutz gegen Doppelbuchung, QS-1)
- Request- und Response-DTOs (keine Entity als HTTP-Body)
- Controller-Test mit MockMvc inkl. Konfliktfall (belegter Raum)

Datenzugriff ausschließlich über die Service-Schicht.
