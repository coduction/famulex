import { CommonModule } from "@angular/common";
import { Component }    from "@angular/core";

@Component({
  selector: "authoring-test-draft-list",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./test-draft-list.component.html",
  styleUrls: ["./test-draft-list.component.scss"]
})
export class TestDraftListComponent {
}
