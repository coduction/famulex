package com.famulex.api.core.util;

import com.famulex.api.authoring.course.api.request.CourseDraftFilter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Class SpringDocHelper
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 27.08.23
 */
@RestController
@Tag(name = "SpringDocHelper")
@RequestMapping("/system/helper")
@RequiredArgsConstructor
public class SpringDocHelper {

  @GetMapping("/course-draft-filter")
  public CourseDraftFilter getCourseDraftFilter() {
    return new CourseDraftFilter();
  }
  
}
