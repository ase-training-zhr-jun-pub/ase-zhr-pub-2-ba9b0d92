# ADR-004: Authentifizierung im Prototyp – passwortlose Basic-Auth statt Okta

**Status**: Akzeptiert

> Aktualisiert den Authentifizierungs-Aspekt aus
> [ADR-002](ADR-002-technologie-stack-fuer-booking-service.md) für die
> Prototyp-Phase. Die übrige Technologie-Entscheidung (Spring Boot, H2, REST)
> bleibt unverändert.

## Kontext

[ADR-002](ADR-002-technologie-stack-fuer-booking-service.md) sah perspektivisch
eine **Okta-Integration** (OIDC/OAuth2) vor. Für den Prototyp ist eine echte
Okta-Anbindung jedoch aufwändig und erzeugt eine Abhängigkeit zu einem
Drittsystem. Gleichzeitig wollen wir schnell mit **verschiedenen Nutzern** testen
können.

## Entscheidung

Für den Prototyp **verzichten wir auf die Okta-Integration**. Stattdessen setzen
wir **Basic-Auth ohne Passwörter** ein (nur Benutzername/Identität, kein
Passwort-Check). Die Okta-Integration wird **nachgeliefert, wenn das System in
Produktion geht**.

## Begründung

- **Schnelles Testen:** Mit verschiedenen Nutzern testen, ohne Accounts oder
  Passwörter verwalten zu müssen.
- **Keine Drittsystem-Abhängigkeit:** Der Prototyp läuft ohne Anbindung an Okta.
- **Geringer Aufwand:** Basic-Auth ist mit Spring Security schnell umgesetzt und
  später durch einen OAuth2 Resource Server (Okta) ersetzbar.

## Konsequenzen

**Positiv**
- Sofort einsatzbereites Multi-User-Testing ohne externe Abhängigkeiten.
- Klarer Migrationspfad: Austausch der Auth-Schicht gegen Okta ohne Eingriff in
  die Fachlogik.

**Negativ / Trade-offs**
- **Keine echte Sicherheit:** Ohne Passwortprüfung sind die Daten faktisch nicht
  geschützt. Das Sicherheits-Qualitätsszenario
  [QS-5](../../architektur/qualitätsanforderungen.md#qs-5--sicherheitdatenschutz--schutz-von-buchungs--und-anwesenheitsdaten)
  ist im Prototyp **nicht erfüllt**.
- Die ausstehende Okta-Integration ist eine bewusste technische Schuld, siehe
  [Technische Schulden](../../architektur/technische-schulden.md).
