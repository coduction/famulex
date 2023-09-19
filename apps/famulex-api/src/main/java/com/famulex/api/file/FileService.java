package com.famulex.api.file;

import com.famulex.api.authoring.course.model.CourseDraft;
import com.famulex.api.authoring.course.model.CourseDraftItem;
import com.famulex.api.core.exception.AccessDeniedException;
import com.famulex.api.core.exception.BadRequestException;
import com.famulex.api.core.util.SecurityHelper;
import com.famulex.api.course.model.Course;
import com.famulex.api.course.model.CourseItem;
import com.famulex.api.file.model.File;
import com.famulex.api.file.model.FilePermission;
import com.famulex.api.file.model.FilePermissionType;
import com.famulex.api.file.repository.FilePermissionRepository;
import com.famulex.api.file.repository.FileRepository;
import com.famulex.api.group.model.Group;
import com.famulex.api.user.UserService;
import com.famulex.api.user.model.User;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.apache.commons.io.FilenameUtils;
import org.apache.tika.Tika;
import org.apache.tika.mime.MimeTypeException;
import org.apache.tika.mime.MimeTypes;
import org.hibernate.internal.util.StringHelper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

/**
 * Class FileService
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 06.03.22
 */
@Log4j2
@Service
@RequiredArgsConstructor
public class FileService {

  /**************************************************************************
   * Repositories
   *************************************************************************/
  private final FileRepository fileRepository;
  private final FilePermissionRepository filePermissionRepository;

  /**************************************************************************
   * Services
   *************************************************************************/
  private final UserService userService;

  /**************************************************************************
   * Configuration Values
   *************************************************************************/
  @Value("${files.directory}")
  private String filesDirectory;
  @Value("${files.ssl.enabled}")
  private boolean httpsEnabled;
  @Value("${server.host}")
  private String serverHost;
  @Value("${server.port}")
  private String serverPort;
  @Value("${server.servlet.context-path}")
  private String contextPath;

  private Path filesDirectoryPath;
  private final MimeTypes mimeTypes = MimeTypes.getDefaultMimeTypes();

  @PostConstruct
  public void initFileService() throws IOException {
    filesDirectoryPath = Paths.get(filesDirectory).toAbsolutePath().normalize();

    if (Files.notExists(filesDirectoryPath)) {
      Files.createDirectory(filesDirectoryPath);
    }

    String serverUrl = httpsEnabled ? "https://" : "http://";
    serverUrl += serverHost;

    // Only for now, since SSL is always disabled in development and active in production
    if (!httpsEnabled) {
      serverUrl += ":";
      serverUrl += serverPort;
    }

    serverUrl += contextPath;

    FileHelper.InitFileHelper(serverUrl, FileController.FILE_ENDPOINT);

    log.info("Files will be stored at " + filesDirectoryPath);
    log.info("Files will be handled at " + serverUrl);
  }

  @Transactional
  public File saveFile(MultipartFile fileInput, String name, Integer length) throws IOException {
    File file = persistFile(fileInput, name, length);

    createFilePermission(file);

    // Reload file to get the new access
    return fileRepository.findById(file.getId())
      .orElseThrow(() -> new RuntimeException("Could not save file or create access"));
  }

  @Transactional
  public File saveFile(MultipartFile fileInput, String name, Integer length, User user) throws IOException {
    File file = persistFile(fileInput, name, length);

    createFilePermission(file, user);

    // Reload file to get the new access
    return fileRepository.findById(file.getId())
      .orElseThrow(() -> new RuntimeException("Could not save file or create personal access"));
  }

  @Transactional
  public File saveFile(MultipartFile fileInput, String name, Integer length, Group group) throws IOException {
    File file = persistFile(fileInput, name, length);

    createFilePermission(file, group);

    // Reload file to get the new access
    return fileRepository.findById(file.getId())
      .orElseThrow(() -> new RuntimeException("Could not save file or create group access"));
  }

  @Transactional
  public File saveFile(MultipartFile fileInput, String name, Integer length, CourseDraft courseDraft, Integer position) throws IOException {
    File file = persistFile(fileInput, name, length);

    // If no position is given, the file is added to the end of the list
    if (position == null) {
      // FilePermission example = new FilePermission();
      // example.setCourseDraft(courseDraft);

      position = filePermissionRepository.countByCourseDraft(courseDraft);
    }

    createFilePermission(file, courseDraft, position);

    // Reload file to get the new access
    return fileRepository.findById(file.getId())
      .orElseThrow(() -> new RuntimeException("Could not save file or create course draft access"));
  }

  public FilePermission saveFile(MultipartFile fileInput, String name, Integer length, CourseDraftItem courseDraftItem, Integer position) throws IOException {
    File file = persistFile(fileInput, name, length);

    // If no position is given, the file is added to the end of the list
    if (position == null) {
      // TODO Learn more about query by example
      // FilePermission example = new FilePermission();
      // example.setCourseDraftItem(courseDraftItem);

      // position = (int) filePermissionRepository.count(Example.of(example));

      position = filePermissionRepository.countByCourseDraftItem(courseDraftItem);
    }

    return createFilePermission(file, courseDraftItem, position);
  }

  /**
   * Saves an image and creates a file permission for public access.
   * Throws an exception if the file is not an image.
   */
  public FilePermission saveImage(MultipartFile imageInput, String name) throws IOException {
    // Check whether the file is an image
    try (InputStream input = imageInput.getInputStream()) {
      var tika = new Tika();
      var mimeType = tika.detect(input);

      if (!mimeType.startsWith("image/")) {
        throw new BadRequestException("Only images are allowed");
      }
    }

    var image = persistFile(imageInput, name, null);

    return createFilePermission(image);
  }

  private File persistFile(MultipartFile fileInput, String name, Integer length) throws IOException {
    // Load creator
    User creator = userService.loadUserFromContext();

    // Create file
    File file = File.builder()
      .name(StringHelper.isBlank(name) ? fileInput.getOriginalFilename() : name)
      .mimeType(fileInput.getContentType())
      .extension(FilenameUtils.getExtension(fileInput.getOriginalFilename()))
      .size(fileInput.getSize())
      .length(length)
      .creator(creator)
      .build();

    if (StringHelper.isBlank(file.getExtension())) {
      try {
        file.setExtension(mimeTypes.forName(file.getMimeType()).getExtension());
      } catch (MimeTypeException e) {
        log.warn("Could not find extension for mime type " + file.getMimeType() + " of file " + file.getName() + " of type " + file.getMimeType());
      }
    }

    file = fileRepository.save(file);

    Path filePath = filesDirectoryPath.resolve(getFileName(file.getKey(), file.getExtension()));
    Files.copy(fileInput.getInputStream(), filePath);

    log.info("File created " + file.getKey() + "." + file.getExtension() + " (" + file.getName() + ") by " + SecurityHelper.getCurrentUserKey());

    return file;
  }

  public void deleteFile(File file) throws IOException {
    Path filePath = filesDirectoryPath.resolve(getFileName(file.getKey(), file.getExtension()));
    Files.delete(filePath);

    fileRepository.delete(file);

    log.info("File deleted " + file.getKey() + "." + file.getExtension() + " (" + file.getName() + ") by " + SecurityHelper.getCurrentUserKey());
  }

  public FilePermission createFilePermission(File file) {
    FilePermission filePermissionPersonal = FilePermission.builder()
      .type(FilePermissionType.PUBLIC)
      .file(file)
      .build();

    return filePermissionRepository.save(filePermissionPersonal);
  }

  public FilePermission createFilePermission(File file, User user) {
    FilePermission filePermissionPersonal = FilePermission.builder()
      .type(FilePermissionType.PERSONAL)
      .file(file)
      .user(user)
      .build();

    return filePermissionRepository.save(filePermissionPersonal);
  }

  public FilePermission createFilePermission(File file, Group group) {
    FilePermission filePermissionGroup = FilePermission.builder()
      .type(FilePermissionType.GROUP)
      .file(file)
      .group(group)
      .build();

    return filePermissionRepository.save(filePermissionGroup);
  }

  public FilePermission createFilePermission(File file, CourseDraft courseDraft, Integer position) {
    FilePermission filePermissionCourseDraft = FilePermission.builder()
      .type(FilePermissionType.COURSE_DRAFT)
      .position(position)
      .file(file)
      .courseDraft(courseDraft)
      .build();

    // TODO Shift positions

    return filePermissionRepository.save(filePermissionCourseDraft);
  }

  public FilePermission createFilePermission(File file, CourseDraftItem courseDraftItem, Integer position) {
    FilePermission filePermissionCourseDraftItem = FilePermission.builder()
      .type(FilePermissionType.COURSE_DRAFT_ITEM)
      .position(position)
      .file(file)
      .courseDraftItem(courseDraftItem)
      .build();

    // TODO Shift positions

    return filePermissionRepository.save(filePermissionCourseDraftItem);
  }

  public FilePermission createFilePermission(File file, Course course, Integer position) {
    FilePermission filePermissionCourse = FilePermission.builder()
      .type(FilePermissionType.COURSE)
      .position(position)
      .file(file)
      .course(course)
      .build();

    // TODO Shift positions

    return filePermissionRepository.save(filePermissionCourse);
  }

  public FilePermission createFilePermission(File file, CourseItem courseItem, Integer position) {
    FilePermission filePermissionCourseItem = FilePermission.builder()
      .type(FilePermissionType.COURSE_ITEM)
      .position(position)
      .file(file)
      .courseItem(courseItem)
      .build();

    // TODO Shift positions

    return filePermissionRepository.save(filePermissionCourseItem);
  }

  @Transactional
  public void deleteFilePermission(FilePermission filePermission) throws IOException {
    // Load file
    File file = filePermission.getFile();

    // Check file permission specify actions on delete
    switch (filePermission.getType()) {

    }

    // Delete file permission
    filePermissionRepository.delete(filePermission);
    filePermissionRepository.flush();

    checkAllFileAccessesAndDeleteFile(file);
  }

  @Transactional
  public void deleteFilePermission(Long filePermissionId) throws IOException {
    // Load file permission
    FilePermission filePermission = filePermissionRepository.findById(filePermissionId)
      .orElseThrow(() -> new FileNotFoundException("No file permission was found with the given id: " + filePermissionId));

    deleteFilePermission(filePermission);
  }

  public void checkAllFileAccessesAndDeleteFile(File file) throws IOException {
    // Check whether the file is still used by any other file permissions
    if (filePermissionRepository.existsByFile(file)) {
      return;
    }

    // Delete file physically
    deleteFile(file);
  }

  public File loadFile(UUID key) throws IOException {
    File file = fileRepository
      .findByKey(key)
      .orElseThrow(() -> new FileNotFoundException("No file was found with the given key: " + key));

    checkAccessAllowed(file);

    Path filePath = filesDirectoryPath.resolve(file.getKey() + "." + file.getExtension());
    file.setByteArrayResource(new ByteArrayResource(Files.readAllBytes(filePath)));

    return file;
  }

  public void loadFileContent(File file) throws IOException {
    Path filePath = filesDirectoryPath.resolve(file.getKey() + "." + file.getExtension());
    file.setByteArrayResource(new ByteArrayResource(Files.readAllBytes(filePath)));
  }

  private void checkAccessAllowed(File file) {
    // Check whether file has public access
    List<FilePermission> publicPermissions = filePermissionRepository.findByFileAndType(file, FilePermissionType.PUBLIC)
      .stream()
      .filter(FilePermission::isActive)
      .toList();

    if (!publicPermissions.isEmpty()) {
    }

    // TODO Check whether user has file access

    //checkAccessAllowed(file, userService.loadUserFromContext());
  }

  private void checkAccessAllowed(File file, User user) {
    // TODO Check whether user has file access

    throw new AccessDeniedException();
  }

  public File loadImportTemplate(ImportTemplateType type) throws IOException {
    if (Objects.equals(type, ImportTemplateType.TEST)) {
      InputStream ioStream = this.getClass()
        .getClassLoader()
        .getResourceAsStream("import/TestImport.csv");

      if (ioStream == null) {
        throw new IllegalArgumentException("import/TestImport.csv cannot be found in resources!");
      }

      ByteArrayResource importTemplate = new ByteArrayResource(ioStream.readAllBytes());

      File testImportFile = new File();
      testImportFile.setByteArrayResource(importTemplate);
      testImportFile.setName("Test_Import_Template.csv");
      testImportFile.setSize(importTemplate.contentLength());
      testImportFile.setExtension("csv");
      testImportFile.setMimeType("text/comma-separated-values");

      return testImportFile;
    }

    return null;
  }

  public FileReader readFile(File file) throws FileNotFoundException {
    return new FileReader(filesDirectory + "/" + file.getId() + "." + file.getExtension());
  }

  private String getFileName(UUID fileId, String extension) {
    String fileName = fileId.toString();

    if (Objects.nonNull(extension)) {
      fileName += ".";
      fileName += extension;
    }

    return fileName;
  }

  public enum ImportTemplateType {
    TEST,
    COURSE,
    USER
  }

}
