import { CommonModule, DatePipe }                                                                from "@angular/common";
import { Component, OnInit }                                                                     from "@angular/core";
import { ConfirmationService }                                                                   from "@coduction/primeng/api";
import { CardModule }                                                                            from "@coduction/primeng/card";
import { DialogService }                                                                         from "@coduction/primeng/dynamicdialog";
import { User }                                                                                  from "@famulex/shared/famulex-api-client";
import { UserActions, UserState }                                                                from "@famulex/web/administration/data-access/user-state";
import { UserEditComponent }                                                                     from "@famulex/web/administration/feature/user-edit";
import { CONFIRM_DIALOG_NON_CLOSEABLE }                                                          from "@famulex/web/shared/layout";
import { EntryAction, LoadDataEvent, SelectionAction, TableAction, TableColumn, TableComponent } from "@famulex/web/shared/table";
import { Store }                                                                                 from "@ngrx/store";
import { Observable }                                                                            from "rxjs";

@Component({
  selector: "administration-user-list",
  standalone: true,
  imports: [CommonModule, TableComponent, CardModule],
  providers: [DatePipe],
  templateUrl: "./user-list.component.html",
  styleUrls: ["./user-list.component.scss"]
})
export class UserListComponent implements OnInit {

  userColumns: TableColumn<User>[] = [
    new TableColumn("key", $localize`Key`, false, user => user.key),
    new TableColumn("username", $localize`Username`, true, user => user.username),
    new TableColumn("firstName", $localize`First Name`, true, user => user.firstName),
    new TableColumn("lastName", $localize`Last Name`, true, user => user.lastName),
    new TableColumn("email", $localize`E-Mail`, true, user => user.email),
    new TableColumn("lastActiveAt", $localize`Last Active At`, false, user => this.datePipe.transform(user.lastActiveAt, "short") ?? ""),
    new TableColumn("createdAt", $localize`Created At`, false, user => this.datePipe.transform(user.createdAt, "shortDate") ?? ""),
    new TableColumn("updatedAt", $localize`Updated At`, false, user => this.datePipe.transform(user.updatedAt, "shortDate") ?? "")
  ];

  tableActions: TableAction[] = [
    { label: $localize`Create User`, icon: "fa fa-invert fa-user-plus", onClick: () => this.onUserCreate(), primary: true }
  ];

  entryActions: EntryAction<User>[] = [
    { label: $localize`Edit User`, icon: "fa fa-user-edit", onClick: user => this.onUserEdit(user) },
    { label: $localize`Delete User`, icon: "fa fa-trash", onClick: user => this.onUserDelete(user) }
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
  totalUsers$ = this.store.select(UserState.selectTotal);
  pageSize$ = this.store.select(UserState.selectPageSize);
  loading$ = this.store.select(UserState.selectLoading);

  constructor(private store: Store,
              private datePipe: DatePipe,
              private dialogService: DialogService,
              private confirmationService: ConfirmationService) {
  }

  ngOnInit() {
    this.store.dispatch(UserActions.load({}));
  }

  onLoadData(event: LoadDataEvent) {
    this.store.dispatch(UserActions.load({ event }));
  }

  onUserCreate() {
    this.dialogService.open(UserEditComponent, {
      header: $localize`Create User`,
      width: "55rem",
      maximizable: true,
      closable: false
    });
  }

  onUserEdit(user: User) {
    this.dialogService.open(UserEditComponent, {
      header: $localize`Edit User`,
      data: user,
      width: "55rem",
      maximizable: true,
      closable: false
    });
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
        message: $localize`Are you sure you want to delete <b>${users.size} users</b>?`,
        icon: "fa fa-trash",
        rejectVisible: true,
        accept: () => {
          this.store.dispatch(UserActions.deleteMany({ keys: Array.from(users.keys()) }));
          resolve(true);
        }
      });
    });
  }
}
