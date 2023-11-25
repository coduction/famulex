import { CommonModule }                                   from "@angular/common";
import { Component }                                      from "@angular/core";
import { ButtonModule }                                   from "primeng/button";
import { CourseDraftNode, CourseNodeType }                from "@famulex/shared/famulex-api-client";
import { iconForCourseNodeType, translateCourseNodeType } from "@famulex/shared/util";
import { CourseDraftNodeAction, CourseDraftNodesState }   from "@famulex/web/authoring/data-access/course-draft-editor-state";
import { Store }                                          from "@ngrx/store";
import { Observable }                                     from "rxjs";
import { CourseDraftNodeChapterComponent }                from "../course-draft-node-chapter/course-draft-node-chapter.component";
import { CourseDraftNodePdfComponent }                    from "../course-draft-node-pdf/course-draft-node-pdf.component";
import { CourseDraftNodeQuizComponent }                   from "../course-draft-node-quiz/course-draft-node-quiz.component";
import { CourseDraftNodeTextComponent }                   from "../course-draft-node-text/course-draft-node-text.component";
import { CourseDraftNodeVideoComponent }                  from "../course-draft-node-video/course-draft-node-video.component";

@Component({
  selector: "authoring-course-draft-node-content",
  standalone: true,
  imports: [CommonModule, CourseDraftNodeChapterComponent, CourseDraftNodeTextComponent, CourseDraftNodePdfComponent, CourseDraftNodeQuizComponent, CourseDraftNodeVideoComponent, ButtonModule],
  templateUrl: "./course-draft-node-content.component.html",
  styleUrls: ["./course-draft-node-content.component.scss"]
})
export class CourseDraftNodeContentComponent {

  CourseNodeType = CourseNodeType;

  currentNode$ = this.store.select(CourseDraftNodesState.selectCurrentNode);
  nodeActions$: Observable<CourseDraftNodeAction[]> = this.store.select(CourseDraftNodesState.selectActions);

  constructor(private store: Store) {
  }

  iconForCourseNodeType(node: CourseDraftNode): string {
    return iconForCourseNodeType(node.type) + " mr-2";
  }

  translateCourseNodeType(node: CourseDraftNode): string {
    return translateCourseNodeType(node.type);
  }
}
