package io.innoq.calvin.booking.service;

import io.innoq.calvin.booking.domain.Buchung;
import io.innoq.calvin.booking.repository.BuchungRepository;
import java.time.LocalDate;
import java.time.LocalTime;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Anwendungslogik rund um Raumbuchungen. */
@Service
public class BuchungService {

  private final BuchungRepository buchungRepository;
  private final VerfuegbarkeitService verfuegbarkeitService;

  public BuchungService(
      BuchungRepository buchungRepository, VerfuegbarkeitService verfuegbarkeitService) {
    this.buchungRepository = buchungRepository;
    this.verfuegbarkeitService = verfuegbarkeitService;
  }

  /**
   * Legt einen Buchungs-Entwurf an, sofern der Konferenzraum im Zeitfenster frei ist. Die
   * Verfügbarkeitsprüfung und das Persistieren laufen in einer Transaktion, um Doppelbuchungen zu
   * verhindern (QS-1).
   *
   * @throws RaumBelegtException wenn der Raum im Zeitfenster bereits belegt ist
   */
  @Transactional
  public Buchung entwurfAnlegen(
      String raumId, String standortId, LocalDate datum, LocalTime von, LocalTime bis) {
    if (!verfuegbarkeitService.istVerfuegbar(raumId, datum, von, bis)) {
      throw new RaumBelegtException(
          "Der Konferenzraum ist im gewählten Zeitfenster bereits belegt.");
    }
    return buchungRepository.save(Buchung.entwurf(raumId, standortId, datum, von, bis));
  }
}
