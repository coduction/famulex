import { CommonModule }                                                                                   from "@angular/common";
import { Component, DestroyRef, OnInit, ViewChild }                                                       from "@angular/core";
import { takeUntilDestroyed }                                                                             from "@angular/core/rxjs-interop";
import { ConfirmationService }                                                                            from "primeng/api";
import { FileUpload, FileUploadModule }                                                                   from "primeng/fileupload";
import { CourseDraftItem, FilePermission }                                                                from "@famulex/shared/famulex-api-client";
import { PdfViewerComponent, VideoPlayerComponent }                                                       from "@famulex/shared/ui";
import { CourseDraftItemsActions, CourseDraftItemsState, CourseDraftNodeAction, CourseDraftNodesActions } from "@famulex/web/authoring/data-access/course-draft-editor-state";
import { Store }                                                                                          from "@ngrx/store";

@Component({
  selector: "authoring-course-draft-node-pdf",
  standalone: true,
  imports: [CommonModule, FileUploadModule, VideoPlayerComponent, PdfViewerComponent],
  templateUrl: "./course-draft-node-pdf.component.html",
  styleUrls: ["./course-draft-node-pdf.component.scss"]
})
export class CourseDraftNodePdfComponent implements OnInit {

  readonly REMOVE_PDF_ID = "remove-pdf";

  @ViewChild("fileUpload") fileUpload?: FileUpload;

  items$ = this.store.select(CourseDraftItemsState.selectAll);

  constructor(private store: Store,
              private confirmationService: ConfirmationService,
              private destroyRef: DestroyRef) {
  }

  ngOnInit() {
    this.items$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(items => {
      if (items.length && items[0].filePermissions.length) {
        // TODO: Hotfix - Support multiple items and files
        const removeVideoAction: CourseDraftNodeAction = {
          label: $localize`Remove PDF`,
          icon: "fa fa-trash-can",
          onClick: () => this.onDeletePdf(items[0].filePermissions[0])
        };

        this.store.dispatch(CourseDraftNodesActions.addAction({ id: this.REMOVE_PDF_ID, action: removeVideoAction }));
      }
    });
  }

  onUploadPdf(item: CourseDraftItem, files: File[]) {
    // TODO: Upload progress
    this.store.dispatch(CourseDraftItemsActions.uploadFile({ itemKey: item.key, file: files[0] }));
  }

  onDeletePdf(filePermission: FilePermission) {
    this.confirmationService.confirm({
      key: "confirmDialog",
      header: $localize`Remove PDF`,
      icon: "fa fa-fw fa-trash-can",
      message: "Do you want to remove this PDF?",
      accept: () => this.store.dispatch(CourseDraftItemsActions.deleteFilePermission({ filePermission }))
    });
  }
}
