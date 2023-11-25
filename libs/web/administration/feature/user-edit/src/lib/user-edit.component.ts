import { CommonModule }                                                                                      from "@angular/common";
import { Component, OnInit }                                                                                 from "@angular/core";
import { takeUntilDestroyed }                                                                                from "@angular/core/rxjs-interop";
import { AbstractControl, AsyncValidatorFn, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from "@angular/forms";
import { DynamicDialogConfig }                                                                               from "primeng/dynamicdialog";
import { InputSwitchModule }                                                                                 from "primeng/inputswitch";
import { InputTextModule }                                                                                   from "primeng/inputtext";
import { PasswordModule }                                                                                    from "primeng/password";
import { User, UserRequest, UserService }                                                                    from "@famulex/shared/famulex-api-client";
import { FormErrorComponent, FormLabelComponent }                                                            from "@famulex/shared/ui";
import { InputPendingFeedbackDirective, validateForm }                                                       from "@famulex/shared/util";
import { USER_EDIT_WIZARD_ID, UserActions, UserState }                                                       from "@famulex/web/administration/data-access/user-state";
import { WizardStepComponent, WizardWrapperComponent }                                                       from "@famulex/web/shared/wizard";
import { Store }                                                                                             from "@ngrx/store";
import { catchError, delay, map, Observable, of, switchMap }                                                 from "rxjs";

@Component({
  selector: "administration-user-edit",
  standalone: true,
  imports: [CommonModule, WizardWrapperComponent, WizardStepComponent, ReactiveFormsModule, FormLabelComponent, FormErrorComponent, InputSwitchModule, PasswordModule, InputTextModule, InputPendingFeedbackDirective],
  templateUrl: "./user-edit.component.html",
  styleUrls: ["./user-edit.component.scss"]
})
export class UserEditComponent implements OnInit {

  userForm = this.fb.nonNullable.group({
    firstName: ["", Validators.required],
    lastName: ["", [Validators.required]],
    email: ["", [Validators.required, Validators.email], [this.validateEmail()]],
    username: ["", [Validators.required], [this.validateUsername()]]
  });

  passwordForm = this.fb.nonNullable.group({
    set_password: [false],
    password_temporary: [true],
    password: ["", [Validators.required]],
    password_confirmation: ["", [Validators.required]]
  });

  loading$ = this.store.select(UserState.selectActionInProgress);

  constructor(private fb: FormBuilder,
              private store: Store,
              private userService: UserService,
              protected config: DynamicDialogConfig<User>) {
    // Hide password fields if set_password is false
    this.passwordForm.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(form => {
        if (form.set_password) {
          this.passwordForm.controls.password.enable({ emitEvent: false });
          this.passwordForm.controls.password_confirmation.enable({ emitEvent: false });

          if (form.password_confirmation && form.password_confirmation !== form.password) {
            this.passwordForm.controls.password_confirmation.setErrors({ passwordMatch: true });
          }
        } else {
          this.passwordForm.controls.password.disable({ emitEvent: false });
          this.passwordForm.controls.password_confirmation.disable({ emitEvent: false });
        }
      });

    // Disable form while api call is in progress
    this.loading$.pipe(takeUntilDestroyed()).subscribe(loading => {
      if (loading) {
        this.userForm.disable();
        this.passwordForm.disable();
      } else {
        this.userForm.enable();
        this.passwordForm.enable();
      }
    });
  }

  ngOnInit(): void {
    if (this.config.data) {
      this.userForm.patchValue(this.config.data);
    }
  }

  onFinish = async () => {
    if (await validateForm(this.userForm) && await validateForm(this.passwordForm)) {
      const userRequest: UserRequest = {
        firstName: this.userForm.controls.firstName.value,
        lastName: this.userForm.controls.lastName.value,
        email: this.userForm.controls.email.value,
        username: this.userForm.controls.username.value
      };

      if (this.passwordForm.value.set_password) {
        userRequest.password = this.passwordForm.controls.password.value;
        userRequest.passwordTemporary = this.passwordForm.controls.password_temporary.value;
      }

      if (this.config.data) {
        this.store.dispatch(UserActions.update({ key: this.config.data.key, userRequest }));
      } else {
        this.store.dispatch(UserActions.create({ userRequest }));
      }

      return;
    }

    return false;
  };

  onNextDetails = () => {
    return validateForm(this.userForm);
  };

  onNextCredentials = () => {
    return validateForm(this.passwordForm);
  };

  validateUsername(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (this.config.data?.username === control.value) {
        return of(null);
      }

      return of(control.value).pipe(
        delay(500),
        switchMap(username => this.userService.checkUserAvailability(username)
          .pipe(
            map(userNameAvailable => {
              if (userNameAvailable) {
                return null;
              }

              return { taken: true };
            }),
            catchError(() => {
              return of({ asyncError: true });
            })
          )
        )
      );
    };
  }

  validateEmail(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (this.config.data?.email === control.value) {
        return of(null);
      }

      return of(control.value).pipe(
        delay(500),
        switchMap(email => this.userService.checkUserAvailability(undefined, email).pipe(
            map(emailAvailable => {
              if (emailAvailable) {
                return null;
              }

              return { taken: true };
            }),
            catchError(() => {
              return of({ asyncError: true });
            })
          )
        )
      );
    };
  }

  get wizardId(): string {
    return USER_EDIT_WIZARD_ID;
  }
}
