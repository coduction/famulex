import { CommonModule }                   from "@angular/common";
import { Component, Input, OnDestroy }    from "@angular/core";
import { RouterOutlet }                   from "@angular/router";
import { MenuItem }                       from "primeng/api";
import { CardModule }                     from "primeng/card";
import { TabMenuModule }                  from "primeng/tabmenu";
import { TestDraftActions }               from "@famulex/web/authoring/data-access/test-draft-editor-state";
import { Store }                          from "@ngrx/store";
import { TestDraftEditorHeaderComponent } from "../test-draft-editor-header/test-draft-editor-header.component";

@Component({
  selector: "authoring-test-draft-editor",
  standalone: true,
  imports: [CommonModule, CardModule, RouterOutlet, TabMenuModule, TestDraftEditorHeaderComponent],
  templateUrl: "./test-draft-editor.component.html",
  styleUrls: ["./test-draft-editor.component.scss"]
})
export class TestDraftEditorComponent implements OnDestroy {

  tabs: MenuItem[] = [
    {
      label: $localize`Content`,
      icon: "fa fa-folder-tree",
      routerLink: "content"
    },
    {
      label: $localize`Configuration`,
      icon: "fa fa-cog",
      routerLink: "configuration"
    }
  ];

  @Input() testDraftKey!: string;

  constructor(private store: Store) {
  }

  ngOnDestroy() {
    this.store.dispatch(TestDraftActions.leaveEditor());
  }
}
