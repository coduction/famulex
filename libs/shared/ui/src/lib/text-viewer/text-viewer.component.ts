import { CommonModule }     from "@angular/common";
import { Component, Input } from "@angular/core";

@Component({
  selector: "ui-text-viewer",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./text-viewer.component.html",
  styleUrls: ["./text-viewer.component.scss"]
})
export class TextViewerComponent {

  @Input({ required: true }) content?: string | null;

}
