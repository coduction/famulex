import { CommonModule }           from "@angular/common";
import { Component }              from "@angular/core";
import { Right }                  from "@famulex/shared/famulex-api-client";
import { prepareRightsRendering } from "@famulex/shared/util";
import { CellRenderer }           from "@famulex/web/shared/table";

@Component({
  selector: "web-table-permission-renderer",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./permission-renderer.component.html",
  styleUrls: ["./permission-renderer.component.scss"]
})
export class PermissionRendererComponent extends CellRenderer<Right[]> {

  preparedRights: { icon: string, label: string }[] = [];

  override onSetData(rights: Right[] | null | undefined) {
    this.preparedRights = prepareRightsRendering(rights ?? []);
  }
}
