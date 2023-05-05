package com.famulex.api.core.config;

import jakarta.annotation.PostConstruct;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

import java.util.TimeZone;

/**
 * Class GeneralConfig
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 08.12.22
 */
@Log4j2
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(jsr250Enabled = true, securedEnabled = true)
public class GeneralConfig {

    @Value("${timezone.default}")
    private String defaultTimeZone;

    @PostConstruct
    public void init() {
        TimeZone.setDefault(TimeZone.getTimeZone(defaultTimeZone));

        log.info("Default timezone set to {}", defaultTimeZone);
    }
}
