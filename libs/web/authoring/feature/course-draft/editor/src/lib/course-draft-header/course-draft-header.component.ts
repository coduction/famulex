import { CommonModule }                                  from "@angular/common";
import { Component }                                     from "@angular/core";
import { ConfirmationService, MenuItem, MessageService } from "@coduction/primeng/api";
import { CardModule }                                    from "@coduction/primeng/card";
import { DialogService }                                 from "@coduction/primeng/dynamicdialog";
import { MessageModule }                                 from "@coduction/primeng/message";
import { SplitButtonModule }                             from "@coduction/primeng/splitbutton";
import { CourseDraft }                                   from "@famulex/shared/famulex-api-client";
import { CourseDraftActions, CourseDraftState }          from "@famulex/web/authoring/data-access/course-draft-editor-state";
import { CourseDraftEditComponent }                      from "@famulex/web/authoring/feature/course-draft/edit";
import { CourseDraftStatusComponent }                    from "@famulex/web/authoring/ui/course-draft-ui";
import { CONFIRM_DIALOG }                                from "@famulex/web/shared/layout";
import { Store }                                         from "@ngrx/store";

@Component({
  selector: "authoring-course-draft-header",
  standalone: true,
  imports: [CommonModule, CardModule, SplitButtonModule, CourseDraftStatusComponent, MessageModule],
  templateUrl: "./course-draft-header.component.html",
  styleUrls: ["./course-draft-header.component.scss"]
})
export class CourseDraftHeaderComponent {

  courseDraft$ = this.store.select(CourseDraftState.selectCourseDraft);

  constructor(private store: Store,
              private dialogService: DialogService,
              private confirmationService: ConfirmationService,
              private messageService: MessageService) {
  }

  generateActions(courseDraft: CourseDraft): MenuItem[] {
    return [
      {
        label: $localize`Edit Information`,
        icon: "fa fa-edit",
        command: () => this.onEditInformation(courseDraft)
      },
      {
        label: $localize`Archive Course`,
        icon: "fa fa-archive",
        command: () => this.onArchiveCourse(courseDraft)
      }
    ];
  }

  onPublish(courseDraft: CourseDraft): void {
    this.confirmationService.confirm({
      key: CONFIRM_DIALOG,
      header: $localize`Publish Course`,
      message: $localize`Do you want to publish <b>${courseDraft.title}</b>?`,
      icon: "fa fa-upload",
      rejectVisible: true,
      accept: () => this.store.dispatch(CourseDraftActions.publish())
    });
  }

  onEditInformation(courseDraft: CourseDraft): void {
    this.dialogService.open(CourseDraftEditComponent, {
      header: $localize`Edit Course Information`,
      data: courseDraft
    });
  }

  onArchiveCourse(courseDraft: CourseDraft): void {
    this.messageService.add({
      severity: "info",
      summary: $localize`Archiving Course`,
      detail: $localize`This feature is not yet implemented`
    });
  }
}
