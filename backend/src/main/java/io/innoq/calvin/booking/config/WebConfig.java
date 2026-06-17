package io.innoq.calvin.booking.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * CORS-Konfiguration für den Booking Service.
 *
 * <p>Hinter dem Crucible-Proxy laufen Frontend (…/proxy/5173/) und Backend (…/proxy/8080/) zwar auf
 * derselben Origin, in GitHub Codespaces aber auf unterschiedlichen Subdomains (NAME-5173… vs.
 * NAME-8080…). Damit das Frontend den Booking Service in beiden Umgebungen erreichen kann, erlauben
 * wir für die Prototyp-Phase CORS-Anfragen von beliebigen Origins auf die /api/**-Endpunkte.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

  @Override
  public void addCorsMappings(CorsRegistry registry) {
    registry
        .addMapping("/api/**")
        .allowedOriginPatterns("*")
        .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
        .allowedHeaders("*");
  }
}
