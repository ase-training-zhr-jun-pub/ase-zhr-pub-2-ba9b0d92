package io.innoq.calvin.booking.web;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDate;
import java.time.LocalTime;
import org.junit.jupiter.api.Test;

class BuchungAnlegenRequestTest {

  private static final LocalDate DATUM = LocalDate.of(2026, 6, 20);

  @Test
  void zeitfensterGueltigWennVonVorBis() {
    BuchungAnlegenRequest request =
        new BuchungAnlegenRequest(
            "koeln-rheinblick", "koeln", DATUM, LocalTime.of(9, 0), LocalTime.of(10, 0));

    assertThat(request.isZeitfensterGueltig()).isTrue();
  }

  @Test
  void zeitfensterUngueltigWennVonGleichBis() {
    BuchungAnlegenRequest request =
        new BuchungAnlegenRequest(
            "koeln-rheinblick", "koeln", DATUM, LocalTime.of(10, 0), LocalTime.of(10, 0));

    assertThat(request.isZeitfensterGueltig()).isFalse();
  }

  @Test
  void zeitfensterUngueltigWennVonNachBis() {
    BuchungAnlegenRequest request =
        new BuchungAnlegenRequest(
            "koeln-rheinblick", "koeln", DATUM, LocalTime.of(10, 0), LocalTime.of(9, 0));

    assertThat(request.isZeitfensterGueltig()).isFalse();
  }
}
