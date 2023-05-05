package com.famulex.api.authoring.course;

import com.famulex.api.authoring.course.api.CourseDraftMapper;
import com.famulex.api.authoring.course.api.response.CourseDraftResponse;
import com.famulex.api.authoring.course.model.CoursePublicationMapper;
import com.famulex.api.authoring.course.repository.CourseDraftRepository;
import com.famulex.api.course.repository.CourseRepository;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

/**
 * Class CourseDraftPublicationController
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 12.12.22
 */
@RestController
@Tag(name = "CourseDraft")
@RequestMapping("/authoring/courses/{draftKey}/publish")
@RequiredArgsConstructor
public class CourseDraftPublicationController {

  private final CourseRepository courseRepository;
  private final CourseDraftRepository courseDraftRepository;

  private final CourseDraftPublicationService courseDraftPublishService;

  private final CourseDraftMapper courseDraftMapper;
  private final CoursePublicationMapper publishMapper;

  @PostMapping("/validate")
  public CourseDraftResponse validateCourseDraft(@PathVariable UUID draftKey) {
    return courseDraftMapper.toResponse(courseDraftPublishService.loadAndValidateCourseDraft(draftKey));
  }

  @PostMapping()
  @Transactional
  public CourseDraftResponse publishCourseDraft(@PathVariable UUID draftKey, HttpServletResponse response) {
    var publication = courseDraftPublishService.publishCourseDraft(draftKey);

    if (!publication.isSuccessful()) { // Set response status to 422 given the course draft is invalid
      response.setStatus(HttpStatus.UNPROCESSABLE_ENTITY.value());
    }

    return courseDraftMapper.toResponse(publication.getObject());
  }
}
