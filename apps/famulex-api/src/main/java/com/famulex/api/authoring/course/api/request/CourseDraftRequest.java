package com.famulex.api.authoring.course.api.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

/**
 * Class CourseDraftResponse
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 08.12.22
 */
@Getter
@Setter
public class CourseDraftRequest {

    @NotBlank
    private String title;
    private String description;
    private String author;

}
