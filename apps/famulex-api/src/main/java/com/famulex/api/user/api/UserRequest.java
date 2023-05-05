package com.famulex.api.user.api;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

/**
 * Class UserResponse
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 05.12.22
 */
@Getter
@Setter
public class UserRequest {

    @NotBlank
    private String username;
    @Email
    @NotBlank
    private String email;
    @NotBlank
    private String firstName;
    @NotBlank
    private String lastName;

    private String password;
    private Boolean passwordTemporary;

}
