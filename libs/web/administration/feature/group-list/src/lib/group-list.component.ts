import { CommonModule, DatePipe }                                                                               from "@angular/common";
import { Component }                                                                                            from "@angular/core";
import { ConfirmationService }                                                                                  from "@coduction/primeng/api";
import { CardModule }                                                                                           from "@coduction/primeng/card";
import { DialogService }                                                                                        from "@coduction/primeng/dynamicdialog";
import { Group }                                                                                                from "@famulex/shared/famulex-api-client";
import { GroupActions, GroupState }                                                                             from "@famulex/web/administration/data-access/group-state";
import { CONFIRM_DIALOG_NON_CLOSEABLE }                                                                         from "@famulex/web/shared/layout";
import { EntryAction, LoadDataEvent, SelectionAction, TableAction, TableColumn, TableComponent, TableMetaData } from "@famulex/web/shared/table";
import { Store }                                                                                                from "@ngrx/store";
import { Observable }                                                                                           from "rxjs";

@Component({
  selector: "administration-group-list",
  standalone: true,
  imports: [CommonModule, CardModule, TableComponent],
  templateUrl: "./group-list.component.html",
  styleUrls: ["./group-list.component.scss"],
  providers: [DatePipe]
})
export class GroupListComponent {

  groupColumns: TableColumn<Group>[] = [
    new TableColumn({ key: "key", name: $localize`Key`, field: group => group.key, visibleByDefault: false }),
    new TableColumn({ key: "name", name: $localize`Name`, field: group => group.name }),
    new TableColumn({ key: "description", name: $localize`Description`, field: group => group.description }),
    new TableColumn({ key: "type", name: $localize`Type`, field: group => group.type }),
    new TableColumn({ key: "createdAt", name: $localize`Created At`, field: group => this.datePipe.transform(group.createdAt, "short"), visibleByDefault: false }),
    new TableColumn({ key: "updatedAt", name: $localize`Updated At`, field: group => this.datePipe.transform(group.updatedAt, "short"), visibleByDefault: false })
  ];

  tableActions: TableAction[] = [
    { label: $localize`Create Group`, icon: "fa fa-invert fa-users-medical", onClick: () => this.onGroupCreate(), primary: true }
  ];

  entryActions: EntryAction<Group>[] = [
    { label: $localize`Edit Group`, icon: "fa fa-pencil", onClick: group => this.onGroupEdit(group) },
    { label: $localize`Delete Group`, icon: "fa fa-trash", onClick: group => this.onGroupDelete(group) }
  ];

  selectionActions: SelectionAction<string, Group>[] = [
    {
      label: (amount) => {
        if (amount === 1) {
          return $localize`Delete 1 Group`;
        }

        return $localize`Delete ${amount} Groups`;
      }, icon: "fa fa-trash", resetSelection: true, onClick: groups => this.onGroupDeleteMany(groups)
    }
  ];

  groups$: Observable<Group[]> = this.store.select(GroupState.selectAll);
  tableMetaData$: Observable<TableMetaData> = this.store.select(GroupState.selectTableMetaData);
  loading$: Observable<boolean> = this.store.select(GroupState.selectLoading);

  constructor(private store: Store,
              private datePipe: DatePipe,
              private confirmationService: ConfirmationService,
              private dialogService: DialogService) {
  }

  onLoadData(event: LoadDataEvent) {
    this.store.dispatch(GroupActions.load({ event }));
  }

  onGroupCreate() {
    // this.store.dispatch(WizardActions.open({
    //   id: USER_EDIT_WIZARD_ID,
    //   component: UserEditComponent
    // }));
  }

  onGroupEdit(group: Group) {
    // this.store.dispatch(WizardActions.open({
    //   id: USER_EDIT_WIZARD_ID,
    //   component: GroupEditComponent,
    //   config: {
    //     data: group
    //   }
    // }));
  }

  onGroupDelete(group: Group) {
    this.confirmationService.confirm({
      key: CONFIRM_DIALOG_NON_CLOSEABLE,
      header: $localize`Delete Group`,
      message: $localize`Are you sure you want to delete <b>${group.name}</b>?`,
      icon: "fa fa-trash",
      rejectVisible: true,
      accept: () => this.store.dispatch(GroupActions.delete({ group }))
    });
  }

  onGroupDeleteMany(groups: Map<string, Group>) {
    return new Promise<boolean>(resolve => {
      this.confirmationService.confirm({
        key: CONFIRM_DIALOG_NON_CLOSEABLE,
        header: $localize`Delete Multiple Groups`,
        message: groups.size === 1 ? $localize`Are you sure you want to delete <b>1 group</b>?` : $localize`Are you sure you want to delete <b>${groups.size} groups</b>?`,
        icon: "fa fa-trash",
        rejectVisible: true,
        accept: () => {
          this.store.dispatch(GroupActions.deleteMany({ keys: Array.from(groups.keys()) }));
          resolve(true);
        },
        reject: () => resolve(false)
      });
    });
  }
}
