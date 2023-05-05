package com.famulex.api.testing.api.response;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Class TestResponse
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 17.12.22
 */
@Getter
@Setter
@Schema(name = "Test")
public class TestResponse {

    @NotNull
    private UUID key;
    @NotNull
    private OffsetDateTime createdAt;
    @NotNull
    private OffsetDateTime updatedAt;
    private OffsetDateTime deletedAt;
    private OffsetDateTime archivedAt;
    private OffsetDateTime publishedAt;
    private Integer publishedVersion;

    @NotNull
    private String title;
    private String description;
    private String author;
}
