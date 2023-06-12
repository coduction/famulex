import { CommonModule }                                from "@angular/common";
import { Component, Input }                            from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { CheckboxModule }                              from "@coduction/primeng/checkbox";
import { InputSwitchModule }                           from "@coduction/primeng/inputswitch";
import { InputTextModule }                             from "@coduction/primeng/inputtext";
import { InputTextareaModule }                         from "@coduction/primeng/inputtextarea";
import { SelectButtonModule }                          from "@coduction/primeng/selectbutton";
import { FormErrorComponent, FormLabelComponent }      from "@famulex/shared/ui";
import { InputPendingFeedbackDirective }               from "@famulex/shared/util";

@Component({
  selector: "security-role-details",
  standalone: true,
  imports: [CommonModule, FormErrorComponent, FormLabelComponent, InputPendingFeedbackDirective, InputTextModule, ReactiveFormsModule, InputTextareaModule, InputSwitchModule, CheckboxModule, SelectButtonModule],
  templateUrl: "./role-details.component.html",
  styleUrls: ["./role-details.component.scss"]
})
export class RoleDetailsComponent {

  @Input({ required: true }) details!: FormGroup<{ name: FormControl<string>, defaultRole: FormControl<boolean>, description: FormControl<string> }>;

  defaultRoleOptions = [
    { label: $localize`Yes`, value: true },
    { label: $localize`No`, value: false }
  ];

}
