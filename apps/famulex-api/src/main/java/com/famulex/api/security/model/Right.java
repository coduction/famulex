package com.famulex.api.security.model;

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
  ACCESS_CERTIFICATES(Rights.ACCESS_CERTIFICATES),

  /******************************************************
   * User
   *****************************************************/
  CREATE_COURSES(Rights.CREATE_COURSES),
  CREATE_TESTS(Rights.CREATE_TESTS),
  MANAGE_COURSES(Rights.MANAGE_COURSES),
  MANAGE_TESTS(Rights.MANAGE_TESTS),


  /******************************************************
   * User
   *****************************************************/
  ACCESS_LIBRARY(Rights.ACCESS_LIBRARY),
  MANAGE_LIBRARIES(Rights.MANAGE_LIBRARIES),

  /******************************************************
   * User
   *****************************************************/
  MANAGE_USERS(Rights.MANAGE_USERS),
  MANAGE_GROUPS(Rights.MANAGE_GROUPS),
  MANAGE_ROLES(Rights.MANAGE_ROLES),
  SYNC_KEYCLOAK(Rights.SYNC_KEYCLOAK);

  Right(String label) {
    this.label = label;
  }

  private final String label;

  public String toString() {
    return this.label;
  }
}
