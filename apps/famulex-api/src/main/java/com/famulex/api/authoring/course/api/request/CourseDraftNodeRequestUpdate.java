package com.famulex.api.authoring.course.api.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

/**
 * Class CourseDraftNodeResponse
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 08.12.22
 */
@Getter
@Setter
public class CourseDraftNodeRequestUpdate {

    @NotNull
    private String title;
    private String description;
    private Integer estimatedTime;
}
