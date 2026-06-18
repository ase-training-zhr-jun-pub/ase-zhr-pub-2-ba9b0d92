package io.innoq.calvin.booking.web;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import io.innoq.calvin.booking.domain.Buchung;
import io.innoq.calvin.booking.service.BuchungService;
import io.innoq.calvin.booking.service.RaumBelegtException;
import java.time.LocalDate;
import java.time.LocalTime;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(BuchungController.class)
class BuchungControllerTest {

  private static final String VALID_BODY =
      """
      {"raumId":"koeln-rheinblick","standortId":"koeln","datum":"2026-06-20",\
      "von":"09:00","bis":"10:00"}\
      """;

  @Autowired private MockMvc mockMvc;

  @MockitoBean private BuchungService buchungService;

  @Test
  void legtEntwurfAnUndLiefert201() throws Exception {
    Buchung gespeichert =
        Buchung.entwurf(
            "koeln-rheinblick",
            "koeln",
            LocalDate.of(2026, 6, 20),
            LocalTime.of(9, 0),
            LocalTime.of(10, 0));
    when(buchungService.entwurfAnlegen(
            eq("koeln-rheinblick"),
            eq("koeln"),
            any(LocalDate.class),
            any(LocalTime.class),
            any(LocalTime.class)))
        .thenReturn(gespeichert);

    mockMvc
        .perform(post("/api/buchungen").contentType(MediaType.APPLICATION_JSON).content(VALID_BODY))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.status").value("ENTWURF"))
        .andExpect(jsonPath("$.raumId").value("koeln-rheinblick"));
  }

  @Test
  void liefert409WennRaumBelegt() throws Exception {
    when(buchungService.entwurfAnlegen(any(), any(), any(), any(), any()))
        .thenThrow(new RaumBelegtException("belegt"));

    mockMvc
        .perform(post("/api/buchungen").contentType(MediaType.APPLICATION_JSON).content(VALID_BODY))
        .andExpect(status().isConflict());
  }

  @Test
  void liefert400BeiUngueltigemZeitfenster() throws Exception {
    String body =
        """
        {"raumId":"koeln-rheinblick","standortId":"koeln","datum":"2026-06-20",\
        "von":"10:00","bis":"09:00"}\
        """;

    mockMvc
        .perform(post("/api/buchungen").contentType(MediaType.APPLICATION_JSON).content(body))
        .andExpect(status().isBadRequest());
  }

  @Test
  void liefert400BeiFehlendemPflichtfeld() throws Exception {
    String body =
        """
        {"standortId":"koeln","datum":"2026-06-20","von":"09:00","bis":"10:00"}\
        """;

    mockMvc
        .perform(post("/api/buchungen").contentType(MediaType.APPLICATION_JSON).content(body))
        .andExpect(status().isBadRequest());
  }

  @Test
  void liefert400BeiLeeremRequestBody() throws Exception {
    mockMvc
        .perform(post("/api/buchungen").contentType(MediaType.APPLICATION_JSON).content("{}"))
        .andExpect(status().isBadRequest());
  }

  @Test
  void liefert400BeiUngueltigemJson() throws Exception {
    mockMvc
        .perform(
            post("/api/buchungen").contentType(MediaType.APPLICATION_JSON).content("nicht-json"))
        .andExpect(status().isBadRequest());
  }
}
