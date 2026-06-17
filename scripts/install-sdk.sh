#!/usr/bin/env bash
# Installiert das Java-SDK und Maven für den Calvin Booking Service.
# Technologie-Entscheidung: Java 21 (LTS) + Spring Boot 3 (ADR-002).
#
# Wird automatisch beim Erstellen des Codespace ausgeführt (onCreateCommand
# in devcontainer.json). Nach manuellem Codespace-Neustart hier nochmal
# aufrufen: bash scripts/install-sdk.sh

set -eo pipefail   # kein -u, da SDKMAN ungebundene Variablen verwendet

JAVA_VERSION="21.0.7-tem"
MAVEN_VERSION="3.9.9"

echo "=== Calvin SDK Setup: Java ${JAVA_VERSION} + Maven ${MAVEN_VERSION} ==="

# --- Abhängigkeiten sicherstellen ---
if ! command -v unzip &>/dev/null || ! command -v zip &>/dev/null; then
  echo "→ Installiere unzip/zip (SDKMAN-Abhängigkeit)..."
  sudo apt-get install -y unzip zip curl
fi

# --- SDKMAN installieren (falls nicht vorhanden) ---
if [ ! -f "$HOME/.sdkman/bin/sdkman-init.sh" ]; then
  echo "→ Installiere SDKMAN..."
  curl -s "https://get.sdkman.io" | bash
fi

# SDKMAN in aktuelle Shell laden (nutzt ungebundene Variablen intern)
# shellcheck source=/dev/null
source "$HOME/.sdkman/bin/sdkman-init.sh"

# --- Java 21 (Temurin) ---
if sdk list java | grep -q "^ ${JAVA_VERSION}"; then
  echo "→ Java ${JAVA_VERSION} bereits installiert."
  sdk default java "${JAVA_VERSION}"
else
  echo "→ Installiere Java ${JAVA_VERSION} (Temurin)..."
  sdk install java "${JAVA_VERSION}" < /dev/null
  sdk default java "${JAVA_VERSION}"
fi

# --- Maven ---
if sdk list maven | grep -q "^ ${MAVEN_VERSION}"; then
  echo "→ Maven ${MAVEN_VERSION} bereits installiert."
  sdk default maven "${MAVEN_VERSION}"
else
  echo "→ Installiere Maven ${MAVEN_VERSION}..."
  sdk install maven "${MAVEN_VERSION}" < /dev/null
  sdk default maven "${MAVEN_VERSION}"
fi

echo ""
echo "=== Installation abgeschlossen ==="
java -version
mvn -version
echo ""
echo "Hinweis: Starte eine neue Shell (oder 'source ~/.bashrc') um JAVA_HOME"
echo "und PATH in anderen Terminals zu aktivieren."
