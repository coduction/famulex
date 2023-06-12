package com.famulex.api.security.model;

/**
 * Class Rights
 * <p>
 * Every right starts with a underscore to indicate that it is a right and not a role.
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 01.05.23
 */
public class Rights {
  /******************************************************
   * User
   *****************************************************/
  public static final String ACCESS_COURSES = "_ACCESS_COURSES";
  public static final String ACCESS_TESTS = "_ACCESS_TESTS";

  /******************************************************
   * Certificates
   *****************************************************/
  public static final String ACCESS_CERTIFICATES = "_ACCESS_CERTIFICATES";
  public static final String MANAGE_CERTIFICATES = "_MANAGE_CERTIFICATES";
  public static final String CHECK_CERTIFICATES = "_CHECK_CERTIFICATES";

  /******************************************************
   * Authoring
   *****************************************************/
  public static final String CREATE_COURSES = "_CREATE_COURSES";
  public static final String CREATE_TESTS = "_CREATE_TESTS";
  public static final String MANAGE_COURSES = "_MANAGE_COURSES";
  public static final String MANAGE_TESTS = "_MANAGE_TESTS";

  /******************************************************
   * Library
   *****************************************************/
  public static final String ACCESS_LIBRARY = "_ACCESS_LIBRARY";
  public static final String CREATE_LIBRARIES = "_CREATE_LIBRARIES";
  public static final String MANAGE_LIBRARIES = "_MANAGE_LIBRARIES";

  /******************************************************
   * Administration
   *****************************************************/
  public static final String MANAGE_USERS = "_MANAGE_USERS";
  public static final String MANAGE_GROUPS = "_MANAGE_GROUPS";
  public static final String MANAGE_ROLES = "_MANAGE_ROLES";
  public static final String SYNC_KEYCLOAK = "_SYNC_KEYCLOAK";
}
