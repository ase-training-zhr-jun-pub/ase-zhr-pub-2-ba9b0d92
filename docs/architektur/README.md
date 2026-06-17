# Architekturdokumentation Calvin

Dieser Ordner enthält die Architekturdokumentation für **Calvin**, INNOQs internes
Raum- und Arbeitsplatzbuchungssystem.

## Inhalt

- [Qualitätsanforderungen](qualitätsanforderungen.md) – Qualitätsszenarien nach
  arc42 Kapitel 10 (Zuverlässigkeit, Performance, Benutzbarkeit, Verfügbarkeit,
  Sicherheit/Datenschutz)
- [Technische Schulden](technische-schulden.md) – bewusst eingegangene
  Vereinfachungen und ihr geplanter Abbau

## Architecture Decision Records (ADRs)

Alle ADRs liegen zentral unter [`docs/arc42/adrs/`](../arc42/adrs/):

- [ADR-001: Frontend-Prototyp mit separatem Booking Service](../arc42/adrs/ADR-001-frontend-prototyp-und-booking-service.md)
- [ADR-002: Technologie-Stack für den Booking Service](../arc42/adrs/ADR-002-technologie-stack-fuer-booking-service.md)
- [ADR-003: Stammdaten als Mock-Daten in der SPA](../arc42/adrs/ADR-003-stammdaten-als-mock-daten-in-der-spa.md)
- [ADR-004: Authentifizierung im Prototyp – passwortlose Basic-Auth statt Okta](../arc42/adrs/ADR-004-authentifizierung-im-prototyp-basic-auth.md)

## Weiterführende Dokumentation

- [arc42-Architekturdokumentation](../arc42/arc42.md)
- [Produktvision](../produkt/produktvision.md)
