package com.famulex.api.core.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Class BadRequestException
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 06.12.22
 */
@ResponseStatus(code = HttpStatus.BAD_GATEWAY)
public class BadRequestException extends RuntimeException {

    public BadRequestException() {
        super();
    }

    public BadRequestException(String reason) {
        super(reason);
    }
}
