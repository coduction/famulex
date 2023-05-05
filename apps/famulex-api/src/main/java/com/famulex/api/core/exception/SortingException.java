package com.famulex.api.core.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Class EntityNotFoundException
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 01.11.22
 */
@ResponseStatus(code = HttpStatus.BAD_REQUEST)
public class SortingException extends RuntimeException {

    public SortingException() {
        super("For this endpoint only one sort order is allowed!");
    }

}
