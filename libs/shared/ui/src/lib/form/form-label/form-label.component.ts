import { CommonModule }                                from "@angular/common";
import { Component }                                   from "@angular/core";
import { ControlValueAccessor, NgControl, Validators } from "@angular/forms";

/* eslint-disable */
@Component({
  selector: "ui-form-label",
  imports: [CommonModule],
  templateUrl: "./form-label.component.html",
  styleUrls: ["./form-label.component.scss"],
  standalone: true
})
export class FormLabelComponent implements ControlValueAccessor {

  constructor(public ngControl: NgControl) {
    ngControl.valueAccessor = this;
  }

  registerOnChange(fn: any): void {
  }

  registerOnTouched(fn: any): void {
  }

  writeValue(obj: any): void {
  }

  isOptional(): boolean {
    return !this.ngControl.control?.hasValidator(Validators.required);
  }

}
