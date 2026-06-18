package io.innoq.calvin.booking.service;

import io.innoq.calvin.booking.repository.BuchungRepository;
import java.time.LocalDate;
import java.time.LocalTime;
import org.springframework.stereotype.Service;

/**
 * Prüft die Verfügbarkeit eines Konferenzraums für ein Zeitfenster.
 *
 * <p>Ein Raum gilt als verfügbar, wenn keine bestehende Buchung desselben Raums am selben Datum
 * sich mit dem angefragten Zeitfenster überschneidet (Doppelbuchungs-Prüfung, QS-1).
 */
@Service
public class VerfuegbarkeitService {

  private final BuchungRepository buchungRepository;

  public VerfuegbarkeitService(BuchungRepository buchungRepository) {
    this.buchungRepository = buchungRepository;
  }

  public boolean istVerfuegbar(String raumId, LocalDate datum, LocalTime von, LocalTime bis) {
    return buchungRepository.findUeberlappende(raumId, datum, von, bis).isEmpty();
  }
}
