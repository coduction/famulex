import { CommonModule, DatePipe }                                                                from "@angular/common";
import { Component, OnInit }                                                                     from "@angular/core";
import { ConfirmationService }                                                                   from "@coduction/primeng/api";
import { ButtonModule }                                                                          from "@coduction/primeng/button";
import { CardModule }                                                                            from "@coduction/primeng/card";
import { DialogService }                                                                         from "@coduction/primeng/dynamicdialog";
import { Role }                                                                                  from "@famulex/shared/famulex-api-client";
import { RoleActions, RoleState }                                                                from "@famulex/web/administration/data-access/role-state";
import { EntryAction, LoadDataEvent, SelectionAction, TableAction, TableColumn, TableComponent } from "@famulex/web/shared/table";
import { Store }                                                                                 from "@ngrx/store";
import { Observable }                                                                            from "rxjs";

@Component({
  selector: "administration-role-list",
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule, TableComponent],
  providers: [DatePipe],
  templateUrl: "./role-list.component.html",
  styleUrls: ["./role-list.component.scss"]
})
export class RoleListComponent implements OnInit {

  roleColumns: TableColumn<Role>[] = [
    new TableColumn("key", $localize`Key`, false, role => role.key),
    new TableColumn("name", $localize`Name`, true, role => role.name),
    new TableColumn("description", $localize`Description`, true, role => role.description),
    new TableColumn("rights", $localize`Rights`, true, role => role.rights),
    new TableColumn("createdAt", $localize`Created At`, false, role => this.datePipe.transform(role.createdAt, "shortDate") ?? ""),
    new TableColumn("updatedAt", $localize`Updated At`, false, role => this.datePipe.transform(role.updatedAt, "shortDate") ?? "")
  ];

  tableActions: TableAction[] = [
    { label: $localize`Create Role`, icon: "fa fa-shield-quartered", onClick: () => this.onCreateRole(), primary: true }
  ];

  entryActions: EntryAction<Role>[] = [
    { label: $localize`Edit Role`, icon: "fa fa-pen-to-square", onClick: role => this.onEditRole(role) },
    { label: $localize`Delete Role`, icon: "fa fa-trash", onClick: role => this.onDeleteRole(role) }
  ];

  selectionActions: SelectionAction<string, Role>[] = [
    {
      label: (amount) => {
        if (amount === 1) {
          return $localize`Delete ${amount} Role`;
        }

        return $localize`Delete ${amount} Roles`;
      }, icon: "fa fa-trash", resetSelection: true, onClick: roles => this.onDeleteRoleBulk(roles)
    }
  ];

  roles$: Observable<Role[]> = this.store.select(RoleState.selectAll);
  totalRoles$ = this.store.select(RoleState.selectTotal);
  pageSize$ = this.store.select(RoleState.selectPageSize);
  loading$ = this.store.select(RoleState.selectLoading);

  constructor(private store: Store,
              private datePipe: DatePipe,
              private dialogService: DialogService,
              private confirmationService: ConfirmationService) {
  }

  ngOnInit() {
    this.store.dispatch(RoleActions.load({}));
  }

  onLoadData(event: LoadDataEvent) {
    this.store.dispatch(RoleActions.load({ event }));
  }

  onCreateRole() {
    console.log("Create Role");
  }

  onEditRole(role: Role) {
    console.log(role);
  }

  onDeleteRole(role: Role) {
    console.log(role);
  }

  onDeleteRoleBulk(roles: Map<string, Role>) {
    console.log(roles);
  }
}
