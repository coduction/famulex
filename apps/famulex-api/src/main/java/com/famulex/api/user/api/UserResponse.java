package com.famulex.api.user.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Class UserResponse
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 05.12.22
 */
@Getter
@Setter
@Schema(name = "User")
public class UserResponse {

    @NotNull
    private UUID key;
    @NotNull
    private OffsetDateTime createdAt;
    @NotNull
    private OffsetDateTime updatedAt;
    private OffsetDateTime lastActiveAt;

    @NotBlank
    private String username;
    @NotBlank
    private String email;
    @NotBlank
    private String firstName;
    @NotBlank
    private String lastName;
}
