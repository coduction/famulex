import { CommonModule, DatePipe }                                                             from "@angular/common";
import { Component, OnInit }                                                                  from "@angular/core";
import { CardModule }                                                                         from "@coduction/primeng/card";
import { User }                                                                               from "@famulex/shared/famulex-api-client";
import { UserActions, UserState }                                                             from "@famulex/web/administration/data-access/user-state";
import { EntryAction, Pagination, SelectionAction, TableAction, TableColumn, TableComponent } from "@famulex/web/shared/table";
import { Store }                                                                              from "@ngrx/store";
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
    { label: $localize`Create User`, icon: "fa fa-invert fa-user-plus", onClick: () => console.log("Create User"), primary: true }
  ];

  entryActions: EntryAction<User>[] = [
    { label: $localize`Edit User`, icon: "fa fa-edit", onClick: user => console.log("Edit", user) },
    { label: $localize`Delete User`, icon: "fa fa-trash", onClick: user => console.log("Delete", user) }
  ];

  selectionActions: SelectionAction<User>[] = [
    { label: $localize`Delete Users`, icon: "fa fa-trash", onClick: users => console.log("Delete", users) }
  ];

  users$: Observable<User[]> = this.store.select(UserState.selectAll);
  totalUsers$ = this.store.select(UserState.selectTotal);
  pageSize$ = this.store.select(UserState.selectPageSize);
  loading$ = this.store.select(UserState.selectLoading);

  constructor(private store: Store,
              private datePipe: DatePipe) {
  }

  ngOnInit() {
    this.store.dispatch(UserActions.loadUsers());
  }

  onPagination(event: Pagination) {
    this.store.dispatch(UserActions.setPagination(event));
  }

  protected readonly console = console;
}
