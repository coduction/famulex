import { CommonModule }                  from "@angular/common";
import { Component, DestroyRef, OnInit } from "@angular/core";
import { takeUntilDestroyed }            from "@angular/core/rxjs-interop";
import { MenuItem }                      from "@coduction/primeng/api";
import { CardModule }                    from "@coduction/primeng/card";
import { DialogService }                 from "@coduction/primeng/dynamicdialog";
import { MessageModule }                 from "@coduction/primeng/message";
import { SplitButtonModule }             from "@coduction/primeng/splitbutton";
import { CourseDraft }                   from "@famulex/shared/famulex-api-client";
import { CourseDraftState }              from "@famulex/web/authoring/data-access/course-draft-editor-state";
import { CourseDraftEditComponent }      from "@famulex/web/authoring/feature/course-draft/edit";
import { CourseDraftStatusComponent }    from "@famulex/web/authoring/ui/course-draft-ui";
import { Store }                         from "@ngrx/store";
import { tap }                           from "rxjs";

@Component({
  selector: "authoring-course-draft-header",
  standalone: true,
  imports: [CommonModule, CardModule, SplitButtonModule, CourseDraftStatusComponent, MessageModule],
  templateUrl: "./course-draft-header.component.html",
  styleUrls: ["./course-draft-header.component.scss"]
})
export class CourseDraftHeaderComponent implements OnInit {

  actions: MenuItem[] = [
    {
      label: $localize`Edit Information`,
      icon: "fa fa-edit",
      command: () => this.onEditInformation()
    },
    {
      label: $localize`Archive Course`,
      icon: "fa fa-archive",
      command: () => this.onArchiveCourse()
    }
  ];

  courseDraft?: CourseDraft;

  title$ = this.store.select(CourseDraftState.selectCourseDraftTitle);
  author$ = this.store.select(CourseDraftState.selectCourseDraftAuthor);
  status$ = this.store.select(CourseDraftState.selectCourseDraftStatus);

  constructor(private store: Store,
              private dialogService: DialogService,
              private destroyRef: DestroyRef) {
  }

  ngOnInit(): void {
    this.store.select(CourseDraftState.selectCourseDraft).pipe(
      takeUntilDestroyed(this.destroyRef),
      tap(courseDraft => this.courseDraft = courseDraft)
    ).subscribe();
  }

  onPublish(): void {

  }

  onEditInformation(): void {
    if (!this.courseDraft) {
      return;
    }

    this.dialogService.open(CourseDraftEditComponent, {
      header: $localize`Edit Course Information`,
      data: this.courseDraft
    });
  }

  onArchiveCourse(): void {

  }
}
