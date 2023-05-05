package com.famulex.api.file;

import com.famulex.api.file.model.FilePermission;

import java.util.UUID;

/**
 * Class FileHelper
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 10.12.22
 */
public class FileHelper {

  private static String serverUrl;

  public static void InitFileHelper(String serverUrl) {
    FileHelper.serverUrl = serverUrl;
  }

  public static String formatUrl(UUID fileKey) {
    return serverUrl + "/" + fileKey;
  }

  public static String formatUrl(FilePermission filePermission) {
    return serverUrl + "/" + filePermission.getFile().getKey();
  }
}
