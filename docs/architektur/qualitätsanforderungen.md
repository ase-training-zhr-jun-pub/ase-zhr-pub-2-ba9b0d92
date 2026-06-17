# Qualitätsanforderungen

Dieses Dokument beschreibt die wichtigsten Qualitätsanforderungen an **Calvin**
(INNOQs internes Raum- und Arbeitsplatzbuchungssystem) in Form von
**Qualitätsszenarien** nach [arc42 Kapitel 10](https://docs.arc42.org/section-10/).

## Aufbau eines Szenarios

Jedes Szenario folgt dem Template:

| Feld | Bedeutung |
|------|-----------|
| **Environment** | Betriebssituation, in der das Ereignis eintritt (z. B. Normalbetrieb, Spitzenlast, Teilausfall) |
| **Source** | Auslöser des Ereignisses (z. B. ein INNOQ-Mitarbeiter, ein externer Akteur) |
| **Event** | Das auslösende Ereignis bzw. der Stimulus |
| **Artifact** | Der betroffene Teil des Systems |
| **Response** | Die erwartete Reaktion des Systems |
| **Measure** | Messbares Kriterium, an dem die Reaktion bewertet wird |

> **Beispiel (Vorlage):** *In normal use, a consultant views the bookings of an
> office on the Calvin Website. The bookings are visible and interactive (first
> contentful paint) in 300 ms for 95 % of the requests.*

## Kontext aus dem Interview

Die Szenarien wurden auf Basis eines Interviews mit den folgenden Annahmen
konkretisiert:

- **Spitzenlast:** bis zu **300 gleichzeitige Nutzer** (z. B. morgendliche Stoßzeit
  beim Buchen des Bürotags).
- **Datenschutz:** Buchungs- und Anwesenheitsdaten („wer ist wann im Büro") sind
  **nur für angemeldete INNOQ-Mitarbeiter** sichtbar – Authentifizierung ist
  erforderlich.
- **Wachstumstreiber:** Die Aufnahme **neuer Standorte** ist der wahrscheinlichste
  zukünftige Änderungsfall (relevant für Skalierbarkeit/Modifizierbarkeit).

---

## QS-1 · Zuverlässigkeit – Verhinderung von Doppelbuchungen

| Feld | Wert |
|------|------|
| **Environment** | Normalbetrieb während der Kernarbeitszeit, mehrere INNOQ-Mitarbeiter gleichzeitig aktiv |
| **Source** | Zwei INNOQ-Mitarbeiter (Consultants) |
| **Event** | senden innerhalb derselben Sekunde je eine Raumbuchung für **denselben Konferenzraum** im **selben Zeitfenster** ab |
| **Artifact** | Booking Service (serverseitige Buchungslogik) |
| **Response** | Der Booking Service bestätigt **genau eine** Buchung und lehnt die konkurrierende mit klarer Rückmeldung ab; es entsteht keine Doppelbuchung |
| **Measure** | In **99,9 %** der konkurrierenden Buchungsversuche wird die Doppelbuchung verhindert |

> Im Normalbetrieb senden zwei Consultants innerhalb derselben Sekunde eine Buchung
> für denselben Konferenzraum und dasselbe Zeitfenster ab. Der Booking Service
> bestätigt genau eine Buchung und lehnt die zweite ab – in 99,9 % der Fälle
> entsteht keine Doppelbuchung.

---

## QS-2 · Performance – Anzeige verfügbarer Räume unter Last

| Feld | Wert |
|------|------|
| **Environment** | Spitzenlast (morgendliche Stoßzeit) mit bis zu **300 gleichzeitigen Nutzern** |
| **Source** | Ein INNOQ-Mitarbeiter |
| **Event** | ruft die verfügbaren Konferenzräume eines Standorts für ein gewähltes Zeitfenster ab (Raumsuche) |
| **Artifact** | Calvin (Frontend + Booking Service über REST API) |
| **Response** | Die Liste der verfügbaren Räume wird vollständig und korrekt angezeigt |
| **Measure** | In **≤ 500 ms** für **95 %** der Anfragen, auch bei 300 gleichzeitigen Nutzern |

> Während der morgendlichen Stoßzeit mit 300 gleichzeitigen Nutzern ruft ein
> INNOQ-Mitarbeiter die verfügbaren Konferenzräume eines Standorts ab. Die
> Ergebnisliste wird in 95 % der Anfragen in höchstens 500 ms angezeigt.

---

## QS-3 · Benutzbarkeit – Erste Buchung ohne Schulung

| Feld | Wert |
|------|------|
| **Environment** | Normalbetrieb, erstmalige Nutzung ohne vorherige Schulung |
| **Source** | Ein neuer INNOQ-Mitarbeiter |
| **Event** | möchte zum ersten Mal einen Konferenzraum buchen |
| **Artifact** | Calvin Web-Oberfläche |
| **Response** | schließt die Buchung eigenständig ab (Standort wählen → Raum finden → Zeit festlegen → bestätigen) |
| **Measure** | In **≤ 5 Minuten**; **90 %** der neuen Mitarbeiter schaffen dies **ohne fremde Hilfe** |

> Ein neuer INNOQ-Mitarbeiter bucht ohne Schulung zum ersten Mal einen
> Konferenzraum und schließt den Vorgang in höchstens 5 Minuten ab; 90 % gelingt
> das ohne Hilfe.

---

## QS-4 · Verfügbarkeit – Betrieb während der Kernarbeitszeit

| Feld | Wert |
|------|------|
| **Environment** | Kernarbeitszeit (8:00–18:00 Uhr); eine Backend-Komponente fällt unerwartet aus |
| **Source** | INNOQ-Mitarbeiter mit Buchungs- und Abfrageanfragen |
| **Event** | greifen während eines Komponentenausfalls auf Calvin zu |
| **Artifact** | Calvin-System (Booking Service) |
| **Response** | Das System bleibt nutzbar bzw. wird automatisch und zeitnah wiederhergestellt |
| **Measure** | **98 % Verfügbarkeit** während 8:00–18:00 Uhr; Wiederherstellung **< 30 Minuten** nach Ausfall |

> Während der Kernarbeitszeit fällt eine Backend-Komponente aus. Calvin erreicht
> dennoch 98 % Verfügbarkeit zwischen 8 und 18 Uhr und ist nach einem Ausfall
> binnen 30 Minuten wiederhergestellt.

---

## QS-5 · Sicherheit/Datenschutz – Schutz von Buchungs- und Anwesenheitsdaten

| Feld | Wert |
|------|------|
| **Environment** | Normalbetrieb, Zugriff aus dem Netzwerk |
| **Source** | Ein **nicht angemeldeter** Nutzer bzw. externer Akteur |
| **Event** | versucht, Buchungs- und Anwesenheitsdaten („wer ist wann im Büro") abzurufen |
| **Artifact** | Booking Service / REST API |
| **Response** | Der Zugriff wird ohne gültige Authentifizierung abgewiesen; personenbezogene Daten sind ausschließlich für angemeldete INNOQ-Mitarbeiter sichtbar |
| **Measure** | **100 %** der Anfragen ohne gültige Authentifizierung werden abgelehnt; keine personenbezogenen Daten werden ausgeliefert |

> Ein nicht angemeldeter Akteur versucht, Anwesenheitsdaten über die REST API
> abzurufen. Der Booking Service weist 100 % dieser Anfragen ab – die Daten sind
> nur für angemeldete INNOQ-Mitarbeiter zugänglich.

---

## Priorisierung

| Priorität | Szenario | Qualitätsattribut |
|-----------|----------|-------------------|
| 1 | [QS-1](#qs-1--zuverlässigkeit--verhinderung-von-doppelbuchungen) | Zuverlässigkeit |
| 2 | [QS-2](#qs-2--performance--anzeige-verfügbarer-räume-unter-last) | Performance |
| 3 | [QS-3](#qs-3--benutzbarkeit--erste-buchung-ohne-schulung) | Benutzbarkeit |
| 4 | [QS-4](#qs-4--verfügbarkeit--betrieb-während-der-kernarbeitszeit) | Verfügbarkeit |
| 5 | [QS-5](#qs-5--sicherheitdatenschutz--schutz-von-buchungs--und-anwesenheitsdaten) | Sicherheit/Datenschutz |
