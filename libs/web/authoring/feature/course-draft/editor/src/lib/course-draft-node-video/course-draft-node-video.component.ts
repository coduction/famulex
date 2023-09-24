import { CommonModule }                                                from "@angular/common";
import { ChangeDetectorRef, Component, DestroyRef, OnInit, ViewChild } from "@angular/core";
import { takeUntilDestroyed }                                          from "@angular/core/rxjs-interop";
import { FileUpload, FileUploadModule }                                from "@coduction/primeng/fileupload";
import { CourseDraftItem }                                             from "@famulex/shared/famulex-api-client";
import { CourseDraftItemsActions, CourseDraftItemsState }              from "@famulex/web/authoring/data-access/course-draft-editor-state";
import { Store }                                                       from "@ngrx/store";

@Component({
  selector: "authoring-course-draft-node-video",
  standalone: true,
  imports: [CommonModule, FileUploadModule],
  templateUrl: "./course-draft-node-video.component.html",
  styleUrls: ["./course-draft-node-video.component.scss"]
})
export class CourseDraftNodeVideoComponent implements OnInit {

  @ViewChild("fileUpload") fileUpload?: FileUpload;

  items$ = this.store.select(CourseDraftItemsState.selectAll);

  constructor(private store: Store,
              private destroyRef: DestroyRef,
              private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.store.select(CourseDraftItemsState.selectUploadProgress)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(progress => {
        if (progress != null && this.fileUpload) {
          this.fileUpload.progress = progress;
          this.changeDetectorRef.markForCheck();
          this.changeDetectorRef.detectChanges();
        }
      });
  }

  onUploadVideo(item: CourseDraftItem, files: File[]) {
    // TODO: Upload progress
    this.store.dispatch(CourseDraftItemsActions.uploadFile({ itemKey: item.key, file: files[0] }));
  }
}
