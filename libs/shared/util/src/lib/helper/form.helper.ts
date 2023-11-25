import { AbstractControl, FormControl, FormGroup, ValidationErrors } from "@angular/forms";

export interface AbstractControlFeedback extends AbstractControl {
  warnings: ValidationErrors | null;
  infos: ValidationErrors | null;
}

export async function validateForm(form: FormGroup) {
  Object.keys(form.controls).forEach(field => {
    const control = form.get(field);
    if (control instanceof FormControl) {
      control.markAsTouched({ onlySelf: true });
      control.markAsDirty({ onlySelf: true });
    } else if (control instanceof FormGroup) {
      validateForm(control);
    }
  });

  form.updateValueAndValidity();

  if (form.status === "PENDING") {
    return new Promise<boolean>(resolve => {
      const subscription = form.statusChanges.subscribe(status => {
        if (status === "VALID" || status === "INVALID") {
          subscription.unsubscribe();
          resolve(form.valid);
        }
      });
    });
  }

  return form.valid;
}

export function getFormError(control: AbstractControl, errorKey?: string): boolean | null | unknown {
  if (!errorKey) {
    return control.invalid && control.dirty;
  }

  if (control.dirty) {
    return control.getError(errorKey);
  }

  return null;
}

export function getFormWarning(control: AbstractControl, warningKey?: string): boolean | null | unknown {
  if (control.invalid || !control.touched) {
    return null;
  }

  const controlFeedback = control as AbstractControlFeedback;

  if (warningKey && controlFeedback.warnings && controlFeedback.warnings[warningKey]) {
    return controlFeedback.warnings[warningKey];
  }

  return null;
}

export function getFormInfos(control: AbstractControl, warningKey?: string): boolean | null | unknown {
  if (control.invalid || !control.touched) {
    return null;
  }

  const controlFeedback = control as AbstractControlFeedback;

  if (warningKey && controlFeedback.infos && controlFeedback.infos[warningKey]) {
    return controlFeedback.infos[warningKey];
  }

  return null;
}


