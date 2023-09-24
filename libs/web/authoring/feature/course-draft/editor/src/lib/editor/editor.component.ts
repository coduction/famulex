import { CommonModule }                from "@angular/common";
import { Component, Input, OnDestroy } from "@angular/core";
import { RouterOutlet }                from "@angular/router";
import { MenuItem }                    from "@coduction/primeng/api";
import { CardModule }                  from "@coduction/primeng/card";
import { TabMenuModule }               from "@coduction/primeng/tabmenu";
import { CourseDraftActions }          from "@famulex/web/authoring/data-access/course-draft-editor-state";
import { Store }                       from "@ngrx/store";
import { CourseDraftHeaderComponent }  from "../course-draft-header/course-draft-header.component";

@Component({
  selector: "authoring-course-draft-editor",
  standalone: true,
  imports: [CommonModule, CourseDraftHeaderComponent, RouterOutlet, CardModule, TabMenuModule],
  templateUrl: "./editor.component.html",
  styleUrls: ["./editor.component.scss"]
})
export class CourseDraftEditorComponent implements OnDestroy {

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

  ngOnDestroy(): void {
    this.store.dispatch(CourseDraftActions.leaveEditor());
  }
}
