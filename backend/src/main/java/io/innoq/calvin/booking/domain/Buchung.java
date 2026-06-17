package io.innoq.calvin.booking.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.time.LocalDate;
import java.time.LocalTime;

/**
 * Eine Raumbuchung im Booking Service.
 *
 * <p>Gemäß ADR-003 arbeitet der Service nur mit IDs aus den Mock-Daten der SPA ({@code raumId},
 * {@code standortId}) und hält keine eigenen Stammdaten. Eine Buchung entsteht als Entwurf, wenn
 * der Mitarbeiter seine Raumauswahl bestätigt; Meetingtitel, Notiz und Organisator folgen in
 * späteren Stories.
 */
@Entity
public class Buchung {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String raumId;

  @Column(nullable = false)
  private String standortId;

  @Column(nullable = false)
  private LocalDate datum;

  @Column(nullable = false)
  private LocalTime von;

  @Column(nullable = false)
  private LocalTime bis;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private BuchungStatus status;

  /** Für JPA. */
  protected Buchung() {}

  private Buchung(
      String raumId,
      String standortId,
      LocalDate datum,
      LocalTime von,
      LocalTime bis,
      BuchungStatus status) {
    this.raumId = raumId;
    this.standortId = standortId;
    this.datum = datum;
    this.von = von;
    this.bis = bis;
    this.status = status;
  }

  /**
   * Erzeugt eine neue Buchung im Zustand {@link BuchungStatus#ENTWURF}. Wird bei der Bestätigung
   * der Raumauswahl (CLVN-016) verwendet.
   */
  public static Buchung entwurf(
      String raumId, String standortId, LocalDate datum, LocalTime von, LocalTime bis) {
    return new Buchung(raumId, standortId, datum, von, bis, BuchungStatus.ENTWURF);
  }

  public Long getId() {
    return id;
  }

  public String getRaumId() {
    return raumId;
  }

  public String getStandortId() {
    return standortId;
  }

  public LocalDate getDatum() {
    return datum;
  }

  public LocalTime getVon() {
    return von;
  }

  public LocalTime getBis() {
    return bis;
  }

  public BuchungStatus getStatus() {
    return status;
  }
}
