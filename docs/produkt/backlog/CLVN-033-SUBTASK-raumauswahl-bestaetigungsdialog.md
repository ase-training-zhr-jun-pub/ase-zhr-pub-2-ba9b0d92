---
Ticket-ID: CLVN-033
Type: Subtask
Story: CLVN-016
Status: DONE
---

# Raumauswahl-Bestätigungsdialog (UI)

## Kontext

Heute öffnet ein Klick auf „Wählen" in der `RaumKarte` direkt den Buchungs-Dialog mit dem vollständigen Formular. Die Story verlangt einen vorgelagerten Bestätigungsschritt, in dem der INNOQ-Mitarbeiter seine Raumauswahl überprüft, bevor er zur Eingabe der Buchungsdetails fortfährt.

## Beschreibung

Eine modale Komponente für die Bestätigung der Raumauswahl erstellen.

- Anzeige der Raumdetails: Name, Standort, Ausstattung, Kapazität (read-only)
- Anzeige des gewählten Zeitraums (Datum, von–bis)
- Visuelle Hervorhebung des ausgewählten Konferenzraums
- Schaltflächen „Auswahl ändern" (zurück/schließen) und „Weiter zur Buchung"
- Reine Darstellungs- und Interaktionskomponente; Callbacks nach außen

Die Verdrahtung in den Seitenfluss und die Backend-Aufrufe erfolgen in CLVN-034.
