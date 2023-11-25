import { CommonModule, DatePipe }                                                                                        from "@angular/common";
import { Component, OnInit }                                                                                             from "@angular/core";
import { Router }                                                                                                        from "@angular/router";
import { ConfirmationService }                                                                                           from "primeng/api";
import { CardModule }                                                                                                    from "primeng/card";
import { DialogService }                                                                                                 from "primeng/dynamicdialog";
import { Right, TestDraft }                                                                                              from "@famulex/shared/famulex-api-client";
import { TestDraftActions, TestDraftsState, TestDraftTab }                                                               from "@famulex/web/authoring/data-access/test-draft-editor-state";
import { CONFIRM_DIALOG_NON_CLOSEABLE }                                                                                  from "@famulex/web/shared/layout";
import { ColumnAction, EntryAction, LoadDataEvent, SelectionAction, TableAction, TableColumn, TableComponent, TableTab } from "@famulex/web/shared/table";
import { Store }                                                                                                         from "@ngrx/store";
import { KeycloakService }                                                                                               from "keycloak-angular";
import { TestDraftEditComponent }                                                                                        from "../test-draft-edit/test-draft-edit.component";
import { TestDraftEditorComponent }                                                                                      from "../test-draft-editor/test-draft-editor.component";

@Component({
  selector: "authoring-test-draft-list",
  standalone: true,
  imports: [CommonModule, CardModule, TableComponent],
  providers: [DatePipe],
  templateUrl: "./test-draft-list.component.html",
  styleUrls: ["./test-draft-list.component.scss"]
})
export class TestDraftListComponent implements OnInit {

  allTestsTab: TableTab = {
    key: TestDraftTab.ALL,
    label: $localize`All Tests`,
    icon: "fa fa-fw fa-books",
    command: () => this.onActivateTab(TestDraftTab.ALL)
  };

  tabs: TableTab[] = [
    {
      key: TestDraftTab.FAVOURITES,
      label: $localize`My Favourites`,
      icon: "fa fa-fw fa-bookmark",
      command: () => this.onActivateTab(TestDraftTab.FAVOURITES)
    },
    {
      key: TestDraftTab.MY,
      label: $localize`My Tests`,
      icon: "fa fa-fw fa-book-user",
      command: () => this.onActivateTab(TestDraftTab.MY)
    },
    this.allTestsTab
  ];

  columns: TableColumn<TestDraft>[] = [
    new TableColumn({
      key: "key",
      name: $localize`Key`,
      field: testDraft => testDraft.key,
      visibleByDefault: false
    }),
    new TableColumn({
      key: "title",
      name: $localize`Title`,
      field: testDraft => testDraft.title
    }),
    new TableColumn({
      key: "description",
      name: $localize`Description`,
      field: testDraft => testDraft.description
    }),
    new TableColumn({
      key: "createdAt",
      name: $localize`Created At`,
      field: testDraft => this.datePipe.transform(testDraft.createdAt, "short"),
      visibleByDefault: false
    }),
    new TableColumn({
      key: "updatedAt",
      name: $localize`Updated At`,
      field: testDraft => this.datePipe.transform(testDraft.updatedAt, "short"),
      visibleByDefault: false
    })
  ];

  tableActions: TableAction[] = [
    {
      label: $localize`Create Test`,
      icon: "fa fa-invert fa-user-plus",
      onClick: () => this.onCreate(),
      primary: true
    }
  ];

  columnActions: ColumnAction<TestDraft>[] = [
    {
      label: $localize`Open Test`,
      icon: "fa fa-fw fa-hand-pointer",
      onClick: entry => this.onOpen(entry)
    }
  ];

  entryActions: EntryAction<TestDraft>[] = [
    {
      label: $localize`Edit Test`,
      icon: "fa fa-fw fa-user-edit",
      onClick: entry => this.onEdit(entry)
    },
    {
      label: $localize`Delete Test`,
      icon: "fa fa-fw fa-trash",
      onClick: entry => this.onDelete(entry)
    }
  ];

  selectionActions: SelectionAction<string, TestDraft>[] = [
    {
      label: (amount) => {
        if (amount === 1) {
          return $localize`Delete ${amount} Test`;
        }

        return $localize`Delete ${amount} Tests`;
      },
      icon: "fa fa-trash",
      resetSelection: true,
      onClick: entries => this.onDeleteMany(entries)
    }
  ];

  testDrafts$ = this.store.select(TestDraftsState.selectAll);
  tableMetaData$ = this.store.select(TestDraftsState.selectTableMetaData);
  loading$ = this.store.select(TestDraftsState.selectLoading);

  constructor(private store: Store,
              private router: Router,
              private datePipe: DatePipe,
              private keycloakService: KeycloakService,
              private confirmationService: ConfirmationService,
              private dialogService: DialogService) {
  }

  ngOnInit(): void {
    if (!this.keycloakService.isUserInRole(Right.ManageCourses)) {
      this.allTestsTab.visible = false;
      this.allTestsTab.disabled = true;

      this.store.dispatch(TestDraftActions.setTab({ key: TestDraftTab.MY }));
    }
  }

  onLoadData(event: LoadDataEvent) {
    this.store.dispatch(TestDraftActions.load({ event }));
  }

  onActivateTab(key: TestDraftTab) {
    this.store.dispatch(TestDraftActions.activateTab({ key }));
  }

  onOpen(entry: TestDraft) {
    void this.router.navigate(["authoring", "tests", entry.key]);
  }

  onCreate() {
    this.dialogService.open(TestDraftEditComponent, {
      header: $localize`Create Test`,
      width: "60rem"
    });
  }

  onEdit(entry: TestDraft) {
    this.dialogService.open(TestDraftEditorComponent, {
      header: $localize`Edit Course`,
      width: "60rem",
      data: entry
    });
  }

  onDelete(entry: TestDraft) {
    this.confirmationService.confirm({
      key: CONFIRM_DIALOG_NON_CLOSEABLE,
      header: $localize`Delete Test`,
      message: $localize`Are you sure you want to delete the Test <b>${entry.title}</b>?`,
      icon: "fa fa-trash",
      rejectVisible: true,
      accept: () => this.store.dispatch(TestDraftActions.delete({ entry }))
    });
  }

  onDeleteMany(entries: Map<string, TestDraft>) {
    return new Promise<boolean>(resolve => {
      this.confirmationService.confirm({
        key: CONFIRM_DIALOG_NON_CLOSEABLE,
        header: $localize`Delete Multiple Tests`,
        message: entries.size === 1 ? $localize`Are you sure you want to delete <b>1 test</b>?` : $localize`Are you sure you want to delete <b>${entries.size} tests</b>?`,
        icon: "fa fa-trash",
        rejectVisible: true,
        accept: () => {
          this.store.dispatch(TestDraftActions.deleteMany({ keys: Array.from(entries.keys()) }));
          resolve(true);
        },
        reject: () => resolve(false)
      });
    });
  }

}
