import { CommonModule }                             from "@angular/common";
import { Component, ViewEncapsulation }             from "@angular/core";
import { CardModule }                               from "@coduction/primeng/card";
import { FileUploadHandlerEvent, FileUploadModule } from "@coduction/primeng/fileupload";
import { ImageModule }                              from "@coduction/primeng/image";
import { SystemInfoActions, SystemInfoState }       from "@famulex/shared/system-info";
import { Store }                                    from "@ngrx/store";

@Component({
  selector: "administration-system-info",
  standalone: true,
  imports: [CommonModule, CardModule, FileUploadModule, ImageModule],
  templateUrl: "./system-info.component.html",
  styleUrls: ["./system-info.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class SystemInfoComponent {

  logoUrl$ = this.store.select(SystemInfoState.selectLogoUrl);
  compactLogoUrl$ = this.store.select(SystemInfoState.selectCompactLogoUrl);

  logoPending$ = this.store.select(SystemInfoState.selectLogoPending);
  compactLogoPending$ = this.store.select(SystemInfoState.selectCompactLogoPending);

  constructor(private store: Store) {
  }

  onDeleteLogo() {
    this.store.dispatch(SystemInfoActions.deleteLogo());
  }

  onDeleteCompactLogo() {
    this.store.dispatch(SystemInfoActions.deleteCompactLogo());
  }

  onUploadLogo($event: FileUploadHandlerEvent) {
    this.store.dispatch(SystemInfoActions.uploadLogo({ file: $event.files[0] }));
  }

  onUploadCompactLogo($event: FileUploadHandlerEvent) {
    this.store.dispatch(SystemInfoActions.uploadCompactLogo({ file: $event.files[0] }));
  }
}
