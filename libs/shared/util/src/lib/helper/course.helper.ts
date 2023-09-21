import { CourseRole } from "@famulex/shared/famulex-api-client";

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
