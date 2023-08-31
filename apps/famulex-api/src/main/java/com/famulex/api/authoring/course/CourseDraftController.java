package com.famulex.api.authoring.course;

import com.famulex.api.authoring.course.api.CourseDraftMapper;
import com.famulex.api.authoring.course.api.request.CourseDraftFilter;
import com.famulex.api.authoring.course.api.request.CourseDraftRequest;
import com.famulex.api.authoring.course.api.response.CourseDraftResponse;
import com.famulex.api.authoring.course.model.CourseDraft;
import com.famulex.api.authoring.course.repository.CourseDraftRepository;
import com.famulex.api.core.exception.AccessDeniedException;
import com.famulex.api.core.exception.EntityNotFoundException;
import com.famulex.api.core.util.SecurityHelper;
import com.famulex.api.course.model.CourseStatus;
import com.famulex.api.course.repository.CourseRepository;
import com.famulex.api.file.FileService;
import com.famulex.api.file.repository.FilePermissionRepository;
import com.famulex.api.security.model.Right;
import com.famulex.api.security.model.Rights;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.annotation.Secured;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.OffsetDateTime;
import java.util.Optional;
import java.util.UUID;

/**
 * Class CourseDraftController
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 07.12.22
 */
@RestController
@Tag(name = "CourseDraft")
@RequestMapping("/authoring/courses")
@RequiredArgsConstructor
public class CourseDraftController {

  private final CourseDraftRepository courseDraftRepository;
  private final CourseRepository courseRepository;
  private final FilePermissionRepository filePermissionRepository;

  private final CourseDraftService courseDraftService;
  private final FileService fileService;

  private final CourseDraftMapper courseDraftMapper;

  @GetMapping
  @Secured({Rights.MANAGE_COURSES, Rights.CREATE_COURSES})
  public Page<CourseDraftResponse> loadCourseDrafts(@ParameterObject Pageable pagination,
                                                    @Valid CourseDraftFilter filter) {
    if (SecurityHelper.userHasNotRight(Right.MANAGE_COURSES) && !filter.isMyCourses()) {
      throw new AccessDeniedException("You are not allowed to access all courses.");
    }

    if (filter.isMyCourses()) {
      filter.setOwnerKey(SecurityHelper.getCurrentUserKey());
    }

    return courseDraftRepository.searchCourseDrafts(filter, pagination)
      .map(courseDraftMapper::toResponse);
  }

  @Transactional
  @GetMapping("/{draftKey}")
  public Optional<CourseDraftResponse> loadCourseDraft(@PathVariable UUID draftKey) {
    return courseDraftRepository.findByKey(draftKey)
      .map(courseDraftMapper::toResponse);
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public CourseDraftResponse createCourseDraft(@Valid @RequestBody CourseDraftRequest courseDraftRequest) {
    CourseDraft courseDraft = courseDraftMapper.fromRequest(courseDraftRequest);
    courseDraft.setStatus(CourseStatus.DRAFT);

    // TODO Create membership as editor for the current user

    courseDraft = courseDraftRepository.save(courseDraft);

    return courseDraftMapper.toResponse(courseDraft);
  }

  @PutMapping("/{draftKey}")
  public CourseDraftResponse updateCourseDraft(@PathVariable UUID draftKey, @Valid @RequestBody CourseDraftRequest courseDraftRequest) {
    CourseDraft courseDraft = courseDraftRepository.findByKey(draftKey)
      .orElseThrow(() -> new EntityNotFoundException("Course draft not found", draftKey));

    courseDraftMapper.updateFromRequest(courseDraftRequest, courseDraft);

    // TODO Check if course actually changed
    courseDraft.setStatus(CourseStatus.EDITED);
    courseDraft.setPublishedAt(OffsetDateTime.now());

    courseDraft = courseDraftRepository.save(courseDraft);

    return courseDraftMapper.toResponse(courseDraft);
  }

  @Transactional
  @DeleteMapping("/{key}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteCourseDraft(@PathVariable UUID key) {
    CourseDraft courseDraft = courseDraftRepository.findByKey(key)
      .orElseThrow(() -> new EntityNotFoundException("Course draft not found", key));

    courseRepository.deleteByCourseDraft(courseDraft);
    courseDraftRepository.delete(courseDraft);
  }

  @PostMapping(path = "/{draftKey}/files",
    consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public CourseDraftResponse uploadFileForCourseDraft(@PathVariable UUID draftKey,
                                                      @RequestParam MultipartFile file,
                                                      @RequestParam(required = false) String name,
                                                      @RequestParam(required = false) Integer length) throws IOException {
    CourseDraft courseDraft = courseDraftRepository.findByKey(draftKey)
      .orElseThrow(() -> new EntityNotFoundException("Course draft not found", draftKey));

    // Save file
    fileService.saveFile(file, name, length, courseDraft, null);

    // Reload item to get updated file information
    // TODO Handle edge case where item was deleted in the meantime, ask on StackOverflow
    courseDraft = courseDraftRepository.findById(courseDraft.getId())
      .orElseThrow(() -> new RuntimeException("Could not upload file to course. Maybe it was deleted..."));

    return courseDraftMapper.toResponse(courseDraft);
  }
}
