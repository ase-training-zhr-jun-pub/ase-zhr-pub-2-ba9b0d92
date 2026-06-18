package io.innoq.calvin.booking.service;

/**
 * Wird geworfen, wenn ein Konferenzraum im gewünschten Zeitfenster bereits belegt ist und daher
 * kein Buchungs-Entwurf angelegt werden kann (Schutz gegen Doppelbuchung).
 *
 * <p>Bewusst ohne Web-Annotation, damit die Service-Schicht von der Web-Schicht entkoppelt bleibt;
 * das Mapping auf HTTP 409 erfolgt im Controller.
 */
public class RaumBelegtException extends RuntimeException {

  public RaumBelegtException(String message) {
    super(message);
  }
}
