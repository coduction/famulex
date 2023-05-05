package com.famulex.api.course.api;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

/**
 * Class CourseProgress
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 16.12.22
 */
@Getter
@Setter
@Schema(name = "CourseProgressRequest")
public class CourseProgressRequest {

    private int percentage;
    private boolean completed;
}
