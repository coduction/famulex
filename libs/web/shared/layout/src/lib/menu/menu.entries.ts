import { MenuItem } from "@coduction/primeng/api";

/******************************************************
 * Root entries
 ******************************************************/
export const rootHome: MenuItem = {
  label: $localize`Home`,
  icon: "fa fa-fw fa-house",
  items: []
};

export const rootAuthoring: MenuItem = {
  label: $localize`Authoring`,
  icon: "fa fa-fw fa-cog",
  items: []
};

export const rootSettings: MenuItem = {
  label: $localize`Settings`,
  icon: "fa fa-fw fa-cog",
  items: []
};

/******************************************************
 * Administration
 ******************************************************/
export const administration: MenuItem = {
  label: $localize`Administration`,
  icon: "fa fa-fw fa-cog",
  routerLink: ["/administration"],
  items: []
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

