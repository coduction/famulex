import { CommonModule }                                                                                   from "@angular/common";
import { ChangeDetectorRef, Component, DestroyRef, OnInit, ViewChild }                                    from "@angular/core";
import { takeUntilDestroyed }                                                                             from "@angular/core/rxjs-interop";
import { ConfirmationService }                                                                            from "primeng/api";
import { FileUpload, FileUploadModule }                                                                   from "primeng/fileupload";
import { CourseDraftItem, FilePermission }                                                                from "@famulex/shared/famulex-api-client";
import { VideoPlayerComponent }                                                                           from "@famulex/shared/ui";
import { CourseDraftItemsActions, CourseDraftItemsState, CourseDraftNodeAction, CourseDraftNodesActions } from "@famulex/web/authoring/data-access/course-draft-editor-state";
import { Store }                                                                                          from "@ngrx/store";
import { VgBufferingModule }                                                                              from "@videogular/ngx-videogular/buffering";
import { VgControlsModule }                                                                               from "@videogular/ngx-videogular/controls";
import { VgCoreModule }                                                                                   from "@videogular/ngx-videogular/core";
import { VgOverlayPlayModule }                                                                            from "@videogular/ngx-videogular/overlay-play";

@Component({
  selector: "authoring-course-draft-node-video",
  standalone: true,
  imports: [CommonModule, FileUploadModule, VgCoreModule, VgOverlayPlayModule, VgBufferingModule, VgControlsModule, VideoPlayerComponent],
  templateUrl: "./course-draft-node-video.component.html",
  styleUrls: ["./course-draft-node-video.component.scss"]
})
export class CourseDraftNodeVideoComponent implements OnInit {

  readonly REMOVE_VIDEO_ID = "remove-video";

  @ViewChild("fileUpload") fileUpload?: FileUpload;

  items$ = this.store.select(CourseDraftItemsState.selectAll);

  constructor(private store: Store,
              private confirmationService: ConfirmationService,
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

    this.items$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(items => {
      if (items.length && items[0].filePermissions.length) {
        // TODO: Hotfix - Support multiple items and files
        const removeVideoAction: CourseDraftNodeAction = {
          label: $localize`Remove Video`,
          icon: "fa fa-trash-can",
          onClick: () => this.onDeleteVideo(items[0].filePermissions[0])
        };

        this.store.dispatch(CourseDraftNodesActions.addAction({ id: this.REMOVE_VIDEO_ID, action: removeVideoAction }));
      }
    });
  }

  onUploadVideo(item: CourseDraftItem, files: File[]) {
    // TODO: Upload progress
    this.store.dispatch(CourseDraftItemsActions.uploadFile({ itemKey: item.key, file: files[0] }));
  }

  onDeleteVideo(filePermission: FilePermission) {
    this.confirmationService.confirm({
      key: "confirmDialog",
      header: $localize`Remove Video`,
      icon: "fa fa-fw fa-trash-can",
      message: "Do you want to remove this video?",
      accept: () => this.store.dispatch(CourseDraftItemsActions.deleteFilePermission({ filePermission }))
    });
  }
}
