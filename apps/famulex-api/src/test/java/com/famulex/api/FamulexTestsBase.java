package com.famulex.api;

import jakarta.annotation.PostConstruct;
import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

/**
 * Class SuperTest
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 29.04.23
 */
@Log4j2
@SpringBootTest
@ActiveProfiles("test")
public abstract class FamulexTestsBase {

    private static boolean initialized = false;

    @PostConstruct
    public void init() {
        if (initialized) {
            return;
        }

        log.info("Initializing Testing Database");
        initialized = true;
    }

    @Test
    public void contextLoads() {
    }
}
