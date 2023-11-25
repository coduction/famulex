import { CommonModule }                          from "@angular/common";
import { Component, Input }                      from "@angular/core";
import { CourseStatus, TestPublicationFeedback } from "@famulex/shared/famulex-api-client";

@Component({
  selector: "authoring-test-draft-status",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./test-draft-status.component.html",
  styleUrls: ["./test-draft-status.component.scss"]
})
export class TestDraftStatusComponent {

  @Input({ required: true }) status!: CourseStatus;
  @Input({ required: true }) feedback: TestPublicationFeedback[] = [];
  
}
