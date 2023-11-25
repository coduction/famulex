import { CommonModule }     from "@angular/common";
import { Component, Input } from "@angular/core";
import { MenuItem }         from "primeng/api";
import { StepsModule }      from "primeng/steps";

@Component({
  selector: "wizard-steps",
  standalone: true,
  imports: [CommonModule, StepsModule],
  templateUrl: "./wizard-steps.component.html",
  styleUrls: ["./wizard-steps.component.scss"]
})
export class WizardStepsComponent {

  @Input() activeIndex = 0;
  @Input({ required: true }) steps: MenuItem[] = [];

}
