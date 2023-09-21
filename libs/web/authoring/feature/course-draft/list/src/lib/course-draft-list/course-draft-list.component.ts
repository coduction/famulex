import { CommonModule, DatePipe }                                                                                        from "@angular/common";
import { Component, Input, OnInit }                                                                                      from "@angular/core";
import { Router }                                                                                                        from "@angular/router";
import { ConfirmationService }                                                                                           from "@coduction/primeng/api";
import { CardModule }                                                                                                    from "@coduction/primeng/card";
import { DialogService }                                                                                                 from "@coduction/primeng/dynamicdialog";
import { CourseDraft, Right }                                                                                            from "@famulex/shared/famulex-api-client";
import { CourseDraftListActions, CourseDraftListState, CourseDraftTab }                                                  from "@famulex/web/authoring/data-access/course-draft-list-state";
import { CourseDraftEditComponent }                                                                                      from "@famulex/web/authoring/feature/course-draft/edit";
import { CONFIRM_DIALOG_NON_CLOSEABLE }                                                                                  from "@famulex/web/shared/layout";
import { ColumnAction, EntryAction, LoadDataEvent, SelectionAction, TableAction, TableColumn, TableComponent, TableTab } from "@famulex/web/shared/table";
import { Store }                                                                                                         from "@ngrx/store";
import { KeycloakService }                                                                                               from "keycloak-angular";

@Component({
  selector: "authoring-course-draft-list",
  standalone: true,
  imports: [CommonModule, CardModule, TableComponent],
  providers: [DatePipe],
  templateUrl: "./course-draft-list.component.html",
  styleUrls: ["./course-draft-list.component.scss"]
})
export class CourseDraftListComponent implements OnInit {

  allCoursesTab: TableTab = {
    key: CourseDraftTab.ALL_COURSES,
    label: $localize`All Courses`,
    icon: "fa fa-fw fa-books",
    command: () => this.onActivateTab(CourseDraftTab.ALL_COURSES)
  };

  tabs: TableTab[] = [
    {
      key: CourseDraftTab.MY_FAVOURITES,
      label: $localize`My Favourites`,
      icon: "fa fa-fw fa-bookmark",
      command: () => this.onActivateTab(CourseDraftTab.MY_FAVOURITES)
    },
    {
      key: CourseDraftTab.MY_COURSES,
      label: $localize`My Courses`,
      icon: "fa fa-fw fa-book-user",
      command: () => this.onActivateTab(CourseDraftTab.MY_COURSES)
    },
    this.allCoursesTab
  ];

  columns: TableColumn<CourseDraft>[] = [
    new TableColumn({
      key: "key",
      name: $localize`Key`,
      field: courseDraft => courseDraft.key,
      visibleByDefault: false
    }),
    new TableColumn({
      key: "title",
      name: $localize`Title`,
      field: courseDraft => courseDraft.title
    }),
    new TableColumn({
      key: "description",
      name: $localize`Description`,
      field: courseDraft => courseDraft.description
    }),
    new TableColumn({
      key: "createdAt",
      name: $localize`Created At`,
      field: courseDraft => this.datePipe.transform(courseDraft.createdAt, "short"),
      visibleByDefault: false
    }),
    new TableColumn({
      key: "updatedAt",
      name: $localize`Updated At`,
      field: courseDraft => this.datePipe.transform(courseDraft.updatedAt, "short"),
      visibleByDefault: false
    })
  ];

  tableActions: TableAction[] = [
    {
      label: $localize`Create Course`,
      icon: "fa fa-invert fa-user-plus",
      onClick: () => this.onCreate(),
      primary: true
    }
  ];

  columnActions: ColumnAction<CourseDraft>[] = [
    {
      label: $localize`Open Course`,
      icon: "fa fa-fw fa-hand-pointer",
      onClick: entry => this.onOpen(entry)
    }
  ];

  entryActions: EntryAction<CourseDraft>[] = [
    {
      label: $localize`Edit Course`,
      icon: "fa fa-fw fa-user-edit",
      onClick: entry => this.onEdit(entry)
    },
    {
      label: $localize`Delete Course`,
      icon: "fa fa-fw fa-trash",
      onClick: entry => this.onDelete(entry)
    }
  ];

  selectionActions: SelectionAction<string, CourseDraft>[] = [
    {
      label: (amount) => {
        if (amount === 1) {
          return $localize`Delete ${amount} Course`;
        }

        return $localize`Delete ${amount} Courses`;
      },
      icon: "fa fa-trash",
      resetSelection: true,
      onClick: entries => this.onDeleteMany(entries)
    }
  ];

  courseDrafts$ = this.store.select(CourseDraftListState.selectAll);
  tableMetaData$ = this.store.select(CourseDraftListState.selectTableMetaData);
  loading$ = this.store.select(CourseDraftListState.selectLoading);

  @Input() myCoursesOnly = false;

  constructor(private store: Store,
              private router: Router,
              private datePipe: DatePipe,
              private keycloakService: KeycloakService,
              private confirmationService: ConfirmationService,
              private dialogService: DialogService) {
  }

  ngOnInit(): void {
    if (!this.keycloakService.isUserInRole(Right.ManageCourses)) {
      this.allCoursesTab.visible = false;
      this.allCoursesTab.disabled = true;

      this.store.dispatch(CourseDraftListActions.setTab({ key: CourseDraftTab.MY_COURSES }));
    }
  }

  onLoadData(event: LoadDataEvent) {
    this.store.dispatch(CourseDraftListActions.load({ event }));
  }

  onActivateTab(key: CourseDraftTab) {
    this.store.dispatch(CourseDraftListActions.activateTab({ key }));
  }

  onOpen(entry: CourseDraft) {
    void this.router.navigate(["authoring", "courses", entry.key]);
  }

  onCreate() {
    // this.store.dispatch(WizardActions.open({
    //   id: USER_EDIT_WIZARD_ID,
    //   component: UserEditComponent
    // }));

    this.dialogService.open(CourseDraftEditComponent, {
      header: $localize`Create Course`,
      width: "60rem"
    });
  }

  onEdit(entry: CourseDraft) {
    this.dialogService.open(CourseDraftEditComponent, {
      header: $localize`Edit Course`,
      width: "60rem",
      data: entry
    });
  }

  onDelete(entry: CourseDraft) {
    this.confirmationService.confirm({
      key: CONFIRM_DIALOG_NON_CLOSEABLE,
      header: $localize`Delete Course`,
      message: $localize`Are you sure you want to delete the course <b>${entry.title}</b>?`,
      icon: "fa fa-trash",
      rejectVisible: true,
      accept: () => this.store.dispatch(CourseDraftListActions.delete({ entry }))
    });
  }

  onDeleteMany(entries: Map<string, CourseDraft>) {
    return new Promise<boolean>(resolve => {
      this.confirmationService.confirm({
        key: CONFIRM_DIALOG_NON_CLOSEABLE,
        header: $localize`Delete Multiple Courses`,
        message: entries.size === 1 ? $localize`Are you sure you want to delete <b>1 course</b>?` : $localize`Are you sure you want to delete <b>${entries.size} courses</b>?`,
        icon: "fa fa-trash",
        rejectVisible: true,
        accept: () => {
          this.store.dispatch(CourseDraftListActions.deleteMany({ keys: Array.from(entries.keys()) }));
          resolve(true);
        },
        reject: () => resolve(false)
      });
    });
  }

}
