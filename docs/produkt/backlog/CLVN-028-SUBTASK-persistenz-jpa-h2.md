---
Ticket-ID: CLVN-028
Type: Subtask
Story: CLVN-016
Status: TODO
---

# Persistenz-Foundation: JPA und H2 konfigurieren

## Kontext

Der Booking Service besitzt bisher keine Persistenzschicht (nur `HelloController`). Für die Raumauswahl-Bestätigung muss das Backend bestehende Raumbuchungen kennen, um Doppelbuchungen zu erkennen und Buchungs-Entwürfe zu speichern. Diese Foundation wird von allen weiteren Backend-Subtasks der Story benötigt.

## Beschreibung

Spring Data JPA und die H2-Datenbank im Datei-Modus einrichten, sodass nachfolgende Subtasks Entities persistieren können.

- Abhängigkeiten (`spring-boot-starter-data-jpa`, `h2`) in `pom.xml` ergänzen
- H2 im Datei-Modus in `application.yaml` konfigurieren (Datasource, JPA-Properties, ggf. H2-Konsole)
- Datenbank-Verbindung über einen einfachen Smoke-Test absichern (Kontext lädt, Datasource verfügbar)

Keine fachlichen Entities in diesem Ticket — nur die technische Grundlage.
