# ADR-003: Stammdaten als Mock-Daten in der SPA (kein separater Ressource-Service)

**Status**: Akzeptiert

## Kontext

Calvin benötigt Stammdaten zu den buchbaren Ressourcen: **Standorte**, **Räume**
und **Ausstattungen**. Offen war, ob diese Stammdaten von einem eigenständigen
**Ressource-Service** (mit eigener Persistenz) verwaltet oder anderweitig
bereitgestellt werden.

## Entscheidung

Der Ressource-Service wird **in die SPA integriert**. Standorte, Räume und
Ausstattungen werden als **Mock-Daten in der SPA** hinterlegt
(`frontend/src/lib/mock-data.ts`). Der **Booking Service** arbeitet
ausschließlich mit den **IDs** aus diesen Mock-Daten und hält selbst keine
Stammdaten vor.

## Begründung

- **Schnelles Prototyping:** Kein zusätzlicher Service und keine zweite Datenbank
  nötig; die Stammdaten liegen ohnehin schon im Frontend-Prototyp.
- **Stabile Stammdaten:** Standorte, Räume und Ausstattungen ändern sich selten –
  der Aufwand eines eigenen Service ist für den Prototyp nicht gerechtfertigt.
- **Schlanker Booking Service:** Er kümmert sich nur um Buchungen und referenziert
  Ressourcen über deren IDs.

## Konsequenzen

**Positiv**
- Geringere Systemkomplexität, weniger Infrastruktur.
- Frontend und Stammdaten bleiben in einer Codebasis – schnelle Iteration.

**Negativ / Trade-offs**
- Keine zentrale, persistente Stammdatenverwaltung; Änderungen an Standorten/Räumen
  erfordern ein Frontend-Deployment.
- Der Booking Service kann übergebene IDs **nicht gegen eine echte Stammdatenquelle
  validieren** – er vertraut den IDs aus den Mock-Daten.
- Dies ist eine bewusste technische Schuld, siehe
  [Technische Schulden](../../architektur/technische-schulden.md).
