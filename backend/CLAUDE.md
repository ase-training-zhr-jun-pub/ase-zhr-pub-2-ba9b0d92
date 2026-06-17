# CLAUDE.md – Booking Service

This file provides guidance to Claude Code when working in the `backend/` directory.

## Dokumentation

| Dokument | Inhalt |
|---|---|
| [`docs/arc42/arc42.md`](../docs/arc42/arc42.md) | Systemarchitektur (Bausteinsicht, Kontext, Qualitätsziele) |
| [`docs/arc42/adrs/ADR-002`](../docs/arc42/adrs/ADR-002-technologie-stack-fuer-booking-service.md) | Technologie-Entscheidung (Spring Boot, H2, Maven) |
| [`docs/arc42/adrs/ADR-003`](../docs/arc42/adrs/ADR-003-stammdaten-als-mock-daten-in-der-spa.md) | Stammdaten in der SPA – Service arbeitet nur mit IDs |
| [`docs/arc42/adrs/ADR-004`](../docs/arc42/adrs/ADR-004-authentifizierung-im-prototyp-basic-auth.md) | Auth im Prototyp: passwortlose Basic-Auth |
| [`docs/architektur/technische-schulden.md`](../docs/architektur/technische-schulden.md) | TS-1 (Okta), TS-2 (Stammdaten) |
| [`docs/produkt/glossar.md`](../docs/produkt/glossar.md) | Ubiquitous Language – Begriffe konsequent verwenden |

## Technologie

- **Java 21** (LTS) · **Spring Boot 4.1** · **Maven**
- **Spring Web MVC** – REST-API
- **Spring Data JPA + H2** (Datei-Modus) – Persistenz (noch nicht konfiguriert)
- **Spring Security** – Basic-Auth im Prototyp, Okta/OIDC in Produktion
- Basis-Package: `io.innoq.calvin.booking`

## Ordnerstruktur

```
backend/
├── src/
│   ├── main/
│   │   ├── java/io/innoq/calvin/booking/
│   │   │   ├── BookingServiceApplication.java  # Entry Point
│   │   │   ├── config/          # Spring-Konfigurationsklassen (@Configuration)
│   │   │   ├── web/             # REST-Controller (@RestController)
│   │   │   ├── domain/          # Domänenmodell (Entities, Value Objects) – noch anzulegen
│   │   │   ├── service/         # Anwendungslogik – noch anzulegen
│   │   │   └── repository/      # Spring Data Repositories – noch anzulegen
│   │   └── resources/
│   │       └── application.properties
│   └── test/
│       └── java/io/innoq/calvin/booking/
│           └── web/             # Controller-Tests mit MockMvc
├── pom.xml
└── mvnw
```

## Architektur

Angestrebte **Layered Architecture** (3 Schichten):

```
[web/]        REST-Controller – HTTP-Mapping, Request/Response-DTOs
    ↓
[service/]    Anwendungslogik – Buchungsvalidierung, Konfliktprüfung
    ↓
[repository/] Datenzugriff – Spring Data JPA, H2
```

**Wichtige Prinzipien:**
- Controller kennen keine Repository-Klassen direkt (immer via Service)
- Domänen-Entities (`domain/`) dürfen nicht als HTTP-Response-Body serialisiert werden – stattdessen DTOs in `web/`
- Transaktionsschutz gegen Doppelbuchungen liegt in der Service-Schicht (`@Transactional` + DB-Constraints)

## Wichtige Dateien

| Datei | Zweck |
|---|---|
| `src/main/resources/application.properties` | Port (8081), Datenbank-Config, App-Name |
| `src/main/java/.../config/WebConfig.java` | CORS-Konfiguration (`/api/**`) |
| `src/main/java/.../web/HelloController.java` | Verbindungstest-Endpunkt `GET /api/hello` |
| `pom.xml` | Dependencies, Spring Boot Parent (4.1.0), Java 21 |

## Wichtige Bash-Commands

```bash
# SDK laden (einmalig nach Neustart – Java/Maven via SDKMAN):
source "$HOME/.sdkman/bin/sdkman-init.sh"

# Anwendung starten (Port 8081):
./mvnw spring-boot:run

# Alle Tests:
./mvnw test

# Einzelne Testklasse:
./mvnw test -Dtest=HelloControllerTest

# Build (überspringt Tests):
./mvnw -DskipTests package

# Build + Tests + Verify:
./mvnw verify

# Endpunkt manuell testen:
curl http://localhost:8081/api/hello
```

## Code Smells – Folgendes vermeiden

- **Anemic Domain Model:** Entities ohne Logik + Services mit allem → Domänenlogik gehört in die Entity
- **Controller-Fettheit:** Business-Logik direkt im Controller statt im Service
- **Repository direkt im Controller:** Datenzugriff immer via Service-Schicht
- **Entities als DTOs:** JPA-Entities direkt als JSON serialisieren; separate Request/Response-Klassen verwenden
- **`@Transactional` vergessen:** Buchungsoperationen benötigen Transaktionen für den Doppelbuchungs-Schutz (QS-1)
- **Magic Strings:** Endpunktpfade (`/api/bookings`) als Konstanten oder in einer zentralen Klasse

## Run Configurations

**Spring Boot (lokal):**
- Main Class: `io.innoq.calvin.booking.BookingServiceApplication`
- VM Options: (keine)
- Port: 8081 (via `application.properties`)

**IntelliJ:** Run → Edit Configurations → Spring Boot → `BookingServiceApplication`

**Crucible/Proxy – Backend-URL:**
```bash
echo "${VSCODE_PROXY_URI/\{\{port\}\}/8081}"
# → https://crucible.ch.innoq.io/t/.../s/.../proxy/8081/
```

## Weitere Hinweise

- **Port 8080 ist in der Crucible-Umgebung belegt** (VS-Code-Server) → Port 8081 verwenden
- **CORS** ist in `WebConfig.java` für `/api/**` auf alle Origins geöffnet (Prototyp); vor Produktion einschränken
- **Authentifizierung** im Prototyp: passwortlose Basic-Auth (ADR-004). Kein echter Passwort-Check. Nicht produktionsreif.
- **Stammdaten** (Standorte, Räume, Ausstattung) liegen im Frontend als Mock-Daten. Der Service erhält nur IDs (ADR-003).
- **Neue Endpunkte** immer unter `/api/` anlegen (Konvention + CORS-Konfiguration)
- Tests mit `MockMvc` für Controller-Tests, `@DataJpaTest` für Repository-Tests
