import { CommonModule }                    from "@angular/common";
import { Component, Input }                from "@angular/core";
import { ControlValueAccessor, NgControl } from "@angular/forms";
import { FADE_AND_GROW_Y }                 from "../../animations/animations";

/* eslint-disable */
@Component({
  selector: "ui-form-error",
  imports: [CommonModule],
  templateUrl: "./form-error.component.html",
  styleUrls: ["./form-error.component.scss"],
  standalone: true,
  animations: [
    FADE_AND_GROW_Y
  ]
})
export class FormErrorComponent implements ControlValueAccessor {

  @Input() requiredText = $localize`This field is required`;

  constructor(public ngControl: NgControl) {
    ngControl.valueAccessor = this;
  }

  registerOnChange(fn: any): void {
  }

  registerOnTouched(fn: any): void {
  }

  writeValue(obj: any): void {
  }

  // get feedbackControl() {
  //   return this.ngControl.control as AbstractControlFeedback;
  // }
}
