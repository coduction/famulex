import { CommonModule } from "@angular/common";
import { Component }    from "@angular/core";

@Component({
  selector: "authoring-course-draft-editor",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./editor.component.html",
  styleUrls: ["./editor.component.scss"]
})
export class CourseDraftEditorComponent {
}
