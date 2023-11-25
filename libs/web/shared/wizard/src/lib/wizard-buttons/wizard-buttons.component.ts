import { CommonModule }          from "@angular/common";
import { Component, Input }      from "@angular/core";
import { ButtonModule }          from "primeng/button";
import { FADE_AND_SCALE_X }      from "@famulex/shared/ui";
import { Wizard, WizardActions } from "@famulex/web/shared/wizard";
import { Store }                 from "@ngrx/store";

@Component({
  selector: "wizard-buttons",
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: "./wizard-buttons.component.html",
  styleUrls: ["./wizard-buttons.component.scss"],
  animations: [FADE_AND_SCALE_X]
})
export class WizardButtonsComponent {

  @Input({ required: true }) wizard!: Wizard;

  constructor(private store: Store) {

  }

  onCancel(): void {
    this.store.dispatch(WizardActions.cancel({ id: this.wizard.id }));
  }

  onNext(): void {
    this.store.dispatch(WizardActions.next({ id: this.wizard.id, index: this.wizard.activeStepIndex }));
  }

  onPrevious(): void {
    this.store.dispatch(WizardActions.previous({ id: this.wizard.id, index: this.wizard.activeStepIndex }));
  }

  onFinish(): void {
    this.store.dispatch(WizardActions.finish({ id: this.wizard.id }));
  }

  get cancel() {
    return this.wizard.cancelButton;
  }

  get previous() {
    return this.wizard.previousButton;
  }

  get next() {
    return this.wizard.nextButton;
  }

  get finish() {
    return this.wizard.finishButton;
  }
}
