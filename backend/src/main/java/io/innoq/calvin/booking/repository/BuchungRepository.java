package io.innoq.calvin.booking.repository;

import io.innoq.calvin.booking.domain.Buchung;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/** Datenzugriff auf {@link Buchung}-Aggregate. */
public interface BuchungRepository extends JpaRepository<Buchung, Long> {

  /**
   * Liefert alle Buchungen, deren Zeitfenster sich mit dem angefragten Fenster für denselben
   * Konferenzraum am selben Datum überschneiden. Grundlage der Doppelbuchungs-Prüfung (CLVN-030).
   *
   * <p>Überschneidungssemantik analog zum Frontend ({@code ueberschneidet()} in {@code
   * mock-data.ts}): Zwei Fenster überlappen, wenn {@code von < bis} der jeweils anderen Buchung.
   * Direkt angrenzende Slots (z. B. 09:00–10:00 und 10:00–11:00) gelten nicht als Überschneidung.
   */
  @Query(
      "SELECT b FROM Buchung b WHERE b.raumId = :raumId AND b.datum = :datum "
          + "AND b.von < :bis AND b.bis > :von")
  List<Buchung> findUeberlappende(
      @Param("raumId") String raumId,
      @Param("datum") LocalDate datum,
      @Param("von") LocalTime von,
      @Param("bis") LocalTime bis);
}
