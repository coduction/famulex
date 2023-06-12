import { MenuItem } from "@coduction/primeng/api";

/******************************************************
 * Root entries
 ******************************************************/
export const rootHome: MenuItem = {
  label: $localize`Home`,
  items: []
};

export const rootCertificates: MenuItem = {
  label: $localize`Certificates`,
  items: []
};

export const rootLibrary: MenuItem = {
  label: $localize`Certificates`,
  items: []
};

export const rootAuthoring: MenuItem = {
  label: $localize`Authoring`,
  items: []
};

export const rootSettings: MenuItem = {
  label: $localize`Settings`,
  items: []
};

/******************************************************
 * Home
 ******************************************************/
export const dashboard: MenuItem = {
  label: $localize`Dashboard`,
  icon: "fa fa-fw fa-house",
  routerLink: ["/dashboard"]
};

export const myCourses: MenuItem = {
  label: $localize`My Courses`,
  icon: "fa fa-fw fa-book",
  routerLink: ["/my-courses"]
};

export const testResults: MenuItem = {
  label: $localize`Test Results`,
  icon: "fa fa-fw fa-flask-vial",
  routerLink: ["/test-results"]
};

/******************************************************
 * Library
 ******************************************************/
export const library: MenuItem = {
  label: $localize`Library`,
  icon: "fa fa-fw fa-books",
  routerLink: ["/library"]
};

/******************************************************
 * Authoring
 ******************************************************/
export const courseAuthoring: MenuItem = {
  label: $localize`Courses`,
  icon: "fa fa-fw fa-wand-magic-sparkles",
  routerLink: ["/authoring/courses"]
};

export const testAuthoring: MenuItem = {
  label: $localize`Tests`,
  icon: "fa fa-fw fa-flask-gear",
  routerLink: ["/authoring/tests"]
};

/******************************************************
 * Certificates
 ******************************************************/
export const accessCertificates: MenuItem = {
  label: $localize`Certificates`,
  icon: "fa fa-fw fa-file-certificate",
  routerLink: ["/certificates"]
};

export const checkCertificates: MenuItem = {
  label: $localize`Check Certificates`,
  icon: "fa fa-fw fa-stamp",
  routerLink: ["/certificates/check"]
};

/******************************************************
 * Administration
 ******************************************************/
export const administration: MenuItem = {
  label: $localize`Administration`,
  icon: "fa fa-fw fa-cog"
};

export const administrationUsers: MenuItem = {
  label: $localize`Users`,
  icon: "fa fa-fw fa-user",
  routerLink: ["/administration/users"]
};

export const administrationGroups: MenuItem = {
  label: $localize`Groups`,
  icon: "fa fa-fw fa-users",
  routerLink: ["/administration/groups"]
};

export const administrationRoles: MenuItem = {
  label: $localize`Roles`,
  icon: "fa fa-fw fa-shield-quartered",
  routerLink: ["/administration/roles"]
};

export const administrationLibraries: MenuItem = {
  label: $localize`Libraries`,
  icon: "fa fa-fw fa-books",
  routerLink: ["/administration/libraries"]
};

