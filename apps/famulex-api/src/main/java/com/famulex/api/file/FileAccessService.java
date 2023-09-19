package com.famulex.api.file;

import com.famulex.api.file.model.FileAccess;
import com.famulex.api.file.model.FilePermission;
import com.famulex.api.file.repository.FileAccessRepository;
import lombok.RequiredArgsConstructor;
import org.jobrunr.scheduling.JobScheduler;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;

/**
 * Class FileAccessService
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 14.09.23
 */
@Service
@RequiredArgsConstructor
public class FileAccessService {

  @Value("${files.url.timeout}")
  private int fileUrlTimeout;   // Timeout in seconds

  private final FileAccessRepository fileAccessRepository;

  private final JobScheduler jobScheduler;

  public FileAccess createFileAccess(FilePermission filePermission) {
    var fileAccess = FileAccess.builder()
      .filePermission(filePermission)
      .validUntil(OffsetDateTime.now().plusSeconds(fileUrlTimeout))
      .build();

    fileAccess = fileAccessRepository.save(fileAccess);

    // Extract id because of usage in lambda function below
    var fileAccessId = fileAccess.getId();
    jobScheduler.schedule(fileAccess.getValidUntil(), (FileAccessRepository fileAccessRepository) -> fileAccessRepository.deleteById(fileAccessId));
    
    return fileAccess;
  }

}
