import { CommonModule }                                                                                from "@angular/common";
import { Component, OnInit, Optional }                                                                 from "@angular/core";
import { NonNullableFormBuilder, ReactiveFormsModule, Validators }                                     from "@angular/forms";
import { ButtonModule }                                                                                from "primeng/button";
import { DynamicDialogConfig, DynamicDialogRef }                                                       from "primeng/dynamicdialog";
import { EditorModule }                                                                                from "primeng/editor";
import { InputNumberModule }                                                                           from "primeng/inputnumber";
import { InputTextModule }                                                                             from "primeng/inputtext";
import { RippleModule }                                                                                from "primeng/ripple";
import { SelectButtonModule }                                                                          from "primeng/selectbutton";
import { CourseDraftNode, CourseDraftNodeRequestCreate, CourseDraftNodeRequestUpdate, CourseNodeType } from "@famulex/shared/famulex-api-client";
import { FormErrorComponent, FormLabelComponent }                                                      from "@famulex/shared/ui";
import { prepareCourseNodeTypes, validateForm }                                                        from "@famulex/shared/util";
import { CourseDraftNodesActions }                                                                     from "@famulex/web/authoring/data-access/course-draft-editor-state";
import { Store }                                                                                       from "@ngrx/store";

@Component({
  selector: "authoring-course-draft-node-edit",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormLabelComponent, SelectButtonModule, FormErrorComponent, InputNumberModule, EditorModule, ButtonModule, RippleModule, InputTextModule],
  templateUrl: "./course-draft-node-edit.component.html",
  styleUrls: ["./course-draft-node-edit.component.scss"]
})
export class CourseDraftNodeEditComponent implements OnInit {

  courseDraftNodeForm = this.fb.group({
    type: this.fb.control<CourseNodeType | undefined>(undefined, Validators.required),
    title: this.fb.control<string>("", [Validators.required]),
    description: this.fb.control<string>(""),
    estimatedTime: this.fb.control<number | undefined>(undefined, [Validators.min(0)])
  });

  nodeTypes = prepareCourseNodeTypes();

  parentKey?: string;
  courseDraftNode?: CourseDraftNode;

  constructor(private fb: NonNullableFormBuilder,
              private store: Store,
              @Optional() private dialogRef?: DynamicDialogRef,
              @Optional() private config?: DynamicDialogConfig<CourseDraftNode | string>) {
  }

  ngOnInit(): void {
    if (this.config?.data) {
      if (typeof this.config.data === "string") {
        this.parentKey = this.config.data;
      } else {
        this.courseDraftNode = this.config.data;

        this.courseDraftNodeForm.controls.type?.disable();
        this.courseDraftNodeForm.patchValue(this.courseDraftNode);
      }
    }

    console.log(this.config?.data, this.parentKey, this.courseDraftNode);
  }

  async onSubmit() {
    if (await validateForm(this.courseDraftNodeForm)) {
      if (this.courseDraftNode) {
        const request: CourseDraftNodeRequestUpdate = {
          /* eslint-disable @typescript-eslint/no-non-null-assertion */
          title: this.courseDraftNodeForm.value.title!,
          description: this.courseDraftNodeForm.value.description,
          estimatedTime: this.courseDraftNodeForm.value.estimatedTime
          /* eslint-enable */
        };

        this.store.dispatch(CourseDraftNodesActions.update({ key: this.courseDraftNode.key, request, dialog: this.dialogRef }));
      } else {
        const request: CourseDraftNodeRequestCreate = {
          /* eslint-disable @typescript-eslint/no-non-null-assertion */
          parentKey: this.parentKey,
          type: this.courseDraftNodeForm.value.type!,
          title: this.courseDraftNodeForm.value.title!,
          description: this.courseDraftNodeForm.value.description,
          estimatedTime: this.courseDraftNodeForm.value.estimatedTime
          /* eslint-enable */
        };

        this.store.dispatch(CourseDraftNodesActions.create({ request, dialog: this.dialogRef }));
      }
    }
  }

  onCancel(): void {
    this.dialogRef?.close();
  }
}
