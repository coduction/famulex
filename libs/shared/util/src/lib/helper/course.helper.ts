import { CourseNodeType, CourseRole } from "@famulex/shared/famulex-api-client";

export function translateCourseRole(courseRole: CourseRole): string {
  switch (courseRole) {
    case CourseRole.Editor:
      return $localize`Editor`;
    case CourseRole.Owner:
      return $localize`Owner`;
    case CourseRole.Participant:
      return $localize`Participant`;
  }

  return "";
}

export function iconForCourseRole(courseRole: CourseRole): string {
  switch (courseRole) {
    case CourseRole.Editor:
      return "fa fa-fw fa-user";
    case CourseRole.Owner:
      return "fa fa-fw fa-user";
    case CourseRole.Participant:
      return "fa fa-fw fa-user";
  }

  return "";
}

export function prepareCourseRoleRendering(courseRoles: CourseRole[]): { icon: string, label: string }[] {
  const result: { icon: string, label: string }[] = [];

  // Check for every right to maintain the order
  if (courseRoles.includes(CourseRole.Owner)) {
    result.push({ icon: iconForCourseRole(CourseRole.Owner), label: translateCourseRole(CourseRole.Owner) });
  }
  if (courseRoles.includes(CourseRole.Editor)) {
    result.push({ icon: iconForCourseRole(CourseRole.Editor), label: translateCourseRole(CourseRole.Editor) });
  }
  if (courseRoles.includes(CourseRole.Participant)) {
    result.push({ icon: iconForCourseRole(CourseRole.Participant), label: translateCourseRole(CourseRole.Participant) });
  }

  return result;
}

export function translateCourseNodeType(nodeType: CourseNodeType): string {
  switch (nodeType) {
    case CourseNodeType.Chapter:
      return $localize`Chapter`;
    case CourseNodeType.Video:
      return $localize`Video`;
    case CourseNodeType.Pdf:
      return $localize`PDF`;
    case CourseNodeType.Text:
      return $localize`Text`;
    case CourseNodeType.Quiz:
      return $localize`Quiz`;
  }

  return "";
}

export function iconForCourseNodeType(nodeType: CourseNodeType): string {
  switch (nodeType) {
    case CourseNodeType.Chapter:
      return "fa fa-fw fa-folder-tree";
    case CourseNodeType.Pdf:
      return "fa fa-fw fa-file-pdf";
    case CourseNodeType.Quiz:
      return "fa fa-fw fa-block-question";
    case CourseNodeType.Video:
      return "fa fa-fw fa-film";
    case CourseNodeType.Text:
      return "fa fa-fw fa-paragraph";
  }

  return "";
}
