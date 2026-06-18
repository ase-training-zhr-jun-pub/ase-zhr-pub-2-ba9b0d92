package io.innoq.calvin.booking.web;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;

/**
 * Request zum Anlegen eines Buchungs-Entwurfs. Enthält nur die bei der Raumauswahl-Bestätigung
 * bekannten Felder; Meetingtitel und Notiz folgen in späteren Stories.
 */
public record BuchungAnlegenRequest(
    @NotBlank String raumId,
    @NotBlank String standortId,
    @NotNull LocalDate datum,
    @NotNull LocalTime von,
    @NotNull LocalTime bis) {

  /** Stellt sicher, dass das Zeitfenster gültig ist (Endzeit nach Startzeit). */
  @AssertTrue(message = "Die Endzeit muss nach der Startzeit liegen.")
  public boolean isZeitfensterGueltig() {
    return von != null && bis != null && von.isBefore(bis);
  }
}
