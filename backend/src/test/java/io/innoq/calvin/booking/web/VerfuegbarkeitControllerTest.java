package io.innoq.calvin.booking.web;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import io.innoq.calvin.booking.service.VerfuegbarkeitService;
import java.time.LocalDate;
import java.time.LocalTime;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(VerfuegbarkeitController.class)
class VerfuegbarkeitControllerTest {

  @Autowired private MockMvc mockMvc;

  @MockitoBean private VerfuegbarkeitService verfuegbarkeitService;

  @Test
  void liefertVerfuegbarWennRaumFrei() throws Exception {
    when(verfuegbarkeitService.istVerfuegbar(
            eq("koeln-rheinblick"),
            any(LocalDate.class),
            any(LocalTime.class),
            any(LocalTime.class)))
        .thenReturn(true);

    mockMvc
        .perform(
            get("/api/raeume/koeln-rheinblick/verfuegbarkeit")
                .param("datum", "2026-06-20")
                .param("von", "09:00")
                .param("bis", "10:00"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.verfuegbar").value(true));
  }

  @Test
  void liefertBelegtWennRaumNichtFrei() throws Exception {
    when(verfuegbarkeitService.istVerfuegbar(
            eq("koeln-rheinblick"),
            any(LocalDate.class),
            any(LocalTime.class),
            any(LocalTime.class)))
        .thenReturn(false);

    mockMvc
        .perform(
            get("/api/raeume/koeln-rheinblick/verfuegbarkeit")
                .param("datum", "2026-06-20")
                .param("von", "09:00")
                .param("bis", "10:00"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.verfuegbar").value(false));
  }

  @Test
  void liefert400BeiUngueltigemZeitfenster() throws Exception {
    mockMvc
        .perform(
            get("/api/raeume/koeln-rheinblick/verfuegbarkeit")
                .param("datum", "2026-06-20")
                .param("von", "10:00")
                .param("bis", "09:00"))
        .andExpect(status().isBadRequest());
  }
}
