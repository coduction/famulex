package com.famulex.api.testing.api.response;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Class AnswerResponse
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 17.12.22
 */
@Getter
@Setter
@Schema(name = "Answer")
public class AnswerResponse {

    @NotNull
    private UUID key;
    @NotNull
    private OffsetDateTime createdAt;
    @NotNull
    private OffsetDateTime updatedAt;
    private OffsetDateTime publishedAt;

    @NotNull
    private Integer position;
    private boolean required;
    private boolean correct;

    private String title;
    private String description;
    @NotNull
    private String content;
}
