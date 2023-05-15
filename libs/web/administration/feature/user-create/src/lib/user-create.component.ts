import { CommonModule }                                 from "@angular/common";
import { Component }                                    from "@angular/core";
import { takeUntilDestroyed }                           from "@angular/core/rxjs-interop";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { ButtonModule }                                 from "@coduction/primeng/button";
import { InputSwitchModule }                            from "@coduction/primeng/inputswitch";
import { InputTextModule }                              from "@coduction/primeng/inputtext";
import { PasswordModule }                               from "@coduction/primeng/password";
import { RippleModule }                                 from "@coduction/primeng/ripple";
import { UserRequest }                                  from "@famulex/shared/famulex-api-client";
import { FormErrorComponent, FormLabelComponent }       from "@famulex/shared/ui";
import { validateForm }                                 from "@famulex/shared/util";
import { UserActions, UserState }                       from "@famulex/web/administration/data-access/user-state";
import { ActionsSubject, Store }                        from "@ngrx/store";

@Component({
  selector: "administration-user-create",
  standalone: true,
  imports: [CommonModule, ButtonModule, RippleModule, PasswordModule, ReactiveFormsModule, InputSwitchModule, FormErrorComponent, FormLabelComponent, InputTextModule],
  templateUrl: "./user-create.component.html",
  styleUrls: ["./user-create.component.scss"]
})
export class UserCreateComponent {

  createUserForm = this.fb.nonNullable.group({
    firstName: ["", Validators.required],
    lastName: ["", [Validators.required]],
    email: ["", [Validators.required, Validators.email]],
    username: ["", Validators.required],
    set_password: [false],
    password_temporary: [true],
    password: [""],
    password_confirmation: [""]
  });

  loading$ = this.store.select(UserState.selectActionInProgress);

  constructor(private fb: FormBuilder,
              private store: Store,
              private actions$: ActionsSubject) {
    this.createUserForm.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(form => {
        if (form.set_password) {
          this.createUserForm.controls.password.setValidators([Validators.required]);
          this.createUserForm.get("password_confirmation")!.setValidators([Validators.required]);

          if (form.password_confirmation && form.password_confirmation !== form.password) {
            this.createUserForm.get("password_confirmation")!.setErrors({ passwordMatch: true });
          }
        } else {
          this.createUserForm.get("password")!.clearValidators();
          this.createUserForm.get("password_confirmation")!.clearValidators();
        }
      });

    this.loading$.pipe(takeUntilDestroyed()).subscribe(loading => {
      if (loading) {
        this.createUserForm.disable();
      } else {
        this.createUserForm.enable();
      }
    });
  }

  onSubmit(): void {
    if (validateForm(this.createUserForm)) {
      const userRequest: UserRequest = {
        firstName: this.createUserForm.controls.firstName.value,
        lastName: this.createUserForm.controls.lastName.value,
        email: this.createUserForm.controls.email.value,
        username: this.createUserForm.controls.username.value
      };

      if (this.createUserForm.value.set_password) {
        userRequest.password = this.createUserForm.controls.password.value;
        userRequest.passwordTemporary = this.createUserForm.controls.password_temporary.value;
      }

      this.store.dispatch(UserActions.createUser({ userRequest }));
    }
  }

  onCancel(): void {
    this.store.dispatch(UserActions.createUserCancel());
  }
}
