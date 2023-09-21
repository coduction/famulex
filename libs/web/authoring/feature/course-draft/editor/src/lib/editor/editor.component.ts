import { CommonModule }                        from "@angular/common";
import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { RouterOutlet }                        from "@angular/router";
import { MenuItem }                            from "@coduction/primeng/api";
import { CardModule }                          from "@coduction/primeng/card";
import { TabMenuModule }                       from "@coduction/primeng/tabmenu";
import { CourseDraftEditorActions }            from "@famulex/web/authoring/data-access/course-draft-editor-state";
import { CourseMembershipsActions }            from "@famulex/web/authoring/data-access/course-memberships-state";
import { Store }                               from "@ngrx/store";
import { CourseDraftHeaderComponent }          from "../course-draft-header/course-draft-header.component";

@Component({
  selector: "authoring-course-draft-editor",
  standalone: true,
  imports: [CommonModule, CourseDraftHeaderComponent, RouterOutlet, CardModule, TabMenuModule],
  templateUrl: "./editor.component.html",
  styleUrls: ["./editor.component.scss"]
})
export class CourseDraftEditorComponent implements OnInit, OnDestroy {

  tabs: MenuItem[] = [
    {
      label: $localize`Content`,
      icon: "fa fa-folder-tree",
      routerLink: "content"
    },
    {
      label: $localize`Memberships`,
      icon: "fa fa-users",
      routerLink: "memberships"
    }
  ];

  @Input() courseDraftKey!: string;

  constructor(private store: Store) {
  }

  ngOnInit(): void {
    this.store.dispatch(CourseDraftEditorActions.loadCourseDraft({ key: this.courseDraftKey }));
    this.store.dispatch(CourseMembershipsActions.setCourse({ key: this.courseDraftKey }));
  }

  ngOnDestroy(): void {
    this.store.dispatch(CourseDraftEditorActions.leaveEditor());
  }
}
