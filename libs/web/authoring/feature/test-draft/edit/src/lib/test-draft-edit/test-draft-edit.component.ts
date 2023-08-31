import { CommonModule } from "@angular/common";
import { Component }    from "@angular/core";

@Component({
  selector: "authoring-test-draft-edit",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./edit.component.html",
  styleUrls: ["./edit.component.scss"]
})
export class TestDraftEditComponent {
}
