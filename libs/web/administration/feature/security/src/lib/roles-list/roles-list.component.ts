import { CommonModule, DatePipe }                                                                                             from "@angular/common";
import { Component }                                                                                                          from "@angular/core";
import { ConfirmationService, MessageService }                                                                                from "primeng/api";
import { CardModule }                                                                                                         from "primeng/card";
import { DialogService }                                                                                                      from "primeng/dynamicdialog";
import { MembershipType, Role }                                                                                               from "@famulex/shared/famulex-api-client";
import { ROLE_CREATE_WIZARD_ID, ROLE_EDIT_WIZARD_ID, RoleActions, RoleState }                                                 from "@famulex/web/administration/data-access/role-state";
import { CONFIRM_DIALOG_NON_CLOSEABLE }                                                                                       from "@famulex/web/shared/layout";
import { EntryAction, LoadDataEvent, PermissionRendererComponent, SelectionAction, TableAction, TableColumn, TableComponent } from "@famulex/web/shared/table";
import { WizardActions }                                                                                                      from "@famulex/web/shared/wizard";
import { Store }                                                                                                              from "@ngrx/store";
import { Observable }                                                                                                         from "rxjs";
import { RoleCreateWizardComponent }                                                                                          from "../role-create-wizard/role-create-wizard.component";
import { RoleEditWizardComponent }                                                                                            from "../role-edit-wizard/role-edit-wizard.component";
import { RoleAssignmentsManageComponent, RoleAssignmentsManageConfig }                                                        from "../role-manage-assignments/role-assignments-manage.component";

@Component({
  selector: "security-roles-list",
  standalone: true,
  imports: [CommonModule, CardModule, TableComponent],
  templateUrl: "./roles-list.component.html",
  styleUrls: ["./roles-list.component.scss"],
  providers: [DatePipe]
})
export class RolesListComponent {
  roleColumns: TableColumn<Role>[] = [
    new TableColumn({ key: "key", name: $localize`Key`, field: (role) => role.key, visibleByDefault: false }),
    new TableColumn({ key: "name", name: $localize`Name`, field: (role) => role.name }),
    new TableColumn({ key: "description", name: $localize`Description`, field: (role) => role.description }),
    new TableColumn({ key: "rights", name: $localize`Rights`, field: (role) => role.rights, customRenderer: PermissionRendererComponent, sortable: false }),
    new TableColumn({ key: "createdAt", name: $localize`Created At`, field: (role) => this.datePipe.transform(role.createdAt, "short"), visibleByDefault: false }),
    new TableColumn({ key: "updatedAt", name: $localize`Updated At`, field: (role) => this.datePipe.transform(role.updatedAt, "short"), visibleByDefault: false })
  ];

  tableActions: TableAction[] = [
    {
      label: $localize`Create Role`,
      icon: "fa fa-shield-quartered",
      onClick: () => this.onCreateRole(),
      primary: true
    }
  ];

  entryActions: EntryAction<Role>[] = [
    {
      label: $localize`Edit Role`,
      icon: "fa fa-fw fa-pen-to-square",
      onClick: (role) => this.onEditRole(role)
    },
    {
      label: $localize`Manage Users`,
      icon: "fa fa-fw fa-user-edit",
      onClick: (role) => this.onEditUsers(role)
    },
    {
      label: $localize`Manage Groups`,
      icon: "fa fa-fw fa-users",
      onClick: (role) => this.onEditGroups(role)
    },
    {
      label: $localize`Delete Role`,
      icon: "fa fa-fw fa-trash",
      onClick: (role) => this.onRoleDelete(role)
    }
  ];

  selectionActions: SelectionAction<string, Role>[] = [
    {
      label: (amount) => {
        if (amount === 1) {
          return $localize`Delete ${amount} Role`;
        }

        return $localize`Delete ${amount} Roles`;
      },
      icon: "fa fa-trash",
      resetSelection: true,
      onClick: (roles) => this.onDeleteRoleBulk(roles)
    }
  ];

  roles$: Observable<Role[]> = this.store.select(RoleState.selectAll);
  loading$ = this.store.select(RoleState.selectLoading);
  metaData$ = this.store.select(RoleState.selectTableMetaData);

  constructor(
    private store: Store,
    private datePipe: DatePipe,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService,
    private messageService: MessageService) {
  }

  onLoadData(event: LoadDataEvent) {
    this.store.dispatch(RoleActions.load({ event }));
  }

  onCreateRole() {
    this.store.dispatch(
      WizardActions.open({
        id: ROLE_CREATE_WIZARD_ID,
        component: RoleCreateWizardComponent
      })
    );
  }

  onEditRole(role: Role) {
    this.store.dispatch(
      WizardActions.open({
        id: ROLE_EDIT_WIZARD_ID,
        component: RoleEditWizardComponent,
        config: {
          data: role,
          closable: false
        }
      })
    );
  }

  onEditUsers(role: Role) {
    this.dialogService.open(RoleAssignmentsManageComponent, {
      data: {
        role: role,
        type: MembershipType.User
      } as RoleAssignmentsManageConfig,
      width: "60rem",
      header: $localize`Manage Users - ${role.name}`
    });
  }

  onEditGroups(role: Role) {
    this.messageService.add({ severity: "info", summary: `Manage Groups - ${role.name}`, detail: "This feature is not implemented yet." });
  }

  onRoleDelete(role: Role) {
    this.confirmationService.confirm({
      key: CONFIRM_DIALOG_NON_CLOSEABLE,
      header: $localize`Delete User`,
      message: $localize`Are you sure you want to delete the role <b>${role.name}</b>?`,
      icon: "fa fa-trash",
      rejectVisible: true,
      accept: () => this.store.dispatch(RoleActions.delete({ role }))
    });
  }

  onDeleteRoleBulk(roles: Map<string, Role>) {
    return new Promise<boolean>(resolve => {
      this.confirmationService.confirm({
        key: CONFIRM_DIALOG_NON_CLOSEABLE,
        header: $localize`Delete Multiple Roles`,
        message: roles.size === 1 ? $localize`Are you sure you want to delete <b>1 role</b>?` : $localize`Are you sure you want to delete <b>${roles.size} roles</b>?`,
        icon: "fa fa-trash",
        rejectVisible: true,
        accept: () => {
          this.store.dispatch(RoleActions.deleteMany({ keys: Array.from(roles.keys()) }));
          resolve(true);
        },
        reject: () => resolve(false)
      });
    });
  }
}
