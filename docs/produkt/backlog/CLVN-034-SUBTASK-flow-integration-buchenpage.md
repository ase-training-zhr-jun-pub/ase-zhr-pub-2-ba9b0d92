---
Ticket-ID: CLVN-034
Type: Subtask
Story: CLVN-016
Status: DONE
---

# Flow-Integration in die BuchenPage

## Kontext

Mit dem Bestätigungsdialog (CLVN-033) und der API-Anbindung (CLVN-032) müssen die Einzelteile zum vollständigen Auswahl-Flow verbunden werden. Ziel ist der Übergang von der Raumsuche über die Bestätigung der Raumauswahl bis zur Eingabe der Buchungsdetails.

## Beschreibung

Den Auswahl- und Bestätigungs-Flow in `BuchenPage` verdrahten.

- Klick auf „Wählen" öffnet künftig den Bestätigungsdialog (statt direkt das Buchungsformular)
- Beim Fortfahren wird die Verfügbarkeit beim Backend geprüft und ein Buchungs-Entwurf angelegt (CLVN-032)
- Nach erfolgreicher Bestätigung Weiterleitung zur Eingabe weiterer Buchungsdetails (bestehender `BuchungDialog`)
- Auswahl kann vor der Bestätigung geändert werden; Fehler-/Konfliktfälle werden dem Nutzer rückgemeldet

Erfüllt gemeinsam mit CLVN-032/033 alle Akzeptanzkriterien der Story.
