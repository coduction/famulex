package com.famulex.api.core.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.UUID;

/**
 * Class EntityNotFoundException
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 01.11.22
 */
@ResponseStatus(code = HttpStatus.CONFLICT)
public class ConflictException extends RuntimeException {
    
    public ConflictException(String message, String... keys) {
        super(message + ": " + String.join(", ", keys));
    }

    public ConflictException(String message, UUID key) {
        this(message, key.toString());
    }

    public ConflictException(Class clazz, UUID key) {
        this(clazz.getSimpleName(), key);
    }

}
