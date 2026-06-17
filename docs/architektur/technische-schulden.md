# Technische Schulden

Dieses Dokument sammelt bewusst eingegangene technische Schulden in **Calvin**.
Eine technische Schuld ist eine Vereinfachung, die kurzfristig Tempo bringt, aber
später Mehraufwand oder Risiko erzeugt und perspektivisch behoben werden sollte.

## Übersicht

| ID | Schuld | Bereich | Priorität | Auslösender ADR |
|----|--------|---------|-----------|-----------------|
| TS-1 | Passwortlose Basic-Auth statt Okta | Sicherheit | Hoch (vor Produktion) | [ADR-004](../arc42/adrs/ADR-004-authentifizierung-im-prototyp-basic-auth.md) |
| TS-2 | Stammdaten als Mock-Daten in der SPA | Datenhaltung | Mittel | [ADR-003](../arc42/adrs/ADR-003-stammdaten-als-mock-daten-in-der-spa.md) |

---

## TS-1 · Passwortlose Basic-Auth statt Okta

**Beschreibung**
Im Prototyp wird statt einer echten Okta-Integration eine **Basic-Auth ohne
Passwörter** verwendet (siehe
[ADR-004](../arc42/adrs/ADR-004-authentifizierung-im-prototyp-basic-auth.md)).
Nutzer werden nur über einen Benutzernamen identifiziert, es findet keine
Passwort- oder Token-Prüfung statt.

**Auswirkung / Risiko**
- Die Daten sind faktisch **nicht geschützt**; jeder kann sich als beliebiger
  Nutzer ausgeben.
- Das Sicherheits-Qualitätsszenario
  [QS-5](qualitätsanforderungen.md#qs-5--sicherheitdatenschutz--schutz-von-buchungs--und-anwesenheitsdaten)
  ist im Prototyp **nicht erfüllt**.
- Vor einem Produktivbetrieb ist dies ein Blocker.

**Geplante Behebung**
Ersetzen der Basic-Auth durch die in
[ADR-002](../arc42/adrs/ADR-002-technologie-stack-fuer-booking-service.md)
vorgesehene **Okta-Integration** (Spring Security als OAuth2 Resource Server),
sobald das System in Produktion geht.

---

## TS-2 · Stammdaten als Mock-Daten in der SPA

**Beschreibung**
Standorte, Räume und Ausstattungen liegen als **Mock-Daten in der SPA**
(`frontend/src/lib/mock-data.ts`) statt in einem eigenständigen Ressource-Service
mit Persistenz (siehe
[ADR-003](../arc42/adrs/ADR-003-stammdaten-als-mock-daten-in-der-spa.md)). Der
Booking Service arbeitet nur mit den IDs aus diesen Mock-Daten.

**Auswirkung / Risiko**
- Keine zentrale, persistente Stammdatenverwaltung; Änderungen an Standorten oder
  Räumen erfordern ein **Frontend-Deployment**.
- Der Booking Service kann übergebene IDs **nicht gegen eine echte Quelle
  validieren** – fehlerhafte oder veraltete IDs werden nicht erkannt.
- Stammdaten sind nicht zwischen mehreren Clients/Diensten konsistent abrufbar.

**Geplante Behebung**
Bei Bedarf Auslagerung in einen eigenständigen **Ressource-Service** mit eigener
Persistenz und einer API zur Validierung der Ressourcen-IDs.
