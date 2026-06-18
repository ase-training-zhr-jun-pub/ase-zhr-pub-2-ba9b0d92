package io.innoq.calvin.booking.domain;

/**
 * Lebenszyklus einer Raumbuchung.
 *
 * <p>{@link #ENTWURF} ist der Einstiegszustand: Er entsteht, wenn ein Mitarbeiter seine Raumauswahl
 * bestätigt (CLVN-016). {@link #BESTAETIGT} wird beim verbindlichen Absenden der Buchung (CLVN-019)
 * gesetzt.
 */
public enum BuchungStatus {
  ENTWURF,
  BESTAETIGT
}
