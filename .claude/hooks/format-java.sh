#!/usr/bin/env bash
# PostToolUse-Hook: Formatiert Java-Dateien nach Write/Edit mit google-java-format.

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Nur .java-Dateien formatieren
[[ "$FILE_PATH" == *.java ]] || exit 0

# Datei muss existieren
[[ -f "$FILE_PATH" ]] || exit 0

GJF_JAR="$HOME/.local/lib/google-java-format.jar"

if [[ ! -f "$GJF_JAR" ]]; then
  echo "google-java-format JAR nicht gefunden: $GJF_JAR" >&2
  exit 0
fi

# Java aus SDKMAN laden falls nötig (ohne set -u, da SDKMAN ungebundene Variablen nutzt)
if ! command -v java &>/dev/null; then
  set +u
  # shellcheck source=/dev/null
  source "$HOME/.sdkman/bin/sdkman-init.sh" 2>/dev/null || true
  set -u
fi

java -jar "$GJF_JAR" --replace "$FILE_PATH"
echo "✓ Formatiert: $FILE_PATH"
