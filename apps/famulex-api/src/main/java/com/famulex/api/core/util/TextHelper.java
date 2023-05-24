package com.famulex.api.core.util;

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
}
