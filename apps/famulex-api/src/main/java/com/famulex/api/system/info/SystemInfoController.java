package com.famulex.api.system.info;

import com.famulex.api.file.FileService;
import com.famulex.api.file.api.FileMapper;
import com.famulex.api.file.api.FilePermissionResponse;
import com.famulex.api.security.model.Rights;
import com.famulex.api.system.info.api.SystemInfoMapper;
import com.famulex.api.system.info.api.SystemInfoResponse;
import com.famulex.api.system.info.repository.SystemInfoRepository;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

/**
 * Class SystemInfoController
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 07.09.23
 */
@RestController
@Tag(name = "SystemInfo")
@RequestMapping("/system/info")
@RequiredArgsConstructor
public class SystemInfoController {

  private final SystemInfoRepository systemInfoRepository;

  private final FileService fileService;
  private final SystemInfoService systemInfoService;

  private final FileMapper fileMapper;
  private final SystemInfoMapper systemInfoMapper;

  @GetMapping
  public SystemInfoResponse loadSystemInfo() {
    return systemInfoMapper.toResponse(systemInfoService.getSystemInfo());
  }

  @GetMapping("/logo")
  public ResponseEntity<ByteArrayResource> loadLogo() throws IOException {
    var systemInfo = systemInfoService.getSystemInfo();

    if (systemInfo.getLogoPermission() == null) {
      return null;
    }

    var file = systemInfo.getLogoPermission().getFile();
    fileService.loadFileContent(file);

    return ResponseEntity.ok()
      .contentType(MediaType.parseMediaType(file.getMimeType()))
      .contentLength(file.getSize())
      .body(file.getByteArrayResource());
  }

  @Secured(Rights.MANAGE_SYSTEM)
  @PostMapping(value = "/logo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public FilePermissionResponse uploadLogo(@RequestParam MultipartFile logo) throws IOException {
    return fileMapper.toResponse(systemInfoService.saveLogo(logo));
  }

  @Transactional
  @Secured(Rights.MANAGE_SYSTEM)
  @DeleteMapping("/logo")
  public void deleteLogo() throws IOException {
    var systemInfo = systemInfoService.getSystemInfo();

    if (systemInfo.getLogoPermission() == null) {
      return;
    }

    // 1. Get logo permission id
    var logoPermissionId = systemInfo.getLogoPermission().getId();

    // 2. Remove logo permission from system info
    systemInfo.setLogoPermission(null);
    systemInfoRepository.save(systemInfo);

    // 3. Delete logo permission
    fileService.deleteFilePermission(logoPermissionId);
  }

  @GetMapping("/logo-compact")
  public ResponseEntity<ByteArrayResource> loadCompactLogo() throws IOException {
    var systemInfo = systemInfoService.getSystemInfo();

    if (systemInfo.getCompactLogoPermission() == null) {
      return null;
    }

    var file = systemInfo.getCompactLogoPermission().getFile();
    fileService.loadFileContent(file);

    return ResponseEntity.ok()
      .contentType(MediaType.parseMediaType(file.getMimeType()))
      .contentLength(file.getSize())
      .body(file.getByteArrayResource());
  }

  @Secured(Rights.MANAGE_SYSTEM)
  @PostMapping(value = "/logo-compact", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public FilePermissionResponse uploadCompactLogo(@RequestParam MultipartFile logo) throws IOException {
    return fileMapper.toResponse(systemInfoService.saveCompactLogo(logo));
  }

  @Transactional
  @Secured(Rights.MANAGE_SYSTEM)
  @DeleteMapping("/logo-compact")
  public void deleteCompactLogo() throws IOException {
    var systemInfo = systemInfoService.getSystemInfo();

    if (systemInfo.getCompactLogoPermission() == null) {
      return;
    }

    var compactLogoPermissionId = systemInfo.getCompactLogoPermission().getId();

    systemInfo.setCompactLogoPermission(null);
    systemInfoRepository.save(systemInfo);

    fileService.deleteFilePermission(compactLogoPermissionId);
  }

}
