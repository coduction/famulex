package com.famulex.api.system.migration;

import com.famulex.api.system.info.SystemInfoService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

/**
 * Class MigrationService
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 07.09.23
 */
@Log4j2
@Service
@RequiredArgsConstructor
public class MigrationService {

  private final SystemInfoService systemInfoService;

  @PostConstruct
  public void init() {
    log.info("Running migrations...");


    log.info("Migrations done!");
  }
}
