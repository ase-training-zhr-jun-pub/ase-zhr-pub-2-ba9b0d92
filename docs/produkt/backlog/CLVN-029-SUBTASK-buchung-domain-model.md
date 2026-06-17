---
Ticket-ID: CLVN-029
Type: Subtask
Story: CLVN-016
Status: TODO
---

# Buchung-Domain-Model und Repository

## Kontext

Aufbauend auf der Persistenz-Foundation (CLVN-028) benötigt der Booking Service ein Domänenmodell für Raumbuchungen. Gemäß ADR-003 arbeitet der Service nur mit IDs aus den Mock-Daten der SPA (Konferenzraum, Standort). Eine Buchung kann den Status `ENTWURF` haben, da die Raumauswahl-Bestätigung zunächst nur einen vorläufigen Buchungs-Entwurf anlegt.

## Beschreibung

Das Domänenmodell für eine Raumbuchung sowie den Datenzugriff bereitstellen.

- `Buchung`-Entity mit den fachlich notwendigen Feldern: Raum-ID, Standort-ID, Datum, Zeitraum (von/bis) und Status (z. B. `ENTWURF`)
- Spring-Data-Repository für den Zugriff auf Buchungen, inkl. einer Abfragemöglichkeit für überlappende Buchungen eines Konferenzraums (Grundlage der späteren Doppelbuchungs-Prüfung)
- Repository-Test mit `@DataJpaTest`

Noch kein Controller und keine REST-Schnittstelle in diesem Ticket.
