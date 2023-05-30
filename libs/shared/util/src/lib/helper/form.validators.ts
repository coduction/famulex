import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { AbstractControlFeedback }                        from "@famulex/shared/util";

export class FormWarning {
  static min(min: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const controlFeedback = control as AbstractControlFeedback;
      const value = control.value;

      if (value == undefined) {
        return null;
      }

      if (value < min) {
        // Create warning object
        const warning = {
          min: min,
          actual: value
        };

        // Add min warning to control warnings if warnings is not null
        controlFeedback.warnings = controlFeedback.warnings ? {
          ...controlFeedback.warnings,
          "min": warning
        } : { "min": warning };
        return null;
      }

      // Remove min warning from control warnings if warnings is not null
      if (controlFeedback.warnings) {
        delete controlFeedback.warnings["min"];
      }

      return null;
    };
  }

  static max(max: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const controlFeedback = control as AbstractControlFeedback;
      const value = control.value;

      if (value == undefined) {
        return null;
      }

      if (value > max) {
        // Create warning object
        const warning = {
          max: max,
          actual: value
        };

        // Add min warning to control warnings if warnings is not null
        controlFeedback.warnings = controlFeedback.warnings ? {
          ...controlFeedback.warnings,
          "max": warning
        } : { "max": warning };
        return null;
      }

      // Remove min warning from control warnings if warnings is not null
      if (controlFeedback.warnings) {
        delete controlFeedback.warnings["max"];
      }

      return null;
    };
  }
}
