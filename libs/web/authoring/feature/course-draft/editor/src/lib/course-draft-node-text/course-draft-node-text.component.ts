import { CommonModule }                                   from "@angular/common";
import { Component, DestroyRef, OnInit }                  from "@angular/core";
import { takeUntilDestroyed }                             from "@angular/core/rxjs-interop";
import { FormsModule }                                    from "@angular/forms";
import { AutoFocusModule }                                from "primeng/autofocus";
import { EditorModule }                                   from "primeng/editor";
import { TextViewerComponent }                            from "@famulex/shared/ui";
import { CourseDraftItemsActions, CourseDraftItemsState } from "@famulex/web/authoring/data-access/course-draft-editor-state";
import { Store }                                          from "@ngrx/store";
import { Subject, takeWhile, throttleTime }               from "rxjs";

@Component({
  selector: "authoring-course-draft-node-text",
  standalone: true,
  imports: [CommonModule, EditorModule, FormsModule, AutoFocusModule, TextViewerComponent],
  templateUrl: "./course-draft-node-text.component.html",
  styleUrls: ["./course-draft-node-text.component.scss"]
})
export class CourseDraftNodeTextComponent implements OnInit {

  itemContents: { [key: string]: string } = {};
  itemDebounce = new Subject<{ key: string, content: string }>();

  constructor(private store: Store, private destroyRef: DestroyRef) {
  }

  ngOnInit(): void {
    // Set the initial content for each item
    this.store.select(CourseDraftItemsState.selectAll)
      .pipe(takeWhile(items => items.length === 0, true))
      .subscribe(items => items.forEach(item => this.itemContents[item.key] = item.content ?? ""));

    // Update the content of the item
    this.itemDebounce
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        throttleTime(1000, undefined, { leading: true, trailing: true })
      ).subscribe(({ key, content }) => this.store.dispatch(CourseDraftItemsActions.updateContent({ key, content })));

  }

  updateItemContent(key: string, content: string) {
    this.itemDebounce.next({ key, content });
  }
}
