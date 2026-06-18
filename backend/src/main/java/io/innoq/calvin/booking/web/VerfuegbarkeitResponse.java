package io.innoq.calvin.booking.web;

/** Antwort der Verfügbarkeitsprüfung: ist der Konferenzraum im angefragten Zeitfenster frei? */
public record VerfuegbarkeitResponse(boolean verfuegbar) {}
