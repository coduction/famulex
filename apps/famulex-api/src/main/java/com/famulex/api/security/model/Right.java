package com.famulex.api.security.model;

import com.fasterxml.jackson.annotation.JsonValue;

import java.util.Collections;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * Enum Right
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 13.11.22
 */
public enum Right {
  /******************************************************
   * User
   *****************************************************/
  ACCESS_COURSES(Rights.ACCESS_COURSES),
  ACCESS_TESTS(Rights.ACCESS_TESTS),

  /******************************************************
   * CERTIFICATES
   *****************************************************/
  ACCESS_CERTIFICATES(Rights.ACCESS_CERTIFICATES),
  MANAGE_CERTIFICATES(Rights.MANAGE_CERTIFICATES),
  CHECk_CERTIFICATES(Rights.CHECK_CERTIFICATES),

  /******************************************************
   * Authoring
   *****************************************************/
  CREATE_COURSES(Rights.CREATE_COURSES),
  CREATE_TESTS(Rights.CREATE_TESTS),
  MANAGE_COURSES(Rights.MANAGE_COURSES),
  MANAGE_TESTS(Rights.MANAGE_TESTS),

  /******************************************************
   * Library
   *****************************************************/
  ACCESS_LIBRARY(Rights.ACCESS_LIBRARY),
  CREATE_LIBRARIES(Rights.CREATE_LIBRARIES),
  MANAGE_LIBRARIES(Rights.MANAGE_LIBRARIES),

  /******************************************************
   * Administration
   *****************************************************/
  MANAGE_USERS(Rights.MANAGE_USERS),
  MANAGE_GROUPS(Rights.MANAGE_GROUPS),
  MANAGE_ROLES(Rights.MANAGE_ROLES),
  SYNC_KEYCLOAK(Rights.SYNC_KEYCLOAK),
  MANAGE_SYSTEM(Rights.MANAGE_SYSTEM);

  private final String label;
  private static final Map<String, Right> RIGHT_MAP;

  Right(String label) {
    this.label = label;
  }

  static {
    Map<String, Right> map = Stream.of(Right.values())
      .collect(Collectors.toMap(Right::getLabel, Function.identity()));

    RIGHT_MAP = Collections.unmodifiableMap(map);
  }

  public static Right get(String label) {
    if (!RIGHT_MAP.containsKey(label)) {
      throw new IllegalArgumentException("No right with label " + label + " found");
    }

    return RIGHT_MAP.get(label);
  }

  @JsonValue
  public String getLabel() {
    return label;
  }

  public String toString() {
    return this.label;
  }
}
