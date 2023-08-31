import { CommonModule }                                 from "@angular/common";
import { Component }                                    from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { ButtonModule }                                 from "@coduction/primeng/button";
import { DynamicDialogRef }                             from "@coduction/primeng/dynamicdialog";
import { InputTextModule }                              from "@coduction/primeng/inputtext";
import { InputTextareaModule }                          from "@coduction/primeng/inputtextarea";
import { RippleModule }                                 from "@coduction/primeng/ripple";
import { CourseDraftRequest }                           from "@famulex/shared/famulex-api-client";
import { FormErrorComponent, FormLabelComponent }       from "@famulex/shared/ui";
import { validateForm }                                 from "@famulex/shared/util";
import { CourseDraftListActions }                       from "@famulex/web/authoring/data-access/course-draft-list-state";
import { Store }                                        from "@ngrx/store";

@Component({
  selector: "authoring-course-draft-edit",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormLabelComponent, FormErrorComponent, InputTextModule, InputTextareaModule, ButtonModule, RippleModule],
  templateUrl: "./edit.component.html",
  styleUrls: ["./edit.component.scss"]
})
export class CourseDraftEditComponent {

  createCourseDraftForm = this.fb.group({
    title: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
    author: ["", [Validators.minLength(3), Validators.maxLength(30)]],
    description: ["", [Validators.maxLength(500)]]
  });

  constructor(private fb: FormBuilder,
              private store: Store,
              private dialogRef: DynamicDialogRef) {
  }

  async onSubmit() {
    if (await validateForm(this.createCourseDraftForm)) {
      const courseDraftRequest: CourseDraftRequest = {
        title: this.createCourseDraftForm.value.title!,
        author: this.createCourseDraftForm.value.author!,
        description: this.createCourseDraftForm.value.description!
      };


      this.store.dispatch(CourseDraftListActions.create({ request: courseDraftRequest, dialog: this.dialogRef }));
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
