import { CommonModule }                                 from "@angular/common";
import { Component, OnInit }                            from "@angular/core";
import { takeUntilDestroyed }                           from "@angular/core/rxjs-interop";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { ButtonModule }                                 from "@coduction/primeng/button";
import { DynamicDialogConfig, DynamicDialogRef }        from "@coduction/primeng/dynamicdialog";
import { InputSwitchModule }                            from "@coduction/primeng/inputswitch";
import { InputTextModule }                              from "@coduction/primeng/inputtext";
import { PasswordModule }                               from "@coduction/primeng/password";
import { RippleModule }                                 from "@coduction/primeng/ripple";
import { User, UserRequest }                            from "@famulex/shared/famulex-api-client";
import { FormErrorComponent, FormLabelComponent }       from "@famulex/shared/ui";
import { validateForm }                                 from "@famulex/shared/util";
import { UserActions, UserState }                       from "@famulex/web/administration/data-access/user-state";
import { ofType }                                       from "@ngrx/effects";
import { ActionsSubject, Store }                        from "@ngrx/store";

@Component({
  selector: "administration-user-create",
  standalone: true,
  imports: [CommonModule, ButtonModule, RippleModule, PasswordModule, ReactiveFormsModule, InputSwitchModule, FormErrorComponent, FormLabelComponent, InputTextModule],
  templateUrl: "./user-edit.component.html",
  styleUrls: ["./user-edit.component.scss"]
})
export class UserEditComponent implements OnInit {

  createUserForm = this.fb.nonNullable.group({
    firstName: ["", Validators.required],
    lastName: ["", [Validators.required]],
    email: ["", [Validators.required, Validators.email]],
    username: ["", Validators.required],
    set_password: [false],
    password_temporary: [true],
    password: ["", [Validators.required]],
    password_confirmation: ["", [Validators.required]]
  });

  loading$ = this.store.select(UserState.selectActionInProgress);

  constructor(private fb: FormBuilder,
              private store: Store,
              private actions$: ActionsSubject,
              private dialogRef: DynamicDialogRef,
              protected config: DynamicDialogConfig<User>) {
    // Hide password fields if set_password is false
    this.createUserForm.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(form => {
        if (form.set_password) {
          this.createUserForm.controls.password.enable({ emitEvent: false });
          this.createUserForm.controls.password_confirmation.enable({ emitEvent: false });

          if (form.password_confirmation && form.password_confirmation !== form.password) {
            this.createUserForm.controls.password_confirmation.setErrors({ passwordMatch: true });
          }
        } else {
          this.createUserForm.controls.password.disable({ emitEvent: false });
          this.createUserForm.controls.password_confirmation.disable({ emitEvent: false });
        }
      });

    // Disable form while api call is in progress
    this.loading$.pipe(takeUntilDestroyed()).subscribe(loading => {
      if (loading) {
        this.createUserForm.disable();
      } else {
        this.createUserForm.enable();
      }
    });

    this.actions$.pipe(
      takeUntilDestroyed(),
      ofType(UserActions.createUserSuccess, UserActions.updateUserSuccess)
    ).subscribe(() => this.dialogRef.close());
  }

  ngOnInit(): void {
    if (this.config.data) {
      this.createUserForm.patchValue(this.config.data);
    }
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

      if (this.config.data) {
        this.store.dispatch(UserActions.updateUser({ key: this.config.data.key, userRequest }));
      } else {
        this.store.dispatch(UserActions.createUser({ userRequest }));
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
