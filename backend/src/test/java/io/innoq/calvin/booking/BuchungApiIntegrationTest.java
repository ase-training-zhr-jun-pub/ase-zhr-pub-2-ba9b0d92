package io.innoq.calvin.booking;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import io.innoq.calvin.booking.repository.BuchungRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

/**
 * Integrationstests für den Buchungs-API-Layer.
 *
 * <p>Im Gegensatz zu den Unit-Tests ({@code @WebMvcTest} mit Mocks) lädt diese Klasse den
 * vollständigen Spring-Kontext und verwendet die echte H2-In-Memory-Datenbank, um den kompletten
 * Stack Controller → Service → Repository → DB zu testen.
 */
@SpringBootTest
@AutoConfigureMockMvc
class BuchungApiIntegrationTest {

  private static final String RAUM_A = "koeln-rheinblick";
  private static final String RAUM_B = "koeln-mediapark";
  private static final String STANDORT = "koeln";
  private static final String DATUM = "2026-07-15";

  @Autowired private MockMvc mockMvc;

  @Autowired private BuchungRepository buchungRepository;

  @BeforeEach
  void datenloeschen() {
    buchungRepository.deleteAll();
  }

  // ---------------------------------------------------------------------------
  // 1. Vollständiger Buchungs-Flow: POST → 201, Buchung in DB
  // ---------------------------------------------------------------------------

  @Test
  void vollstaendigerBuchungsFlow_BuchungWirdInDbGespeichert() throws Exception {
    String body =
        """
        {"raumId":"%s","standortId":"%s","datum":"%s","von":"09:00","bis":"10:00"}
        """
            .formatted(RAUM_A, STANDORT, DATUM);

    mockMvc
        .perform(post("/api/buchungen").contentType(MediaType.APPLICATION_JSON).content(body))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.id").isNumber())
        .andExpect(jsonPath("$.raumId").value(RAUM_A))
        .andExpect(jsonPath("$.standortId").value(STANDORT))
        .andExpect(jsonPath("$.datum").value(DATUM))
        .andExpect(jsonPath("$.von").value("09:00:00"))
        .andExpect(jsonPath("$.bis").value("10:00:00"))
        .andExpect(jsonPath("$.status").value("ENTWURF"));

    assertThat(buchungRepository.findAll()).hasSize(1);
    assertThat(buchungRepository.findAll().get(0).getRaumId()).isEqualTo(RAUM_A);
  }

  // ---------------------------------------------------------------------------
  // 2. Doppelbuchungs-Schutz: zweites POST auf gleichen Raum/Zeitraum → 409
  // ---------------------------------------------------------------------------

  @Test
  void doppelbuchungsSchutz_ZweitesBuchungLiefert409() throws Exception {
    String body =
        """
        {"raumId":"%s","standortId":"%s","datum":"%s","von":"10:00","bis":"11:00"}
        """
            .formatted(RAUM_A, STANDORT, DATUM);

    // Erste Buchung gelingt
    mockMvc
        .perform(post("/api/buchungen").contentType(MediaType.APPLICATION_JSON).content(body))
        .andExpect(status().isCreated());

    // Zweite Buchung auf demselben Zeitfenster wird abgelehnt
    mockMvc
        .perform(post("/api/buchungen").contentType(MediaType.APPLICATION_JSON).content(body))
        .andExpect(status().isConflict());

    // Nur eine Buchung darf in der DB sein
    assertThat(buchungRepository.findAll()).hasSize(1);
  }

  @Test
  void doppelbuchungsSchutz_UeberlappendeBuchungLiefert409() throws Exception {
    String ersteBody =
        """
        {"raumId":"%s","standortId":"%s","datum":"%s","von":"09:00","bis":"10:00"}
        """
            .formatted(RAUM_A, STANDORT, DATUM);
    String zweiteBody =
        """
        {"raumId":"%s","standortId":"%s","datum":"%s","von":"09:30","bis":"10:30"}
        """
            .formatted(RAUM_A, STANDORT, DATUM);

    mockMvc
        .perform(post("/api/buchungen").contentType(MediaType.APPLICATION_JSON).content(ersteBody))
        .andExpect(status().isCreated());

    mockMvc
        .perform(post("/api/buchungen").contentType(MediaType.APPLICATION_JSON).content(zweiteBody))
        .andExpect(status().isConflict());

    assertThat(buchungRepository.findAll()).hasSize(1);
  }

  // ---------------------------------------------------------------------------
  // 3. Verfügbarkeit wechselt von true auf false nach Buchung
  // ---------------------------------------------------------------------------

  @Test
  void verfuegbarkeit_WechseltVonTrueAufFalseNachBuchung() throws Exception {
    // Vor der Buchung: Raum ist verfügbar
    mockMvc
        .perform(
            get("/api/raeume/{raumId}/verfuegbarkeit", RAUM_A)
                .param("datum", DATUM)
                .param("von", "14:00")
                .param("bis", "15:00"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.verfuegbar").value(true));

    // Buchung anlegen
    String body =
        """
        {"raumId":"%s","standortId":"%s","datum":"%s","von":"14:00","bis":"15:00"}
        """
            .formatted(RAUM_A, STANDORT, DATUM);
    mockMvc
        .perform(post("/api/buchungen").contentType(MediaType.APPLICATION_JSON).content(body))
        .andExpect(status().isCreated());

    // Nach der Buchung: Raum ist nicht mehr verfügbar
    mockMvc
        .perform(
            get("/api/raeume/{raumId}/verfuegbarkeit", RAUM_A)
                .param("datum", DATUM)
                .param("von", "14:00")
                .param("bis", "15:00"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.verfuegbar").value(false));
  }

  // ---------------------------------------------------------------------------
  // 4. Ungültige Eingaben durchlaufen echte Validierung → 400
  // ---------------------------------------------------------------------------

  @Test
  void ungueltigesZeitfenster_EndZeitVorStartzeit_Liefert400() throws Exception {
    String body =
        """
        {"raumId":"%s","standortId":"%s","datum":"%s","von":"11:00","bis":"09:00"}
        """
            .formatted(RAUM_A, STANDORT, DATUM);

    mockMvc
        .perform(post("/api/buchungen").contentType(MediaType.APPLICATION_JSON).content(body))
        .andExpect(status().isBadRequest());

    assertThat(buchungRepository.findAll()).isEmpty();
  }

  @Test
  void ungueltigesZeitfenster_GleicheStartUndEndzeit_Liefert400() throws Exception {
    String body =
        """
        {"raumId":"%s","standortId":"%s","datum":"%s","von":"10:00","bis":"10:00"}
        """
            .formatted(RAUM_A, STANDORT, DATUM);

    mockMvc
        .perform(post("/api/buchungen").contentType(MediaType.APPLICATION_JSON).content(body))
        .andExpect(status().isBadRequest());

    assertThat(buchungRepository.findAll()).isEmpty();
  }

  @Test
  void fehlendesPflichtfeld_RaumId_Liefert400() throws Exception {
    String body =
        """
        {"standortId":"%s","datum":"%s","von":"09:00","bis":"10:00"}
        """
            .formatted(STANDORT, DATUM);

    mockMvc
        .perform(post("/api/buchungen").contentType(MediaType.APPLICATION_JSON).content(body))
        .andExpect(status().isBadRequest());

    assertThat(buchungRepository.findAll()).isEmpty();
  }

  // ---------------------------------------------------------------------------
  // 5. Buchung in Raum A blockiert Raum B nicht
  // ---------------------------------------------------------------------------

  @Test
  void buchungInRaumABlockiertRaumBNicht() throws Exception {
    // Raum A buchen
    String raumABody =
        """
        {"raumId":"%s","standortId":"%s","datum":"%s","von":"09:00","bis":"10:00"}
        """
            .formatted(RAUM_A, STANDORT, DATUM);
    mockMvc
        .perform(post("/api/buchungen").contentType(MediaType.APPLICATION_JSON).content(raumABody))
        .andExpect(status().isCreated());

    // Raum B zur gleichen Zeit ist trotzdem verfügbar
    mockMvc
        .perform(
            get("/api/raeume/{raumId}/verfuegbarkeit", RAUM_B)
                .param("datum", DATUM)
                .param("von", "09:00")
                .param("bis", "10:00"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.verfuegbar").value(true));

    // Raum B kann auch gebucht werden
    String raumBBody =
        """
        {"raumId":"%s","standortId":"%s","datum":"%s","von":"09:00","bis":"10:00"}
        """
            .formatted(RAUM_B, STANDORT, DATUM);
    mockMvc
        .perform(post("/api/buchungen").contentType(MediaType.APPLICATION_JSON).content(raumBBody))
        .andExpect(status().isCreated());

    assertThat(buchungRepository.findAll()).hasSize(2);
  }

  // ---------------------------------------------------------------------------
  // 6. Direkt angrenzende Zeitfenster blockieren sich nicht (kein Off-by-one)
  // ---------------------------------------------------------------------------

  @Test
  void direktAngrenzendeZeitfensterBlockierenSichNicht() throws Exception {
    // 9:00-10:00 buchen
    String ersteBody =
        """
        {"raumId":"%s","standortId":"%s","datum":"%s","von":"09:00","bis":"10:00"}
        """
            .formatted(RAUM_A, STANDORT, DATUM);
    mockMvc
        .perform(post("/api/buchungen").contentType(MediaType.APPLICATION_JSON).content(ersteBody))
        .andExpect(status().isCreated());

    // 10:00-11:00 direkt anschließend muss ebenfalls möglich sein
    String zweiteBody =
        """
        {"raumId":"%s","standortId":"%s","datum":"%s","von":"10:00","bis":"11:00"}
        """
            .formatted(RAUM_A, STANDORT, DATUM);
    mockMvc
        .perform(post("/api/buchungen").contentType(MediaType.APPLICATION_JSON).content(zweiteBody))
        .andExpect(status().isCreated());

    assertThat(buchungRepository.findAll()).hasSize(2);
  }
}
