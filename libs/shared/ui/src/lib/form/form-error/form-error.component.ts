import { CommonModule }                    from "@angular/common";
import { Component }                       from "@angular/core";
import { ControlValueAccessor, NgControl } from "@angular/forms";
import { AbstractControlFeedback }         from "@famulex/shared/util";

/* eslint-disable */
@Component({
  selector: "ui-form-error",
  imports: [CommonModule],
  templateUrl: "./form-error.component.html",
  styleUrls: ["./form-error.component.scss"],
  standalone: true
})
export class FormErrorComponent implements ControlValueAccessor {

  constructor(public ngControl: NgControl) {
    ngControl.valueAccessor = this;
  }

  registerOnChange(fn: any): void {
  }

  registerOnTouched(fn: any): void {
  }

  writeValue(obj: any): void {
  }

  get feedbackControl() {
    return this.ngControl.control as AbstractControlFeedback;
  }
}
