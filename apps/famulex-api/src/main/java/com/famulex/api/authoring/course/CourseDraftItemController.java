package com.famulex.api.authoring.course;

import com.famulex.api.authoring.course.api.CourseDraftMapper;
import com.famulex.api.authoring.course.api.request.CourseDraftItemRequestCreate;
import com.famulex.api.authoring.course.api.response.CourseDraftItemResponse;
import com.famulex.api.authoring.course.model.CourseDraftItem;
import com.famulex.api.authoring.course.model.CourseDraftNode;
import com.famulex.api.authoring.course.repository.CourseDraftItemRepository;
import com.famulex.api.authoring.course.repository.CourseDraftNodeRepository;
import com.famulex.api.authoring.course.repository.CourseDraftRepository;
import com.famulex.api.core.exception.BadRequestException;
import com.famulex.api.core.exception.EntityNotFoundException;
import com.famulex.api.course.model.CourseNodeType;
import com.famulex.api.file.FileService;
import com.famulex.api.file.api.FileMapper;
import com.famulex.api.file.api.FilePermissionResponse;
import com.famulex.api.file.repository.FilePermissionRepository;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
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
@RequestMapping("/authoring/courses/{draftKey}/nodes/{nodeKey}/items")
@RequiredArgsConstructor
public class CourseDraftItemController {

  /**************************************************************************
   * Repositories
   *************************************************************************/
  private final CourseDraftRepository courseDraftRepository;
  private final CourseDraftNodeRepository courseDraftNodeRepository;
  private final CourseDraftItemRepository courseDraftItemRepository;
  private final FilePermissionRepository filePermissionRepository;

  /**************************************************************************
   * Services
   *************************************************************************/
  private final CourseDraftService courseDraftService;
  private final FileService fileService;

  /**************************************************************************
   * Mappers
   *************************************************************************/
  private final CourseDraftMapper courseDraftMapper;
  private final FileMapper fileMapper;

  @GetMapping()
  public List<CourseDraftItemResponse> loadCourseDraftItems(@PathVariable UUID draftKey, @PathVariable UUID nodeKey) {
    // Check whether course draft exists
    if (!courseDraftRepository.existsByKey(draftKey)) {
      throw new EntityNotFoundException("Course draft not found", draftKey);
    }

    // Check whether node exists
    if (!courseDraftNodeRepository.existsByKey(nodeKey)) {
      throw new EntityNotFoundException("Course draft node not found", nodeKey);
    }

    return courseDraftItemRepository.findAllByNodeKey(nodeKey)
      .stream()
      .map(courseDraftMapper::toResponse)
      .sorted()
      .toList();
  }

  @PostMapping()
  @ResponseStatus(HttpStatus.CREATED)
  public CourseDraftItemResponse createCourseDraftItem(@PathVariable UUID draftKey, @PathVariable UUID nodeKey, @Valid @RequestBody CourseDraftItemRequestCreate itemRequest) {
    // Check whether course draft exists
    if (!courseDraftRepository.existsByKey(draftKey)) {
      throw new EntityNotFoundException("Course draft not found", draftKey);
    }

    CourseDraftNode node = courseDraftNodeRepository.findByKey(nodeKey)
      .orElseThrow(() -> new EntityNotFoundException("Course draft node not found", nodeKey));

    // Only create item if node has type chapter
    if (node.getType() != CourseNodeType.CHAPTER) {
      throw new BadRequestException("Only nodes of type chapter can have items");
    }

    CourseDraftItem item = courseDraftMapper.fromRequest(itemRequest);

    item = courseDraftService.saveCourseDraftItem(node, item);

    return courseDraftMapper.toResponse(item);
  }

  @Transactional
  @PutMapping("/{itemKey}")
  public CourseDraftItemResponse updateCourseDraftItem(@PathVariable UUID draftKey, @PathVariable UUID nodeKey, @PathVariable UUID itemKey, @RequestBody String content) {
    CourseDraftItem itemToUpdate = checkExistenceAndLoadItem(draftKey, nodeKey, itemKey);

    itemToUpdate.setContent(content);
    itemToUpdate = courseDraftItemRepository.save(itemToUpdate);

    return courseDraftMapper.toResponse(itemToUpdate);
  }

  @DeleteMapping("/{itemKey}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteCourseDraftItem(@PathVariable UUID draftKey, @PathVariable UUID nodeKey, @PathVariable UUID itemKey) {
    CourseDraftItem itemToDelete = checkExistenceAndLoadItem(draftKey, nodeKey, itemKey);

    courseDraftService.deleteCourseDraftItem(itemToDelete);
  }

  @PostMapping(path = "/{itemKey}/files", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public FilePermissionResponse uploadFileForItem(@PathVariable UUID draftKey, @PathVariable UUID nodeKey, @PathVariable UUID itemKey,
                                                  @RequestParam MultipartFile file,
                                                  @RequestParam(required = false) String name,
                                                  @RequestParam(required = false) Integer length,
                                                  @RequestParam(required = false) Integer position) throws IOException {
    CourseDraftItem item = checkExistenceAndLoadItem(draftKey, nodeKey, itemKey);

    // Save file
    var filePermission = fileService.saveFile(file, name, length, item, position);

    return fileMapper.toResponse(filePermission);
  }


  private CourseDraftItem checkExistenceAndLoadItem(UUID draftKey, UUID nodeKey, UUID itemKey) {
    // Check whether course draft exists
    if (!courseDraftRepository.existsByKey(draftKey)) {
      throw new EntityNotFoundException("Course draft not found", draftKey);
    }

    // Check whether node exists
    if (!courseDraftNodeRepository.existsByKey(nodeKey)) {
      throw new EntityNotFoundException("Course draft node not found", nodeKey);
    }

    return courseDraftItemRepository.findByKey(itemKey)
      .orElseThrow(() -> new EntityNotFoundException("Course draft node item not found", itemKey));
  }

}
