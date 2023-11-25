import { CommonModule }                                       from "@angular/common";
import { Component, ViewChild, ViewEncapsulation }            from "@angular/core";
import { ActivatedRoute, Router, RouterOutlet }               from "@angular/router";
import { ConfirmationService, TreeDragDropService, TreeNode } from "primeng/api";
import { ButtonModule }                                       from "primeng/button";
import { DialogService }                                      from "primeng/dynamicdialog";
import { OverlayPanel, OverlayPanelModule }                   from "primeng/overlaypanel";
import { TreeModule, TreeNodeDropEvent }                      from "primeng/tree";
import { CourseDraftNode, CourseNodeType }                    from "@famulex/shared/famulex-api-client";
import { StopClickPropagationDirective }                      from "@famulex/shared/ui";
import { CourseDraftNodesActions, CourseDraftNodesState }     from "@famulex/web/authoring/data-access/course-draft-editor-state";
import { Store }                                              from "@ngrx/store";
import { firstValueFrom }                                     from "rxjs";
import { CourseDraftNodeEditComponent }                       from "../course-draft-node-edit/course-draft-node-edit.component";

@Component({
  selector: "authoring-course-draft-content",
  standalone: true,
  imports: [CommonModule, TreeModule, RouterOutlet, ButtonModule, StopClickPropagationDirective, OverlayPanelModule],
  providers: [TreeDragDropService],
  templateUrl: "./course-draft-content.component.html",
  styleUrls: ["./course-draft-content.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class CourseDraftContentComponent {

  @ViewChild("courseNodeActions") entryActions!: OverlayPanel;
  actionEntry?: CourseDraftNode;

  nodesTree$ = this.store.select(CourseDraftNodesState.selectTree);
  currentTreeNode$ = this.store.select(CourseDraftNodesState.selectCurrentTreeNode);

  constructor(private store: Store,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private dialogService: DialogService,
              private confirmationService: ConfirmationService) {
  }

  onEditNode(node: CourseDraftNode) {
    this.dialogService.open(CourseDraftNodeEditComponent, {
      data: node,
      header: $localize`Edit Node`
    });

    void this.onResetEntryActions();
  }

  onDeleteNode(node: CourseDraftNode) {
    this.confirmationService.confirm({
      key: "confirmDialog",
      message: `Are you sure you want to delete <b>${node.title}</b>?`,
      header: "Deletion Confirmation",
      icon: "fa fa-trash-can",
      accept: () => this.store.dispatch(CourseDraftNodesActions.delete({ node }))
    });

    void this.onResetEntryActions();
  }

  async onResetEntryActions() {
    this.entryActions.hide();

    const currentTreeNode = await firstValueFrom(this.currentTreeNode$);
    this.actionEntry = currentTreeNode?.data;
  }

  onNodeSelect(event: TreeNode<CourseDraftNode> | TreeNode<CourseDraftNode>[] | null) {
    if (!event || Array.isArray(event)) {
      return;
    }

    if (!event.selectable || event.type === "ACTION_ADD_NODE") {
      return;
    }

    if (!event.key || !event.data) {
      return;
    }

    if (event.data?.type === CourseNodeType.Chapter) {
      if (this.actionEntry?.key === event.key) {
        event.expanded = !event.expanded;
      } else {
        event.expanded = true;
      }
    }

    this.actionEntry = event.data;

    //this.store.dispatch(CourseDraftNodesActions.selectNode({ key: event.key, route: this.activatedRoute }));
    void this.router.navigate([event.key], { relativeTo: this.activatedRoute });
  }

  onNodeDrop($event: TreeNodeDropEvent) {

  }

  onNodeAdd(node: TreeNode<CourseDraftNode>) {
    this.dialogService.open(CourseDraftNodeEditComponent, {
      data: node.data?.key
    });
  }

  onShowEntryActions(event: MouseEvent, courseNode: CourseDraftNode) {
    // Check whether current target is the same
    if (this.entryActions.overlayVisible) {
      setTimeout(() => this.entryActions.hide());
      if (this.actionEntry?.key == courseNode.key) return;

      // Timeout is necessary to prevent clashing of events which leads only to hide the overlay
      setTimeout(() => {
        this.actionEntry = courseNode;
        this.entryActions.show(event);
      }, 150);
    } else {
      this.actionEntry = courseNode;
      this.entryActions.show(event);
    }
  }
}
