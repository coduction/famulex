import { CommonModule }                                  from "@angular/common";
import { Component }                                     from "@angular/core";
import { ConfirmationService, MenuItem, MessageService } from "@coduction/primeng/api";
import { DialogService }                                 from "@coduction/primeng/dynamicdialog";
import { SplitButtonModule }                             from "@coduction/primeng/splitbutton";
import { TestDraft }                                     from "@famulex/shared/famulex-api-client";
import { TestDraftActions, TestDraftsState }             from "@famulex/web/authoring/data-access/test-draft-editor-state";
import { CONFIRM_DIALOG }                                from "@famulex/web/shared/layout";
import { Store }                                         from "@ngrx/store";
import { TestDraftEditComponent }                        from "../test-draft-edit/test-draft-edit.component";
import { TestDraftStatusComponent }                      from "../test-draft-status/test-draft-status.component";

@Component({
  selector: "authoring-test-draft-editor-header",
  standalone: true,
  imports: [CommonModule, TestDraftStatusComponent, SplitButtonModule],
  templateUrl: "./test-draft-editor-header.component.html",
  styleUrls: ["./test-draft-editor-header.component.scss"]
})
export class TestDraftEditorHeaderComponent {

  testDraft$ = this.store.select(TestDraftsState.selectCurrentTestDraft);

  constructor(private store: Store,
              private dialogService: DialogService,
              private confirmationService: ConfirmationService,
              private messageService: MessageService) {

  }

  generateActions(testDraft: TestDraft): MenuItem[] {
    return [
      {
        label: $localize`Edit Information`,
        icon: "fa fa-edit",
        command: () => this.onEditInformation(testDraft)
      },
      {
        label: $localize`Archive Course`,
        icon: "fa fa-archive",
        command: () => this.onArchiveCourse(testDraft)
      }
    ];
  }

  onPublish(testDraft: TestDraft): void {
    this.confirmationService.confirm({
      key: CONFIRM_DIALOG,
      header: $localize`Publish Test`,
      message: $localize`Do you want to publish <b>${testDraft.title}</b>?`,
      icon: "fa fa-upload",
      rejectVisible: true,
      accept: () => this.store.dispatch(TestDraftActions.publish())
    });
  }

  onEditInformation(testDraft: TestDraft): void {
    this.dialogService.open(TestDraftEditComponent, {
      header: $localize`Edit Test Information`,
      data: testDraft
    });
  }

  onArchiveCourse(testDraft: TestDraft): void {
    this.messageService.add({
      severity: "info",
      summary: $localize`Archiving Test`,
      detail: $localize`This feature is not yet implemented`
    });
  }
}
