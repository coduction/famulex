import { CommonModule }                                            from "@angular/common";
import { Component, Optional }                                     from "@angular/core";
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { ButtonModule }                                            from "@coduction/primeng/button";
import { DynamicDialogRef }                                        from "@coduction/primeng/dynamicdialog";
import { InputTextModule }                                         from "@coduction/primeng/inputtext";
import { InputTextareaModule }                                     from "@coduction/primeng/inputtextarea";
import { RippleModule }                                            from "@coduction/primeng/ripple";
import { CourseDraftRequest }                                      from "@famulex/shared/famulex-api-client";
import { FormErrorComponent, FormLabelComponent }                  from "@famulex/shared/ui";
import { DialogButton, DialogOptions, validateForm }               from "@famulex/shared/util";
import { CourseDraftListActions }                                  from "@famulex/web/authoring/data-access/course-draft-list-state";
import { Store }                                                   from "@ngrx/store";

@Component({
  selector: "authoring-course-draft-edit",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormLabelComponent, FormErrorComponent, InputTextModule, InputTextareaModule, ButtonModule, RippleModule],
  templateUrl: "./edit.component.html",
  styleUrls: ["./edit.component.scss"]
})
export class CourseDraftEditComponent {

  createCourseDraftForm = this.fb.group({
    title: this.fb.control<string>("", { validators: [Validators.required, Validators.minLength(3), Validators.maxLength(30)] }),
    author: this.fb.control("", [Validators.minLength(3), Validators.maxLength(30)]),
    description: this.fb.control("", [Validators.maxLength(500)])
  });

  createButton: DialogButton = {
    label: $localize`Create Course`,
    icon: "fa fa-save"
  };

  cancelButton: DialogButton = {
    label: $localize`Cancel`,
    icon: "fa fa-close"
  };

  dialogOptions: DialogOptions = {
    dialogRef: this.dialogRef,
    buttons: [this.createButton, this.cancelButton]
  };

  constructor(private fb: NonNullableFormBuilder,
              private store: Store,
              @Optional() private dialogRef?: DynamicDialogRef) {
  }

  async onSubmit() {
    if (await validateForm(this.createCourseDraftForm)) {
      const courseDraftRequest: CourseDraftRequest = {
        title: this.createCourseDraftForm.getRawValue().title,
        author: this.createCourseDraftForm.value.author,
        description: this.createCourseDraftForm.value.description
      };

      this.dialogOptions.activeButton = this.createButton;

      this.store.dispatch(CourseDraftListActions.create({ request: courseDraftRequest, dialog: this.dialogOptions }));
    }
  }

  onCancel(): void {
    this.dialogRef?.close();
  }
}
