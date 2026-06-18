package io.innoq.calvin.booking.web;

import static org.assertj.core.api.Assertions.assertThat;

import io.innoq.calvin.booking.domain.Buchung;
import io.innoq.calvin.booking.domain.BuchungStatus;
import java.time.LocalDate;
import java.time.LocalTime;
import org.junit.jupiter.api.Test;

class BuchungResponseTest {

  @Test
  void mapptAlleFelderAusBuchung() {
    Buchung buchung =
        Buchung.entwurf(
            "koeln-rheinblick",
            "koeln",
            LocalDate.of(2026, 6, 20),
            LocalTime.of(9, 0),
            LocalTime.of(10, 0));

    BuchungResponse response = BuchungResponse.von(buchung);

    assertThat(response.raumId()).isEqualTo("koeln-rheinblick");
    assertThat(response.standortId()).isEqualTo("koeln");
    assertThat(response.datum()).isEqualTo(LocalDate.of(2026, 6, 20));
    assertThat(response.von()).isEqualTo(LocalTime.of(9, 0));
    assertThat(response.bis()).isEqualTo(LocalTime.of(10, 0));
    assertThat(response.status()).isEqualTo(BuchungStatus.ENTWURF);
  }
}
