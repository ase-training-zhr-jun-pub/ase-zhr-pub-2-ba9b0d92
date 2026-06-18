package io.innoq.calvin.booking.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import io.innoq.calvin.booking.domain.Buchung;
import io.innoq.calvin.booking.repository.BuchungRepository;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class VerfuegbarkeitServiceTest {

  private static final String RAUM = "koeln-rheinblick";
  private static final LocalDate DATUM = LocalDate.of(2026, 6, 20);
  private static final LocalTime VON = LocalTime.of(9, 0);
  private static final LocalTime BIS = LocalTime.of(10, 0);

  @Mock private BuchungRepository buchungRepository;

  @InjectMocks private VerfuegbarkeitService service;

  @Test
  void verfuegbarWennKeineUeberlappung() {
    when(buchungRepository.findUeberlappende(RAUM, DATUM, VON, BIS)).thenReturn(List.of());

    assertThat(service.istVerfuegbar(RAUM, DATUM, VON, BIS)).isTrue();
  }

  @Test
  void belegtWennUeberlappungVorhanden() {
    when(buchungRepository.findUeberlappende(RAUM, DATUM, VON, BIS))
        .thenReturn(List.of(Buchung.entwurf(RAUM, "koeln", DATUM, VON, BIS)));

    assertThat(service.istVerfuegbar(RAUM, DATUM, VON, BIS)).isFalse();
  }
}
