package io.innoq.calvin.booking.web;

import io.innoq.calvin.booking.domain.Buchung;
import io.innoq.calvin.booking.domain.BuchungStatus;
import java.time.LocalDate;
import java.time.LocalTime;

/** Response-DTO einer Buchung. Vermeidet, die JPA-Entity direkt zu serialisieren. */
public record BuchungResponse(
    Long id,
    String raumId,
    String standortId,
    LocalDate datum,
    LocalTime von,
    LocalTime bis,
    BuchungStatus status) {

  public static BuchungResponse von(Buchung buchung) {
    return new BuchungResponse(
        buchung.getId(),
        buchung.getRaumId(),
        buchung.getStandortId(),
        buchung.getDatum(),
        buchung.getVon(),
        buchung.getBis(),
        buchung.getStatus());
  }
}
