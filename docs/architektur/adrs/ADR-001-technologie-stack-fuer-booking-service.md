# ADR-001: Technologie-Stack für den Booking Service

**Status**: Akzeptiert

## Kontext

Die Buchungslogik von Calvin wird in einen eigenständigen **Booking Service**
ausgelagert (siehe [ADR Frontend-Prototyp mit separatem Booking
Service](../../arc42/adrs/ADR-001-frontend-prototyp-und-booking-service.md)).
Offen ist, welche Technologie dieser Service nutzen soll.

### Anforderungen an die Technologie

| # | Anforderung |
|---|-------------|
| A1 | **REST-API** (JSON über HTTPS) als Schnittstelle zum Frontend |
| A2 | Kompatibilität mit einer **dateibasierten Datenbank** (z. B. SQLite, H2) |
| A3 | Perspektivisch muss eine **Okta-Integration** (OIDC/OAuth2) möglich sein |
| A4 | **Schnelle Entwicklung** möglich |
| A5 | Technologie, in der das umsetzende Team **Erfahrung** hat (der Service wird selbst implementiert) |

Zudem relevant: Der serverseitige Schutz vor Doppelbuchungen
([QS-1](../qualitätsanforderungen.md#qs-1--zuverlässigkeit--verhinderung-von-doppelbuchungen))
verlangt verlässliche **Transaktionen**.

## Betrachtete Optionen

### Option 1: Spring Boot (Java/Kotlin)

**Pro**
- Sehr ausgereiftes REST-Framework (Spring Web) → erfüllt A1.
- H2 und SQLite über Spring Data JPA nativ unterstützt, H2 mit Datei-Modus → erfüllt A2.
- **Spring Security** als OAuth2 Resource Server: Okta-Anbindung (OIDC, JWT-Validierung) ist ein gut dokumentierter Standardweg → erfüllt A3.
- Robuste, deklarative **Transaktionen** (`@Transactional`) und Unique-Constraints → ideal für den Doppelbuchungs-Schutz (QS-1).
- Verbreiteter Stack mit großem Ökosystem; vorhandene Erfahrung → erfüllt A5.

**Contra**
- Mehr Boilerplate und höherer Ressourcenbedarf als schlanke Alternativen.
- Etwas längere Startzeit / höhere Einstiegskomplexität.

### Option 2: NestJS (Node.js / TypeScript)

**Pro**
- **Gleiche Sprache wie das React-Frontend** (TypeScript) → ein Sprachstack im Team.
- REST eingebaut; SQLite über Prisma/TypeORM → A1, A2 erfüllt.
- Okta über Passport/OIDC-Strategien möglich → A3 erfüllt.
- Schnelle Entwicklung durch Decorators und CLI → A4.

**Contra**
- Transaktions- und Konsistenzgarantien weniger „batteries-included" als bei JPA.
- Geringere Erfahrung im Team mit serverseitigem Node als mit der JVM.

### Option 3: FastAPI (Python)

**Pro**
- **Sehr schnelle Entwicklung**, wenig Code → A4 stark erfüllt.
- SQLite nativ (SQLModel/SQLAlchemy) → A2 erfüllt.
- REST mit automatischer OpenAPI-Doku → A1.
- Okta über OIDC-Bibliotheken (z. B. authlib) möglich → A3.

**Contra**
- Async-/Transaktionshandling erfordert mehr Sorgfalt für den Doppelbuchungs-Schutz.
- Geringste Team-Erfahrung der drei Optionen → schwächt A5.

## Entscheidung

Wir wählen **Spring Boot mit Java 21** als Technologie für den Booking Service.

Konkreter Stack:

| Aspekt | Wahl |
|--------|------|
| Sprache / Framework | Java 21 (LTS) · Spring Boot 3 |
| REST-API | Spring Web (`spring-boot-starter-web`) |
| Persistenz | Spring Data JPA mit **H2** im Datei-Modus (SQLite als Alternative möglich) |
| Authentifizierung | Spring Security als OAuth2 Resource Server (OIDC/JWT-Validierung gegen Okta) |
| Build / Tests | Maven · JUnit 5 |

> Kotlin bleibt eine kompatible Alternative zu Java und kann ohne Änderung der
> übrigen Entscheidung gewählt werden.

## Begründung

- **A5 (Erfahrung) gab den Ausschlag:** Der Service wird selbst implementiert; mit
  Spring Boot ist die nötige Erfahrung vorhanden, was Entwicklungsrisiko und
  -tempo verbessert.
- **A3 (Okta):** Spring Security bietet den ausgereiftesten, am besten
  dokumentierten Weg zur OIDC-/OAuth2-Anbindung an Okta.
- **QS-1 (Doppelbuchungen):** Spring Datas deklarative Transaktionen und
  Datenbank-Constraints sind besonders gut geeignet, konkurrierende Buchungen
  serverseitig sicher zu verhindern.
- **A2 (Datei-DB):** H2 im Datei-Modus erlaubt einen schnellen, abhängigkeitsarmen
  Start ohne separaten Datenbankserver; ein späterer Wechsel auf eine
  Server-Datenbank (z. B. PostgreSQL) ist über JPA mit geringem Aufwand möglich.

## Konsequenzen

**Positiv**
- Schneller, sicherer Einstieg mit vertrautem Stack und Datei-DB.
- Okta-Integration und Transaktionssicherheit sind klar abgedeckt.
- Migrationspfad zu einer produktiven Datenbank ist offen.

**Negativ / Trade-offs**
- Backend (Java) und Frontend (TypeScript) nutzen unterschiedliche Sprachen –
  kein gemeinsamer Sprachstack.
- Mehr Boilerplate und höherer Ressourcenbedarf als bei FastAPI/NestJS.
