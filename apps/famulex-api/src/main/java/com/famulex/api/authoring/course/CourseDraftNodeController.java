package com.famulex.api.authoring.course;

import com.famulex.api.authoring.course.api.CourseDraftMapper;
import com.famulex.api.authoring.course.api.request.CourseDraftNodeRequestCreate;
import com.famulex.api.authoring.course.api.request.CourseDraftNodeRequestUpdate;
import com.famulex.api.authoring.course.api.response.CourseDraftNodeResponse;
import com.famulex.api.authoring.course.model.CourseDraftNode;
import com.famulex.api.authoring.course.repository.CourseDraftItemRepository;
import com.famulex.api.authoring.course.repository.CourseDraftNodeRepository;
import com.famulex.api.authoring.course.repository.CourseDraftRepository;
import com.famulex.api.core.exception.BadRequestException;
import com.famulex.api.core.exception.EntityNotFoundException;
import com.famulex.api.course.model.CourseNodeType;
import com.famulex.api.course.repository.CourseItemRepository;
import com.famulex.api.course.repository.CourseNodeRepository;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * Class CourseDraftController
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 07.12.22
 */
@RestController
@Tag(name = "CourseDraft")
@RequestMapping("/authoring/courses/{courseDraftKey}/nodes")
@RequiredArgsConstructor
public class CourseDraftNodeController {

  private final CourseDraftRepository courseDraftRepository;
  private final CourseDraftNodeRepository courseDraftNodeRepository;
  private final CourseNodeRepository courseNodeRepository;
  private final CourseItemRepository courseItemRepository;

  private final CourseDraftService courseDraftService;
  private final CourseDraftMapper courseDraftMapper;
  private final CourseDraftItemRepository courseDraftItemRepository;

  @PersistenceContext
  private final EntityManager entityManager;

  @Transactional
  @GetMapping()
  public List<CourseDraftNodeResponse> loadCourseDraftNodes(@PathVariable UUID courseDraftKey) {
    courseDraftService.checkExistence(courseDraftKey);

    return courseDraftNodeRepository.findByCourseDraftKey(courseDraftKey)
      .stream()
      .map(courseDraftMapper::toResponse)
      .sorted() // TODO Check if this is necessary
      .toList();
  }

  @Transactional
  @PostMapping()
  @ResponseStatus(HttpStatus.CREATED)
  public CourseDraftNodeResponse createCourseDraftNode(@PathVariable UUID courseDraftKey, @Valid @RequestBody CourseDraftNodeRequestCreate nodeRequest) {
    var courseDraft = courseDraftService.loadCourseDraft(courseDraftKey);

    CourseDraftNode parentNode = null;
    if (nodeRequest.getParentKey() != null) {
      parentNode = courseDraftNodeRepository.findByCourseDraftKeyAndKey(courseDraftKey, nodeRequest.getParentKey())
        .orElseThrow(() -> new EntityNotFoundException("Parent node not found", nodeRequest.getParentKey()));
    }

    // Only create child nodes for nodes of type chapter
    if (parentNode != null && parentNode.getType() != CourseNodeType.CHAPTER) {
      throw new BadRequestException("Only nodes of type chapter can have child nodes");
    }

    CourseDraftNode node = courseDraftMapper.fromRequest(nodeRequest);

    node = courseDraftService.createCourseDraftNode(courseDraft, parentNode, node);

    return courseDraftMapper.toResponse(node);
  }

  @PutMapping("/{draftNodeKey}")
  public CourseDraftNodeResponse updateCourseDraftNode(@PathVariable UUID courseDraftKey, @PathVariable UUID draftNodeKey, @Valid @RequestBody CourseDraftNodeRequestUpdate draftNodeRequest) {
    var draftNode = courseDraftService.loadCourseDraftNode(courseDraftKey, draftNodeKey);

    courseDraftMapper.updateFromRequest(draftNodeRequest, draftNode);
    draftNode = courseDraftNodeRepository.save(draftNode);

    return courseDraftMapper.toResponse(draftNode);
  }

  @DeleteMapping("/{nodeKey}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteCourseDraftNode(@PathVariable UUID courseDraftKey, @PathVariable UUID nodeKey) {
    var nodeToDelete = courseDraftService.loadCourseDraftNode(courseDraftKey, nodeKey);

    courseDraftService.deleteCourseDraftNode(nodeToDelete);
  }
}
