package com.famulex.api.core.util;

import java.util.List;

/**
 * Class StringHelper
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 23.05.23
 */
public class TextHelper {

  /**
   * Trim and remove extra blanks from string
   *
   * @param string
   * @return
   */
  public static String removeExtraBlanks(String string) {
    if (string == null) {
      return null;
    }

    return string.trim().replaceAll("\\s+", " ");
  }

  /**
   * Prepare string for full text search. Split string by blanks and remove extra blanks.
   *
   * @param string
   * @return
   */
  public static List<String> prepareFullTextSearch(String string) {
    if (string == null) {
      return null;
    }

    return List.of(removeExtraBlanks(string).split(" "));
  }

  /**
   * Convert camel case string to pascal case string
   *
   * @param string
   * @return
   */
  public static String camelToSnake(String string, boolean upperCase) {
    string = string.replaceAll("([a-z])([A-Z]+)", "$1_$2");

    if (upperCase) {
      return string.toUpperCase();
    }

    return string.toLowerCase();
  }
}
