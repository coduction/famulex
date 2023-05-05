package com.famulex.api.file;

import com.famulex.api.core.exception.EntityNotFoundException;
import com.famulex.api.file.api.FileMapper;
import com.famulex.api.file.api.FileResponse;
import com.famulex.api.file.model.File;
import com.famulex.api.file.model.FilePermission;
import com.famulex.api.file.repository.FilePermissionRepository;
import com.famulex.api.file.repository.FileRepository;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.UUID;


/**
 * Class FileController
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 09.03.22
 */
@RestController
@Tag(name = "File")
@RequestMapping(FileController.FILE_ENDPOINT)
@RequiredArgsConstructor
public class FileController {

  public final static String FILE_ENDPOINT = "/files";
  private final FileService fileService;
  private final FileMapper fileMapper;
  private final FileRepository fileRepository;
  private final FilePermissionRepository filePermissionRepository;

  @GetMapping(path = "/{fileKey}")
  public ResponseEntity<ByteArrayResource> loadFile(@PathVariable String fileKey) throws IOException {
    File file = fileService.loadFile(UUID.fromString(fileKey));

    return ResponseEntity.ok()
      .contentLength(file.getSize())
      .contentType(MediaType.parseMediaType(file.getMimeType()))
      .body(file.getByteArrayResource());
  }

  @GetMapping(path = "/template/{type}")
  public ResponseEntity<ByteArrayResource> loadImportTemplate(@PathVariable String type) throws IOException {
    File file = fileService.loadImportTemplate(FileService.ImportTemplateType.valueOf(type.toUpperCase()));

    return ResponseEntity.ok()
      .contentLength(file.getSize())
      .contentType(MediaType.parseMediaType(file.getMimeType()))
      .body(file.getByteArrayResource());
  }

  @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public FileResponse uploadFile(@RequestParam MultipartFile file,
                                 @RequestParam(required = false) String name,
                                 @RequestParam(required = false) Integer length) throws IOException {
    return fileMapper.toResponse(fileService.saveFile(file, name, length));
  }

  @DeleteMapping("/{fileKey}")
  public void deleteFile(@PathVariable UUID fileKey) throws IOException {
    File file = fileRepository.findByKey(fileKey)
      .orElseThrow(() -> new EntityNotFoundException(File.class, fileKey));

    // TODO Implement custom checks, e.g. if file is used in a course

    fileService.deleteFile(file);
  }

  @DeleteMapping("/permissions/{filePermissionKey}")
  public void deleteFilePermission(@PathVariable UUID filePermissionKey) throws IOException {
    FilePermission filePermission = filePermissionRepository.findByKey(filePermissionKey)
      .orElseThrow(() -> new EntityNotFoundException(FilePermission.class, filePermissionKey));

    fileService.deleteFilePermission(filePermission);
  }

  @ExceptionHandler(IOException.class)
  public ResponseEntity<?> handleFileError(IOException exception) {
    if (exception instanceof FileNotFoundException) {
      return ResponseEntity.notFound().build();
    }

    return ResponseEntity.internalServerError().build();
  }

}
