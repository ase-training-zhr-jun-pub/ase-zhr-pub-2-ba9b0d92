# syntax=docker/dockerfile:1

# --- Build-Stage: baut das ausführbare Spring-Boot-Jar ---
FROM eclipse-temurin:21-jdk AS build
WORKDIR /app

# Erst nur die Maven-Wrapper- und POM-Dateien kopieren, damit das
# Dependency-Layer gecacht wird, solange sich die pom.xml nicht ändert.
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN chmod +x mvnw && ./mvnw -B -q dependency:go-offline

# Quellcode kopieren und Jar bauen (Tests laufen separat in der CI).
COPY src/ src/
RUN ./mvnw -B -q clean package -DskipTests

# --- Runtime-Stage: schlankes JRE-Image mit dem fertigen Jar ---
FROM eclipse-temurin:21-jre
WORKDIR /app

# Nicht als root laufen lassen.
RUN useradd --system --uid 1001 spring
USER spring

COPY --from=build /app/target/booking-service-*.jar app.jar

EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
