package com.famulex.api.course;

import com.famulex.api.core.exception.EntityNotFoundException;
import com.famulex.api.course.api.CourseItemResponse;
import com.famulex.api.course.api.CourseMapper;
import com.famulex.api.course.model.CourseItem;
import com.famulex.api.course.repository.CourseItemRepository;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

/**
 * Class CourseController
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 08.10.22
 */
@Tag(name = "Course")
@RestController
@RequestMapping("/courses/{courseKey}/nodes/{nodeKey}/items")
@RequiredArgsConstructor
public class CourseItemController {

  private final CourseItemRepository courseItemRepository;

  private final CourseService courseService;

  private final CourseMapper courseMapper;

  @GetMapping()
  public List<CourseItemResponse> loadItemsForNode(@PathVariable UUID courseKey, @PathVariable UUID nodeKey) {
    courseService.loadCourseNode(courseKey, nodeKey);

    return courseItemRepository.findAllByNodeKey(nodeKey)
      .stream()
      .map(courseMapper::toResponse)
      .toList();
  }

  @GetMapping("/{itemKey}")
  public CourseItemResponse loadItem(@PathVariable UUID courseKey, @PathVariable UUID nodeKey, @PathVariable UUID itemKey) {
    courseService.loadCourseNode(courseKey, nodeKey);

    return courseItemRepository.findByKey(itemKey)
      .map(courseMapper::toResponse)
      .orElseThrow(() -> new EntityNotFoundException(CourseItem.class, itemKey));
  }
}
