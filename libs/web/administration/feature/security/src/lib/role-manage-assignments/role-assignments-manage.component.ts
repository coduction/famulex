import { CommonModule }                                                            from "@angular/common";
import { Component, OnInit }                                                       from "@angular/core";
import { ConfirmationService }                                                     from "primeng/api";
import { DialogService, DynamicDialogConfig }                                      from "primeng/dynamicdialog";
import { MembershipType, Role, RoleAssignment, User }                              from "@famulex/shared/famulex-api-client";
import { CONFIRM_DIALOG_NON_CLOSEABLE }                                            from "@famulex/web/shared/layout";
import { ColumnAction, SelectionAction, TableAction, TableColumn, TableComponent } from "@famulex/web/shared/table";
import { UserSearchComponent, UserSearchConfig }                                   from "@famulex/web/shared/user-search";
import { RoleAssignmentsManageStore }                                              from "./+state/role-assignments-manage-store.service";

export interface RoleAssignmentsManageConfig {
  role: Role;
  type: MembershipType;
}

@Component({
  selector: "security-role-assignments-manage",
  standalone: true,
  imports: [CommonModule, TableComponent],
  templateUrl: "./role-assignments-manage.component.html",
  styleUrls: ["./role-assignments-manage.component.scss"],
  providers: [RoleAssignmentsManageStore]
})
export class RoleAssignmentsManageComponent implements OnInit {

  manageUsersColumns: TableColumn<RoleAssignment>[] = [
    new TableColumn({ key: "key", name: $localize`Key`, field: assignment => assignment.key, visibleByDefault: false }),
    new TableColumn({ key: "firstName", name: $localize`First Name`, field: assignment => assignment.user?.firstName }),
    new TableColumn({ key: "lastName", name: $localize`Last Name`, field: assignment => assignment.user?.lastName }),
    new TableColumn({ key: "username", name: $localize`Username`, field: assignment => assignment.user?.username, visibleByDefault: false }),
    new TableColumn({ key: "email", name: $localize`E-Mail`, field: assignment => assignment.user?.email, visibleByDefault: false })
  ];

  tableActions: TableAction[] = [
    {
      label: $localize`Add Users`, icon: "fa fa-swap-opacity fa-user-plus", primary: true, onClick: () => this._onOpenUserSelection()
    }
  ];

  selectionActions: SelectionAction<string, RoleAssignment>[] = [
    {
      label: (amount) => {
        if (amount === 1) {
          return $localize`Remove ${amount} User`;
        }

        return $localize`Remove ${amount} Users`;
      },
      icon: "fa fa-trash", resetSelection: true,
      onClick: users => this._onRemoveAssignments(Array.from(users.keys()))
    }
  ];

  columnActions: ColumnAction<RoleAssignment>[] = [
    {
      label: $localize`Remove`,
      onClick: user => this._onRemoveAssignment(user)
    }
  ];

  constructor(public config: DynamicDialogConfig<RoleAssignmentsManageConfig>,
              protected store: RoleAssignmentsManageStore,
              private confirmationService: ConfirmationService,
              private dialogService: DialogService) {
  }

  ngOnInit(): void {
    if (this.config.data) {
      this.store.setRoleAndType({ ...this.config.data });
      this.store.loadAssignments();
    }
  }

  private _onOpenUserSelection() {
    this.dialogService.open(UserSearchComponent, {
      data: {
        onSingleSelect: (user: User) => this._onAddUser(user),
        onMultiSelect: (userKeys: string[]) => this._onAddUsers(userKeys)
      } as UserSearchConfig,
      header: $localize`Add Users - ${this.config.data?.role.name}`
    });
  }

  private _onAddUser(user: User) {
    this.store.addUser(user);
  }

  private _onAddUsers(userKeys: string[]) {
    this.store.addUsers(userKeys);
  }

  private _onRemoveAssignment(assignment: RoleAssignment) {
    if (assignment.type === MembershipType.User) {
      this.confirmationService.confirm({
        key: CONFIRM_DIALOG_NON_CLOSEABLE,
        header: $localize`Remove User from Role`,
        message: $localize`Are you sure you want to remove <b>${assignment.user?.firstName} ${assignment.user?.lastName}</b> from role <b>${this.config.data?.role.name}</b>?`,
        icon: "fa fa-trash",
        rejectVisible: true,
        accept: () => this.store.removeAssignment(assignment)
      });
    } else if (assignment.type === MembershipType.Group) {
      this.confirmationService.confirm({
        key: CONFIRM_DIALOG_NON_CLOSEABLE,
        header: $localize`Remove Group from Role`,
        message: $localize`Are you sure you want to remove <b>${assignment.group?.name}</b> from role <b>${this.config.data?.role.name}</b>?`,
        icon: "fa fa-trash",
        rejectVisible: true,
        accept: () => this.store.removeAssignment(assignment)
      });
    }
  }

  private _onRemoveAssignments(keys: string[]) {
    return new Promise<boolean>(resolve => {
      this.confirmationService.confirm({
        key: CONFIRM_DIALOG_NON_CLOSEABLE,
        header: $localize`Delete Multiple Assignments`,
        message: keys.length === 1 ? $localize`Are you sure you want to remove <b>1 assignment</b>?` : $localize`Are you sure you want to remove <b>${keys.length} assignments</b>?`,
        icon: "fa fa-trash",
        rejectVisible: true,
        accept: () => {
          this.store.removeAssignments(keys);
          resolve(true);
        },
        reject: () => resolve(false)
      });
    });
  }
}
