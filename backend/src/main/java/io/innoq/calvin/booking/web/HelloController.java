package io.innoq.calvin.booking.web;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Einfacher Health-/Verbindungstest-Endpunkt, um die Verbindung zwischen
 * Frontend (SPA) und Booking Service zu prüfen.
 */
@RestController
@RequestMapping("/api")
public class HelloController {

    @GetMapping("/hello")
    public String hello() {
        return "Hello World!";
    }
}
