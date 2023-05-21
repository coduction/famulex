package com.famulex.api.security.model;

/**
 * Class Rights
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 01.05.23
 */
public class Rights {
  /******************************************************
   * User
   *****************************************************/
  public static final String ACCESS_COURSES = "ACCESS_COURSES";
  public static final String ACCESS_TESTS = "ACCESS_TESTS";
  public static final String ACCESS_CERTIFICATES = "ACCESS_CERTIFICATES";

  /******************************************************
   * Authoring
   *****************************************************/
  public static final String CREATE_COURSES = "CREATE_COURSES";
  public static final String CREATE_TESTS = "CREATE_TESTS";
  public static final String MANAGE_COURSES = "MANAGE_COURSES";
  public static final String MANAGE_TESTS = "MANAGE_TESTS";

  /******************************************************
   * Library
   *****************************************************/
  public static final String ACCESS_LIBRARY = "ACCESS_LIBRARY";
  public static final String MANAGE_LIBRARIES = "MANAGE_LIBRARIES";

  /******************************************************
   * Administration
   *****************************************************/
  public static final String MANAGE_USERS = "MANAGE_USERS";
  public static final String MANAGE_GROUPS = "MANAGE_GROUPS";
  public static final String MANAGE_ROLES = "MANAGE_ROLES";
  public static final String SYNC_KEYCLOAK = "SYNC_KEYCLOAK";
}
