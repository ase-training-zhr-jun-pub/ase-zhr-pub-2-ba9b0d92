package io.innoq.calvin.booking.web;

import io.innoq.calvin.booking.service.VerfuegbarkeitService;
import java.time.LocalDate;
import java.time.LocalTime;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

/** REST-Endpunkt zur Verfügbarkeitsprüfung eines Konferenzraums. */
@RestController
@RequestMapping("/api/raeume")
public class VerfuegbarkeitController {

  private final VerfuegbarkeitService verfuegbarkeitService;

  public VerfuegbarkeitController(VerfuegbarkeitService verfuegbarkeitService) {
    this.verfuegbarkeitService = verfuegbarkeitService;
  }

  @GetMapping("/{raumId}/verfuegbarkeit")
  public VerfuegbarkeitResponse verfuegbarkeit(
      @PathVariable String raumId,
      @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate datum,
      @RequestParam @DateTimeFormat(pattern = "HH:mm") LocalTime von,
      @RequestParam @DateTimeFormat(pattern = "HH:mm") LocalTime bis) {
    if (!von.isBefore(bis)) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "Die Endzeit muss nach der Startzeit liegen.");
    }
    boolean verfuegbar = verfuegbarkeitService.istVerfuegbar(raumId, datum, von, bis);
    return new VerfuegbarkeitResponse(verfuegbar);
  }
}
