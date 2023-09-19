package com.famulex.api.file;

import com.famulex.api.file.model.FileAccess;

import java.util.UUID;

/**
 * Class FileHelper
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 10.12.22
 */
public class FileHelper {

  public static String serverUrl;
  public static String fileEndpoint;

  public static void InitFileHelper(String serverUrl, String fileEndpoint) {

    FileHelper.serverUrl = serverUrl;
    FileHelper.fileEndpoint = fileEndpoint;
  }

  public static String formatUrl(UUID fileKey) {
    return serverUrl + "/" + fileKey;
  }

//  public static String formatUrl(FilePermission filePermission) {
//    if (filePermission == null || filePermission.getFile() == null) {
//      return null;
//    }
//
//    var url = serverUrl + "/" + filePermission.getFile().getKey();
//
//    if (filePermission.getFile().getExtension() != null) {
//      url += "." + filePermission.getFile().getExtension();
//    }
//
//    return url;
//  }

  public static String formatUrl(FileAccess fileAccess) {
    if (fileAccess == null) {
      return null;
    }

    var url = serverUrl + fileEndpoint + "/" + fileAccess.getKey();
    var extension = fileAccess.getFilePermission().getFile().getExtension();

    if (extension != null) {
      url += "." + extension;
    }

    return url;
  }
}
