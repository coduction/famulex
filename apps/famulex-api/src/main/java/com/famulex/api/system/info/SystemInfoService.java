package com.famulex.api.system.info;

import com.famulex.api.file.FileService;
import com.famulex.api.file.model.FilePermission;
import com.famulex.api.system.info.model.SystemInfo;
import com.famulex.api.system.info.repository.SystemInfoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

/**
 * Class SystemInfoService
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 07.09.23
 */
@Service
@RequiredArgsConstructor
public class SystemInfoService {

  private final SystemInfoRepository systemInfoRepository;

  private final FileService fileService;

  public FilePermission saveLogo(MultipartFile logo) throws IOException {
    var systemInfo = getSystemInfo();

    var logoPermission = fileService.saveImage(logo, "logo");

    systemInfo.setLogoPermission(logoPermission);

    systemInfoRepository.save(systemInfo);

    return logoPermission;
  }

  public FilePermission saveCompactLogo(MultipartFile logo) throws IOException {
    var systemInfo = getSystemInfo();

    var compactLogoPermission = fileService.saveImage(logo, "logo-compact");

    systemInfo.setCompactLogoPermission(compactLogoPermission);

    systemInfoRepository.save(systemInfo);

    return compactLogoPermission;
  }

  public SystemInfo getSystemInfo() {
    return systemInfoRepository.findFirst()
        .orElseGet(() -> systemInfoRepository.save(new SystemInfo()));
  }

}
