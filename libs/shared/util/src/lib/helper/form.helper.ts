import { FormControl, FormGroup } from "@angular/forms";

export function validateForm(form: FormGroup): boolean {
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

  return form.valid;
}
