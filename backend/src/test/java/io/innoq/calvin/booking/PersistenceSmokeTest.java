package io.innoq.calvin.booking;

import static org.assertj.core.api.Assertions.assertThat;

import javax.sql.DataSource;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * Smoke-Test der Persistenz-Foundation (CLVN-028): stellt sicher, dass eine DataSource konfiguriert
 * ist und eine gültige Verbindung zur H2-Datenbank liefert.
 */
@SpringBootTest
class PersistenceSmokeTest {

  @Autowired private DataSource dataSource;

  @Test
  void dataSourceLiefertGueltigeVerbindung() throws Exception {
    assertThat(dataSource).isNotNull();
    try (var connection = dataSource.getConnection()) {
      assertThat(connection.isValid(1)).isTrue();
    }
  }
}
