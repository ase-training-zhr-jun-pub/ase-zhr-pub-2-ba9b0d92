package io.innoq.calvin.booking.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import io.innoq.calvin.booking.domain.Buchung;
import io.innoq.calvin.booking.domain.BuchungStatus;
import io.innoq.calvin.booking.repository.BuchungRepository;
import java.time.LocalDate;
import java.time.LocalTime;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class BuchungServiceTest {

  private static final String RAUM = "koeln-rheinblick";
  private static final String STANDORT = "koeln";
  private static final LocalDate DATUM = LocalDate.of(2026, 6, 20);
  private static final LocalTime VON = LocalTime.of(9, 0);
  private static final LocalTime BIS = LocalTime.of(10, 0);

  @Mock private BuchungRepository buchungRepository;
  @Mock private VerfuegbarkeitService verfuegbarkeitService;

  @InjectMocks private BuchungService service;

  @Test
  void legtEntwurfAnWennRaumFrei() {
    when(verfuegbarkeitService.istVerfuegbar(RAUM, DATUM, VON, BIS)).thenReturn(true);
    when(buchungRepository.save(any(Buchung.class))).thenAnswer(inv -> inv.getArgument(0));

    Buchung ergebnis = service.entwurfAnlegen(RAUM, STANDORT, DATUM, VON, BIS);

    assertThat(ergebnis.getStatus()).isEqualTo(BuchungStatus.ENTWURF);
    assertThat(ergebnis.getRaumId()).isEqualTo(RAUM);
    verify(buchungRepository).save(any(Buchung.class));
  }

  @Test
  void wirftWennRaumBelegtUndSpeichertNicht() {
    when(verfuegbarkeitService.istVerfuegbar(RAUM, DATUM, VON, BIS)).thenReturn(false);

    assertThatThrownBy(() -> service.entwurfAnlegen(RAUM, STANDORT, DATUM, VON, BIS))
        .isInstanceOf(RaumBelegtException.class);

    verify(buchungRepository, never()).save(any(Buchung.class));
  }
}
