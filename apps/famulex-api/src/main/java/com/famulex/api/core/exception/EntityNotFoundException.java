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
@ResponseStatus(code = HttpStatus.NOT_FOUND)
public class EntityNotFoundException extends RuntimeException {

    public EntityNotFoundException(String message, String key) {
        super(message + ": " + key);
    }

    public EntityNotFoundException(String message, UUID key) {
        this(message, key.toString());
    }

    public EntityNotFoundException(Class clazz, UUID key) {
        this(clazz.getSimpleName(), key);
    }

    public EntityNotFoundException(String message, String label1, UUID key1, String label2, UUID key2) {
        super(message + ": " + label1 + " " + key1.toString() + ", " + label2 + " " + key2.toString());
    }

}
