package com.famulex.api.core.mapper;

import org.mapstruct.Qualifier;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Interface SameTypeMapping
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 15.12.22
 */
@Qualifier
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.SOURCE)
public @interface SameTypeMapping {
}
