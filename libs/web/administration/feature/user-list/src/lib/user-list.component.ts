import { CommonModule, DatePipe }                                                                               from "@angular/common";
import { Component }                                                                                            from "@angular/core";
import { ConfirmationService }                                                                                  from "@coduction/primeng/api";
import { CardModule }                                                                                           from "@coduction/primeng/card";
import { DialogService }                                                                                        from "@coduction/primeng/dynamicdialog";
import { User }                                                                                                 from "@famulex/shared/famulex-api-client";
import { USER_EDIT_WIZARD_ID, UserActions, UserState }                                                          from "@famulex/web/administration/data-access/user-state";
import { UserEditComponent }                                                                                    from "@famulex/web/administration/feature/user-edit";
import { CONFIRM_DIALOG_NON_CLOSEABLE }                                                                         from "@famulex/web/shared/layout";
import { EntryAction, LoadDataEvent, SelectionAction, TableAction, TableColumn, TableComponent, TableMetaData } from "@famulex/web/shared/table";
import { WizardActions }                                                                                        from "@famulex/web/shared/wizard";
import { Store }                                                                                                from "@ngrx/store";
import { Observable }                                                                                           from "rxjs";

@Component({
  selector: "administration-user-list",
  standalone: true,
  imports: [CommonModule, TableComponent, CardModule],
  providers: [DatePipe],
  templateUrl: "./user-list.component.html",
  styleUrls: ["./user-list.component.scss"]
})
export class UserListComponent {

  userColumns: TableColumn<User>[] = [
    new TableColumn({ key: "key", name: $localize`Key`, field: user => user.key, visibleByDefault: false }),
    new TableColumn({ key: "firstName", name: $localize`First Name`, field: user => user.firstName }),
    new TableColumn({ key: "lastName", name: $localize`Last Name`, field: user => user.lastName }),
    new TableColumn({ key: "username", name: $localize`Username`, field: user => user.username }),
    new TableColumn({ key: "email", name: $localize`E-Mail`, field: user => user.email }),
    new TableColumn({ key: "lastActiveAt", name: $localize`Last Active At`, field: user => this.datePipe.transform(user.lastActiveAt, "short"), visibleByDefault: false }),
    new TableColumn({ key: "createdAt", name: $localize`Created At`, field: user => this.datePipe.transform(user.createdAt, "short"), visibleByDefault: false }),
    new TableColumn({ key: "updatedAt", name: $localize`Updated At`, field: user => this.datePipe.transform(user.updatedAt, "short"), visibleByDefault: false })
  ];

  tableActions: TableAction[] = [
    { label: $localize`Create User`, icon: "fa fa-invert fa-user-plus", onClick: () => this.onUserCreate(), primary: true }
  ];

  entryActions: EntryAction<User>[] = [
    { label: $localize`Edit User`, icon: "fa fa-fw fa-user-edit", onClick: user => this.onUserEdit(user) },
    { label: $localize`Delete User`, icon: "fa fa-fw fa-trash", onClick: user => this.onUserDelete(user) }
  ];

  selectionActions: SelectionAction<string, User>[] = [
    {
      label: (amount) => {
        if (amount === 1) {
          return $localize`Delete ${amount} User`;
        }

        return $localize`Delete ${amount} Users`;
      }, icon: "fa fa-trash", resetSelection: true, onClick: users => this.onUserDeleteBulk(users)
    }
  ];

  users$: Observable<User[]> = this.store.select(UserState.selectAll);
  tableMetaData$: Observable<TableMetaData> = this.store.select(UserState.selectTableMetaData);
  loading$: Observable<boolean> = this.store.select(UserState.selectLoading);

  constructor(private store: Store,
              private datePipe: DatePipe,
              private confirmationService: ConfirmationService,
              private dialogService: DialogService) {
  }

  onLoadData(event: LoadDataEvent) {
    this.store.dispatch(UserActions.load({ event }));
  }

  onUserCreate() {
    this.store.dispatch(WizardActions.open({
      id: USER_EDIT_WIZARD_ID,
      component: UserEditComponent
    }));
  }

  onUserEdit(user: User) {
    this.store.dispatch(WizardActions.open({
      id: USER_EDIT_WIZARD_ID,
      component: UserEditComponent,
      config: {
        data: user
      }
    }));
  }

  onUserDelete(user: User) {
    this.confirmationService.confirm({
      key: CONFIRM_DIALOG_NON_CLOSEABLE,
      header: $localize`Delete User`,
      message: $localize`Are you sure you want to delete <b>${user.firstName} ${user.lastName}</b>?`,
      icon: "fa fa-trash",
      rejectVisible: true,
      accept: () => this.store.dispatch(UserActions.delete({ user }))
    });
  }

  onUserDeleteBulk(users: Map<string, User>) {
    return new Promise<boolean>(resolve => {
      this.confirmationService.confirm({
        key: CONFIRM_DIALOG_NON_CLOSEABLE,
        header: $localize`Delete Multiple Users`,
        message: users.size === 1 ? $localize`Are you sure you want to delete <b>1 user</b>?` : $localize`Are you sure you want to delete <b>${users.size} users</b>?`,
        icon: "fa fa-trash",
        rejectVisible: true,
        accept: () => {
          this.store.dispatch(UserActions.deleteMany({ keys: Array.from(users.keys()) }));
          resolve(true);
        },
        reject: () => resolve(false)
      });
    });
  }
}
