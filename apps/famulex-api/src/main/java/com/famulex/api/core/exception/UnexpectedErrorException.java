package com.famulex.api.core.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Class BadRequestException
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 05.03.23
 */
@ResponseStatus(code = HttpStatus.INTERNAL_SERVER_ERROR)
public class UnexpectedErrorException extends RuntimeException {

    public UnexpectedErrorException() {
        super();
    }

    public UnexpectedErrorException(String reason) {
        super(reason);
    }
}
