package com.famulex.api.core.config;

import jakarta.annotation.PostConstruct;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;


/**
 * Class WebMvcConfig
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 08.10.22
 */
@Log4j2
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Value("${cors.origin.domains}")
    private String[] corsDomains;

    @PostConstruct
    public void init() {
        log.info("CORS-Domains: " + String.join(", ", corsDomains));
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        if (corsDomains != null && corsDomains.length > 0) {
            registry.addMapping("/**")
                .allowedOrigins(corsDomains)
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                .exposedHeaders("Authorization", "Cache-Control", "Content-Type");
        }
    }

}
