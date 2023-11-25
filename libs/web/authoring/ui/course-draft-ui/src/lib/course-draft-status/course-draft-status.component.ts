import { CommonModule }     from "@angular/common";
import { Component, Input } from "@angular/core";
import { MessageModule }    from "primeng/message";
import { CourseStatus }     from "@famulex/shared/famulex-api-client";

@Component({
  selector: "authoring-course-draft-status",
  standalone: true,
  imports: [CommonModule, MessageModule],
  templateUrl: "./course-draft-status.component.html",
  styleUrls: ["./course-draft-status.component.scss"]
})
export class CourseDraftStatusComponent {

  @Input({ required: true }) status!: CourseStatus;

}
