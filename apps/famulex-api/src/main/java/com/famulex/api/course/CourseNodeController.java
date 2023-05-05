package com.famulex.api.course;

import com.famulex.api.course.api.CourseMapper;
import com.famulex.api.course.api.CourseNodeResponse;
import com.famulex.api.course.repository.CourseNodeRepository;
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
@RequestMapping("/courses/{courseKey}/nodes")
@RequiredArgsConstructor
public class CourseNodeController {

  private final CourseNodeRepository courseNodeRepository;

  private final CourseService courseService;

  private final CourseMapper courseMapper;

  @GetMapping()
  public List<CourseNodeResponse> loadNodesForCourse(@PathVariable UUID courseKey) {
    courseService.checkExistence(courseKey);

    return courseNodeRepository.findAllByCourseKey(courseKey)
      .stream()
      .map(courseMapper::toResponse)
      .toList();
  }

  @GetMapping("/{nodeKey}")
  public CourseNodeResponse loadNode(@PathVariable UUID courseKey, @PathVariable UUID nodeKey) {
    var courseNode = courseService.loadCourseNode(courseKey, nodeKey);

    return courseMapper.toResponse(courseNode);
  }
}
