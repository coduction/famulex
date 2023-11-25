import { CommonModule }                                                     from "@angular/common";
import { Component, Optional }                                              from "@angular/core";
import { NonNullableFormBuilder, ReactiveFormsModule, Validators }          from "@angular/forms";
import { ButtonModule }                                                     from "primeng/button";
import { DynamicDialogRef }                                                 from "primeng/dynamicdialog";
import { InputSwitchModule }                                                from "primeng/inputswitch";
import { InputTextModule }                                                  from "primeng/inputtext";
import { PaginatorModule }                                                  from "primeng/paginator";
import { PasswordModule }                                                   from "primeng/password";
import { SelectButtonModule }                                               from "primeng/selectbutton";
import { CourseMembershipRequestCreate, CourseRole, MembershipType }        from "@famulex/shared/famulex-api-client";
import { FormErrorComponent, FormLabelComponent }                           from "@famulex/shared/ui";
import { InputPendingFeedbackDirective, translateCourseRole, validateForm } from "@famulex/shared/util";
import { CourseMembershipsActions }                                         from "@famulex/web/authoring/data-access/course-memberships-state";
import { UserSearchComponent }                                              from "@famulex/web/shared/user-search";
import { WizardStepComponent, WizardWrapperComponent }                      from "@famulex/web/shared/wizard";
import { Store }                                                            from "@ngrx/store";

@Component({
  selector: "authoring-course-membership-edit",
  standalone: true,
  imports: [CommonModule, UserSearchComponent, FormErrorComponent, FormLabelComponent, InputPendingFeedbackDirective, InputSwitchModule, InputTextModule, PaginatorModule, PasswordModule, ReactiveFormsModule, WizardStepComponent, WizardWrapperComponent, SelectButtonModule, ButtonModule],
  templateUrl: "./course-membership-edit.component.html",
  styleUrls: ["./course-membership-edit.component.scss"]
})
export class CourseMembershipEditComponent {

  membershipEditForm = this.formBuilder.group({
    role: this.formBuilder.control<CourseRole | null>(null, { validators: Validators.required }),
    users: this.formBuilder.control<string[]>([], { validators: [Validators.required] })
  });

  roleOptions = [
    { label: translateCourseRole(CourseRole.Participant), value: CourseRole.Participant },
    { label: translateCourseRole(CourseRole.Editor), value: CourseRole.Editor },
    { label: translateCourseRole(CourseRole.Owner), value: CourseRole.Owner }
  ];

  constructor(private store: Store,
              private formBuilder: NonNullableFormBuilder,
              @Optional() private dialogRef?: DynamicDialogRef) {
  }

  async onSubmit() {
    if (await validateForm(this.membershipEditForm)) {
      this.membershipEditForm.getRawValue().users.forEach(userKey => {
        const role = this.membershipEditForm.getRawValue().role;

        if (!role) {
          return;
        }

        const request: CourseMembershipRequestCreate = {
          type: MembershipType.User,
          role: role,
          userKey: userKey
        };

        this.store.dispatch(CourseMembershipsActions.create({ request, callback: () => this.dialogRef?.close() }));
      });
    }
  }

  onCancel() {
    this.dialogRef?.close();
  }

  onUserSelection(userKeys: string[]) {
    this.membershipEditForm.patchValue({ users: userKeys });
  }
}
