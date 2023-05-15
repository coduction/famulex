import { CommonModule, DatePipe }                                                             from "@angular/common";
import { Component, OnInit }                                                                  from "@angular/core";
import { takeUntilDestroyed }                                                                 from "@angular/core/rxjs-interop";
import { ConfirmationService }                                                                from "@coduction/primeng/api";
import { CardModule }                                                                         from "@coduction/primeng/card";
import { DialogService, DynamicDialogRef }                                                    from "@coduction/primeng/dynamicdialog";
import { User }                                                                               from "@famulex/shared/famulex-api-client";
import { UserActions, UserState }                                                             from "@famulex/web/administration/data-access/user-state";
import { UserCreateComponent }                                                                from "@famulex/web/administration/feature/user-create";
import { CONFIRM_DIALOG_NON_CLOSEABLE }                                                       from "@famulex/web/shared/layout";
import { EntryAction, Pagination, SelectionAction, TableAction, TableColumn, TableComponent } from "@famulex/web/shared/table";
import { ofType }                                                                             from "@ngrx/effects";
import { ActionsSubject, Store }                                                              from "@ngrx/store";
import { Observable }                                                                         from "rxjs";

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
    { label: $localize`Create User`, icon: "fa fa-invert fa-user-plus", onClick: () => this.openUserCreationDialog(), primary: true }
  ];

  entryActions: EntryAction<User>[] = [
    { label: $localize`Edit User`, icon: "fa fa-edit", onClick: user => console.log("Edit", user) },
    { label: $localize`Delete User`, icon: "fa fa-trash", onClick: user => this.confirmUserDeletion(user) }
  ];

  selectionActions: SelectionAction<User>[] = [
    { label: $localize`Delete Users`, icon: "fa fa-trash", onClick: users => this.confirmBulkUserDeletion(users) }
  ];

  users$: Observable<User[]> = this.store.select(UserState.selectAll);
  totalUsers$ = this.store.select(UserState.selectTotal);
  pageSize$ = this.store.select(UserState.selectPageSize);
  loading$ = this.store.select(UserState.selectLoading);

  dialogRef?: DynamicDialogRef;

  constructor(private store: Store,
              private actions$: ActionsSubject,
              private datePipe: DatePipe,
              private dialogService: DialogService,
              private confirmationService: ConfirmationService) {
    this.actions$.pipe(
      takeUntilDestroyed(),
      ofType(UserActions.createUserSuccess, UserActions.createUserCancel)
    ).subscribe(() => {
      this.closeUserCreationDialog();
    });

  }

  ngOnInit() {
    this.store.dispatch(UserActions.loadUsers());
  }

  onPagination(event: Pagination) {
    this.store.dispatch(UserActions.setPagination(event));
  }

  openUserCreationDialog() {
    this.dialogRef = this.dialogService.open(UserCreateComponent, {
      header: $localize`Create User`,
      width: "55rem",
      maximizable: true,
      closable: false
    });
  }

  closeUserCreationDialog() {
    this.dialogRef?.close();
  }

  confirmUserDeletion(user: User) {
    this.confirmationService.confirm({
      key: CONFIRM_DIALOG_NON_CLOSEABLE,
      header: $localize`Delete User`,
      message: $localize`Are you sure you want to delete <b>${user.firstName} ${user.lastName}</b>?`,
      icon: "fa fa-user-xmark",
      rejectVisible: true,
      accept: () => this.store.dispatch(UserActions.deleteUser({ user }))
    });
  }

  confirmBulkUserDeletion(users: User[]) {
    this.confirmationService.confirm({
      key: CONFIRM_DIALOG_NON_CLOSEABLE,
      header: $localize`Delete Multiple Users`,
      message: $localize`Are you sure you want to delete <b>${users.length} users</b>?`,
      icon: "fa fa-user-xmark",
      rejectVisible: true,
      accept: () => users.forEach(user => this.store.dispatch(UserActions.deleteUser({ user })))
    });
  }
}
