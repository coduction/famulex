package com.famulex.api.core.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Class EntityNotFoundException
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 01.11.22
 */
@ResponseStatus(code = HttpStatus.FORBIDDEN)
public class AccessDeniedException extends RuntimeException {

    public AccessDeniedException() {
        super("Access denied");
    }

}
