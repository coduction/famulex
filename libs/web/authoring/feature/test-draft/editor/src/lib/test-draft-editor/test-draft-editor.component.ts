import { CommonModule } from "@angular/common";
import { Component }    from "@angular/core";

@Component({
  selector: "authoring-editor",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./test-draft-editor.component.html",
  styleUrls: ["./test-draft-editor.component.scss"]
})
export class TestDraftEditorComponent {
}
