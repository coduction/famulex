import { CommonModule }                             from "@angular/common";
import { Component, Input, TemplateRef, ViewChild } from "@angular/core";

@Component({
  selector: "wizard-step",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./wizard-step.component.html",
  styleUrls: ["./wizard-step.component.scss"]
})
export class WizardStepComponent {

  @Input({ required: true }) title!: string;

  @Input() onPrevious?: () => Promise<boolean | void | null | undefined> | boolean | void | null | undefined;
  @Input() onNext?: () => Promise<boolean | void | null | undefined> | boolean | void | null | undefined;

  @ViewChild(TemplateRef) content!: TemplateRef<unknown>;
}


