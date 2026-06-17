---
Ticket-ID: CLVN-016
Type: Story
Epic: CLVN-015
Status: TODO
---
# Raumauswahl bestätigen

## User Story

Als INNOQ-Mitarbeiter möchte ich meine Raumauswahl bestätigen, damit ich den für mich passenden Konferenzraum reservieren kann.

## Beschreibung

Nachdem ein INNOQ-Mitarbeiter einen verfügbaren Konferenzraum für sein Meeting oder seinen Workshop gefunden hat, möchte er diesen Raum verbindlich auswählen. Die Bestätigung der Raumauswahl ist der erste Schritt im Buchungsprozess und führt den Mitarbeiter zur weiteren Eingabe von Buchungsdetails wie Meetingtitel und optionaler Buchungsnotiz.

Diese User Story ist zentral für das Epic "Raum buchen", da sie den Übergang von der Raumsuche zur eigentlichen Buchung darstellt. Der Mitarbeiter erhält durch die Bestätigung eine visuelle Rückmeldung, dass sein gewünschter Raum für den Buchungsvorgang ausgewählt wurde.

## Akzeptanzkriterien

- [ ] Ein verfügbarer Konferenzraum kann durch Klick/Tap ausgewählt werden
- [ ] Der ausgewählte Konferenzraum wird visuell hervorgehoben
- [ ] Die Raumdetails (Name, Standort, Ausstattung, Kapazität) werden bei der Auswahl angezeigt
- [ ] Der gewählte Zeitraum wird bei der Auswahl angezeigt
- [ ] Eine Bestätigungsschaltfläche ermöglicht das Fortfahren zum nächsten Buchungsschritt
- [ ] Die Auswahl kann vor der Bestätigung geändert werden
- [ ] Nach Bestätigung wird der Mitarbeiter zur Eingabe weiterer Buchungsdetails weitergeleitet

## Betroffene Persona

[INNOQ-Mitarbeiter](/docs/produkt/personas/innoq-mitarbeiter.md)

## Zugehöriges Epic

[CLVN-015 - Raum buchen](/docs/produkt/backlog/CLVN-015-EPIC-raum-buchen.md)

## Planung

Die Story wird als Full-Stack-Feature umgesetzt und bildet zugleich die Backend-Foundation für das Epic „Raum buchen":

- **Frontend:** Vorgelagerter modaler Bestätigungsschritt zwischen Raumsuche und Buchungsformular. Der ausgewählte Konferenzraum wird hervorgehoben, Raumdetails und gewählter Zeitraum werden angezeigt; „Weiter zur Buchung" führt zur Eingabe der Buchungsdetails.
- **Backend:** Erstmalige Persistenzschicht (JPA + H2), `Buchung`-Domain-Model mit Status `ENTWURF`, ein Endpoint zur Verfügbarkeitsprüfung (Schutz gegen Doppelbuchung) sowie ein Endpoint zum Anlegen eines Buchungs-Entwurfs.

Reihenfolge der Subtasks: CLVN-028 → CLVN-029 → {CLVN-030, CLVN-031} → CLVN-032 → CLVN-033 → CLVN-034.

## Subtasks

- [CLVN-028-SUBTASK-persistenz-jpa-h2](./CLVN-028-SUBTASK-persistenz-jpa-h2.md)
- [CLVN-029-SUBTASK-buchung-domain-model](./CLVN-029-SUBTASK-buchung-domain-model.md)
- [CLVN-030-SUBTASK-verfuegbarkeitspruefung-endpoint](./CLVN-030-SUBTASK-verfuegbarkeitspruefung-endpoint.md)
- [CLVN-031-SUBTASK-buchungs-entwurf-endpoint](./CLVN-031-SUBTASK-buchungs-entwurf-endpoint.md)
- [CLVN-032-SUBTASK-frontend-api-anbindung](./CLVN-032-SUBTASK-frontend-api-anbindung.md)
- [CLVN-033-SUBTASK-raumauswahl-bestaetigungsdialog](./CLVN-033-SUBTASK-raumauswahl-bestaetigungsdialog.md)
- [CLVN-034-SUBTASK-flow-integration-buchenpage](./CLVN-034-SUBTASK-flow-integration-buchenpage.md)
