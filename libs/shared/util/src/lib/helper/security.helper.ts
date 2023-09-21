import { Right } from "@famulex/shared/famulex-api-client";

export function translateRight(right: Right): string {
  switch (right) {
    // User Permissions
    case Right.AccessCourses:
      return $localize`Access Courses`;
    case Right.AccessTests:
      return $localize`Access Tests`;
    case Right.AccessLibrary:
      return $localize`Access Library`;

    // Certificate Permissions
    case Right.AccessCertificates:
      return $localize`Access Certificates`;
    case Right.ManageCertificates:
      return $localize`Manage Certificates`;
    case Right.CheckCertificates:
      return $localize`Check Certificates`;

    // Editor Permissions
    case Right.CreateCourses:
      return $localize`Create Courses`;
    case Right.ManageCourses:
      return $localize`Manage Courses`;
    case Right.CreateTests:
      return $localize`Create Tests`;
    case Right.ManageTests:
      return $localize`Manage Tests`;
    case Right.CreateLibraries:
      return $localize`Create Libraries`;
    case Right.ManageLibraries:
      return $localize`Manage Libraries`;

    // Administration Permissions
    case Right.ManageUsers:
      return $localize`Manage Users`;
    case Right.ManageGroups:
      return $localize`Manage Groups`;
    case Right.ManageRoles:
      return $localize`Manage Roles`;
    case Right.ManageSystem:
      return $localize`Manage System`;
  }

  return "";
}

export function iconForRight(right: Right): string {
  switch (right) {
    // User Permissions
    case Right.AccessCourses:
    case Right.AccessTests:
    case Right.AccessLibrary:
      return "fa fa-fw fa-user";

    // Certificate Permissions
    case Right.AccessCertificates:
    case Right.ManageCertificates:
    case Right.CheckCertificates:
      return "fa fa-fw fa-file-certificate";

    // Editor Permissions
    case Right.CreateCourses:
    case Right.ManageCourses:
    case Right.CreateTests:
    case Right.ManageTests:
    case Right.CreateLibraries:
    case Right.ManageLibraries:
      return "fa fa-fw fa-pencil-alt";

    // Administration Permissions
    case Right.ManageUsers:
    case Right.ManageGroups:
    case Right.ManageRoles:
    case Right.ManageSystem:
      return "fa fa-fw fa-cog";
  }

  return "";
}

export function prepareRightsRendering(rights: Right[]): { icon: string, label: string }[] {
  const result: { icon: string, label: string }[] = [];

  // Check for every right to maintain the order
  if (rights.includes(Right.AccessCourses)) {
    result.push({ icon: iconForRight(Right.AccessCourses), label: translateRight(Right.AccessCourses) });
  }
  if (rights.includes(Right.AccessTests)) {
    result.push({ icon: iconForRight(Right.AccessTests), label: translateRight(Right.AccessTests) });
  }
  if (rights.includes(Right.AccessLibrary)) {
    result.push({ icon: iconForRight(Right.AccessLibrary), label: translateRight(Right.AccessLibrary) });
  }

  if (rights.includes(Right.AccessCertificates)) {
    result.push({ icon: iconForRight(Right.AccessCertificates), label: translateRight(Right.AccessCertificates) });
  }
  if (rights.includes(Right.ManageCertificates)) {
    result.push({ icon: iconForRight(Right.ManageCertificates), label: translateRight(Right.ManageCertificates) });
  }
  if (rights.includes(Right.CheckCertificates)) {
    result.push({ icon: iconForRight(Right.CheckCertificates), label: translateRight(Right.CheckCertificates) });
  }

  if (rights.includes(Right.CreateCourses)) {
    result.push({ icon: iconForRight(Right.CreateCourses), label: translateRight(Right.CreateCourses) });
  }
  if (rights.includes(Right.ManageCourses)) {
    result.push({ icon: iconForRight(Right.ManageCourses), label: translateRight(Right.ManageCourses) });
  }
  if (rights.includes(Right.CreateTests)) {
    result.push({ icon: iconForRight(Right.CreateTests), label: translateRight(Right.CreateTests) });
  }
  if (rights.includes(Right.ManageTests)) {
    result.push({ icon: iconForRight(Right.ManageTests), label: translateRight(Right.ManageTests) });
  }
  if (rights.includes(Right.CreateLibraries)) {
    result.push({ icon: iconForRight(Right.CreateLibraries), label: translateRight(Right.CreateLibraries) });
  }
  if (rights.includes(Right.ManageLibraries)) {
    result.push({ icon: iconForRight(Right.ManageLibraries), label: translateRight(Right.ManageLibraries) });
  }

  if (rights.includes(Right.ManageUsers)) {
    result.push({ icon: iconForRight(Right.ManageUsers), label: translateRight(Right.ManageUsers) });
  }
  if (rights.includes(Right.ManageGroups)) {
    result.push({ icon: iconForRight(Right.ManageGroups), label: translateRight(Right.ManageGroups) });
  }
  if (rights.includes(Right.ManageRoles)) {
    result.push({ icon: iconForRight(Right.ManageRoles), label: translateRight(Right.ManageRoles) });
  }
  if (rights.includes(Right.ManageSystem)) {
    result.push({ icon: iconForRight(Right.ManageSystem), label: translateRight(Right.ManageSystem) });
  }

  return result;
}
