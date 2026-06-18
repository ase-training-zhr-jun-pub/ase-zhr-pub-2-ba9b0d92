package io.innoq.calvin.booking.web;

import io.innoq.calvin.booking.domain.Buchung;
import io.innoq.calvin.booking.service.BuchungService;
import io.innoq.calvin.booking.service.RaumBelegtException;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/** REST-Endpunkt zum Anlegen von Buchungen. */
@RestController
@RequestMapping("/api/buchungen")
public class BuchungController {

  private final BuchungService buchungService;

  public BuchungController(BuchungService buchungService) {
    this.buchungService = buchungService;
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public BuchungResponse erstelle(@Valid @RequestBody BuchungAnlegenRequest request) {
    Buchung buchung =
        buchungService.entwurfAnlegen(
            request.raumId(), request.standortId(), request.datum(), request.von(), request.bis());
    return BuchungResponse.von(buchung);
  }

  @ExceptionHandler(RaumBelegtException.class)
  @ResponseStatus(HttpStatus.CONFLICT)
  public String raumBelegt(RaumBelegtException ex) {
    return ex.getMessage();
  }
}
