package io.innoq.calvin.booking.repository;

import static org.assertj.core.api.Assertions.assertThat;

import io.innoq.calvin.booking.domain.Buchung;
import io.innoq.calvin.booking.domain.BuchungStatus;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;

@DataJpaTest
class BuchungRepositoryTest {

  private static final String RAUM = "koeln-rheinblick";
  private static final String STANDORT = "koeln";
  private static final LocalDate DATUM = LocalDate.of(2026, 6, 20);

  @Autowired private BuchungRepository repository;

  @Test
  void speichertUndVergibtIdMitStatusEntwurf() {
    Buchung gespeichert =
        repository.save(
            Buchung.entwurf(RAUM, STANDORT, DATUM, LocalTime.of(9, 0), LocalTime.of(10, 0)));

    assertThat(gespeichert.getId()).isNotNull();
    assertThat(gespeichert.getStatus()).isEqualTo(BuchungStatus.ENTWURF);
    assertThat(repository.findById(gespeichert.getId())).isPresent();
  }

  @Test
  void findetEchteUeberschneidung() {
    repository.save(
        Buchung.entwurf(RAUM, STANDORT, DATUM, LocalTime.of(9, 0), LocalTime.of(10, 0)));

    List<Buchung> treffer =
        repository.findUeberlappende(RAUM, DATUM, LocalTime.of(9, 30), LocalTime.of(10, 30));

    assertThat(treffer).hasSize(1);
  }

  @Test
  void ignoriertDirektAngrenzendeSlots() {
    // Bestehende Buchung 09:00–10:00
    repository.save(
        Buchung.entwurf(RAUM, STANDORT, DATUM, LocalTime.of(9, 0), LocalTime.of(10, 0)));

    // Anschluss-Slot 10:00–11:00 überschneidet sich nicht
    List<Buchung> treffer =
        repository.findUeberlappende(RAUM, DATUM, LocalTime.of(10, 0), LocalTime.of(11, 0));

    assertThat(treffer).isEmpty();
  }

  @Test
  void ignoriertAnderenRaumUndAnderesDatum() {
    repository.save(
        Buchung.entwurf(RAUM, STANDORT, DATUM, LocalTime.of(9, 0), LocalTime.of(10, 0)));

    LocalTime von = LocalTime.of(9, 0);
    LocalTime bis = LocalTime.of(10, 0);

    assertThat(repository.findUeberlappende("koeln-dom", DATUM, von, bis)).isEmpty();
    assertThat(repository.findUeberlappende(RAUM, DATUM.plusDays(1), von, bis)).isEmpty();
  }

  @Test
  void findetIdentischeZeitfenster() {
    // Bestehende Buchung 09:00–10:00
    repository.save(
        Buchung.entwurf(RAUM, STANDORT, DATUM, LocalTime.of(9, 0), LocalTime.of(10, 0)));

    // Identisches Zeitfenster 09:00–10:00 überschneidet sich
    List<Buchung> treffer =
        repository.findUeberlappende(RAUM, DATUM, LocalTime.of(9, 0), LocalTime.of(10, 0));

    assertThat(treffer).hasSize(1);
  }

  @Test
  void findetLinksUeberlappung() {
    // Bestehende Buchung 09:00–10:00
    repository.save(
        Buchung.entwurf(RAUM, STANDORT, DATUM, LocalTime.of(9, 0), LocalTime.of(10, 0)));

    // Anfrage 08:30–09:30 überlappt links
    List<Buchung> treffer =
        repository.findUeberlappende(RAUM, DATUM, LocalTime.of(8, 30), LocalTime.of(9, 30));

    assertThat(treffer).hasSize(1);
  }

  @Test
  void findetUmschliessendeBuchung() {
    // Bestehende Buchung 09:00–10:00
    repository.save(
        Buchung.entwurf(RAUM, STANDORT, DATUM, LocalTime.of(9, 0), LocalTime.of(10, 0)));

    // Anfrage 08:00–11:00 umschließt die bestehende Buchung
    List<Buchung> treffer =
        repository.findUeberlappende(RAUM, DATUM, LocalTime.of(8, 0), LocalTime.of(11, 0));

    assertThat(treffer).hasSize(1);
  }

  @Test
  void findetEnthaltenesBuchung() {
    // Bestehende Buchung 09:00–10:00
    repository.save(
        Buchung.entwurf(RAUM, STANDORT, DATUM, LocalTime.of(9, 0), LocalTime.of(10, 0)));

    // Anfrage 09:15–09:45 liegt vollständig innerhalb der bestehenden Buchung
    List<Buchung> treffer =
        repository.findUeberlappende(RAUM, DATUM, LocalTime.of(9, 15), LocalTime.of(9, 45));

    assertThat(treffer).hasSize(1);
  }
}
