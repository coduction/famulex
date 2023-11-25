import { CommonModule }                                from "@angular/common";
import { Component, ViewChild, ViewEncapsulation }     from "@angular/core";
import { ActivatedRoute, Router, RouterOutlet }        from "@angular/router";
import { ConfirmationService, SharedModule, TreeNode } from "@coduction/primeng/api";
import { ButtonModule }                                from "@coduction/primeng/button";
import { DialogService }                               from "@coduction/primeng/dynamicdialog";
import { OverlayPanel, OverlayPanelModule }            from "@coduction/primeng/overlaypanel";
import { TreeModule, TreeNodeDropEvent }               from "@coduction/primeng/tree";
import { QuestionDraft }                               from "@famulex/shared/famulex-api-client";
import { StopClickPropagationDirective }               from "@famulex/shared/ui";
import { QuestionDraftActions, QuestionDraftsState }   from "@famulex/web/authoring/data-access/test-draft-editor-state";
import { Store }                                       from "@ngrx/store";
import { firstValueFrom }                              from "rxjs";
import { QuestionDraftEditComponent }                  from "../question-draft-edit/question-draft-edit.component";

@Component({
  selector: "authoring-test-draft-content",
  standalone: true,
  imports: [CommonModule, ButtonModule, OverlayPanelModule, RouterOutlet, SharedModule, StopClickPropagationDirective, TreeModule],
  templateUrl: "./test-draft-content.component.html",
  styleUrls: ["./test-draft-content.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class TestDraftContentComponent {

  @ViewChild("courseNodeActions") entryActions!: OverlayPanel;
  actionEntry?: QuestionDraft;

  tree$ = this.store.select(QuestionDraftsState.selectTree);
  currentTreeNode$ = this.store.select(QuestionDraftsState.selectCurrentTreeNode);

  constructor(private store: Store,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private dialogService: DialogService,
              private confirmationService: ConfirmationService) {
  }

  onEdit(question: QuestionDraft) {
    this.dialogService.open(QuestionDraftEditComponent, {
      data: question,
      header: $localize`Edit Question`
    });

    void this.onResetEntryActions();
  }

  onDelete(question: QuestionDraft) {
    this.confirmationService.confirm({
      key: "confirmDialog",
      message: `Are you sure you want to delete <b>${question.title}</b>?`,
      header: "Deletion Confirmation",
      icon: "fa fa-trash-can",
      accept: () => this.store.dispatch(QuestionDraftActions.delete({ node: question }))
    });

    void this.onResetEntryActions();
  }

  async onResetEntryActions() {
    this.entryActions.hide();

    const currentTreeNode = await firstValueFrom(this.currentTreeNode$);
    this.actionEntry = currentTreeNode?.data;
  }

  onNodeSelect(event: TreeNode<QuestionDraft> | TreeNode<QuestionDraft>[] | null) {
    if (!event || Array.isArray(event)) {
      return;
    }

    if (!event.selectable || event.type === "ACTION_ADD_NODE") {
      return;
    }

    if (!event.key || !event.data) {
      return;
    }

    // if (event.data?.type === CourseNodeType.Chapter) {
    //   if (this.actionEntry?.key === event.key) {
    //     event.expanded = !event.expanded;
    //   } else {
    //     event.expanded = true;
    //   }
    // }

    this.actionEntry = event.data;

    //this.store.dispatch(CourseDraftNodesActions.selectNode({ key: event.key, route: this.activatedRoute }));
    void this.router.navigate([event.key], { relativeTo: this.activatedRoute });
  }

  onNodeDrop($event: TreeNodeDropEvent) {

  }

  onNodeAdd(node: TreeNode<QuestionDraft>) {
    this.dialogService.open(QuestionDraftEditComponent, {
      data: node.data?.key
    });
  }

  onShowEntryActions(event: MouseEvent, questionDraft: QuestionDraft) {
    // Check whether current target is the same
    if (this.entryActions.overlayVisible) {
      setTimeout(() => this.entryActions.hide());
      if (this.actionEntry?.key == questionDraft.key) return;

      // Timeout is necessary to prevent clashing of events which leads only to hide the overlay
      setTimeout(() => {
        this.actionEntry = questionDraft;
        this.entryActions.show(event);
      }, 150);
    } else {
      this.actionEntry = questionDraft;
      this.entryActions.show(event);
    }
  }
}
