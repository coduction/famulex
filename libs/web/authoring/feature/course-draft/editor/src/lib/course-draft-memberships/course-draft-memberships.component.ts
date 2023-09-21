import { CommonModule, DatePipe }                                                                from "@angular/common";
import { Component }                                                                             from "@angular/core";
import { ConfirmationService }                                                                   from "@coduction/primeng/api";
import { CardModule }                                                                            from "@coduction/primeng/card";
import { DialogService }                                                                         from "@coduction/primeng/dynamicdialog";
import { CourseMembership }                                                                      from "@famulex/shared/famulex-api-client";
import { translateCourseRole }                                                                   from "@famulex/shared/util";
import { CourseMembershipsActions, CourseMembershipsState }                                      from "@famulex/web/authoring/data-access/course-memberships-state";
import { CourseMembershipEditComponent }                                                         from "@famulex/web/authoring/feature/course-draft/editor";
import { EntryAction, LoadDataEvent, SelectionAction, TableAction, TableColumn, TableComponent } from "@famulex/web/shared/table";
import { Store }                                                                                 from "@ngrx/store";

@Component({
  selector: "authoring-course-draft-memberships",
  standalone: true,
  imports: [CommonModule, CardModule, TableComponent],
  providers: [DatePipe],
  templateUrl: "./course-draft-memberships.component.html",
  styleUrls: ["./course-draft-memberships.component.scss"]
})
export class CourseDraftMembershipsComponent {

  courseMembershipColumns: TableColumn<CourseMembership>[] = [
    new TableColumn({ key: "key", name: $localize`Key`, field: membership => membership.key, visibleByDefault: false }),
    new TableColumn({ key: "role", name: $localize`Role`, field: membership => translateCourseRole(membership.role) }),
    new TableColumn({ key: "firstName", name: $localize`First Name`, field: membership => membership.user?.firstName }),
    new TableColumn({ key: "lastName", name: $localize`Last Name`, field: membership => membership.user?.lastName }),
    new TableColumn({ key: "username", name: $localize`Username`, field: membership => membership.user?.username, visibleByDefault: false }),
    new TableColumn({ key: "email", name: $localize`E-Mail`, field: membership => membership.user?.email, visibleByDefault: false }),
    new TableColumn({ key: "createdAt", name: $localize`Created At`, field: membership => this.datePipe.transform(membership.createdAt, "short"), visibleByDefault: false }),
    new TableColumn({ key: "updatedAt", name: $localize`Updated At`, field: membership => this.datePipe.transform(membership.updatedAt, "short"), visibleByDefault: false })
  ];

  tableActions: TableAction[] = [
    { label: $localize`Add Users`, icon: "fa fa-invert fa-user-plus", onClick: () => this.onUserAdd(), primary: true }
  ];

  entryActions: EntryAction<CourseMembership>[] = [
    { label: $localize`Edit Membership`, icon: "fa fa-fw fa-user-edit", onClick: membership => this.onMembershipEdit(membership) },
    { label: $localize`Remove Membership`, icon: "fa fa-fw fa-trash", onClick: membership => this.onMembershipRemove(membership) }
  ];

  selectionActions: SelectionAction<string, CourseMembership>[] = [
    {
      label: (amount) => {
        if (amount === 1) {
          return $localize`Remove ${amount} Membership`;
        }

        return $localize`Delete ${amount} Memberships`;
      }, icon: "fa fa-trash", resetSelection: true, onClick: memberships => this.onMembershipBulkRemove(memberships)
    }
  ];

  memberships$ = this.store.select(CourseMembershipsState.selectAll);
  tableMetaData$ = this.store.select(CourseMembershipsState.selectTableMetaData);
  loading$ = this.store.select(CourseMembershipsState.selectLoading);

  constructor(private store: Store,
              private datePipe: DatePipe,
              private confirmationService: ConfirmationService,
              private dialogService: DialogService) {
  }

  onLoadData(event: LoadDataEvent) {
    this.store.dispatch(CourseMembershipsActions.load({ event }));
  }

  onUserAdd() {
    this.dialogService.open(CourseMembershipEditComponent, {
      header: $localize`Add Users`
    });
  }

  onMembershipEdit(membership: CourseMembership) {

  }

  onMembershipRemove(membership: CourseMembership) {

  }

  onMembershipBulkRemove(memberships: Map<string, CourseMembership>) {

  }

}
