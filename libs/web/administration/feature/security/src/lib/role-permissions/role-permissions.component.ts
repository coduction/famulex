import { CommonModule }                                             from "@angular/common";
import { Component, Input, OnInit }                                 from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CheckboxModule }                                           from "@coduction/primeng/checkbox";
import { Right }                                                    from "@famulex/shared/famulex-api-client";
import { FormErrorComponent }                                       from "@famulex/shared/ui";
import { translateRight }                                           from "@famulex/shared/util";

@Component({
  selector: "security-role-permissions",
  standalone: true,
  imports: [CommonModule, CheckboxModule, FormsModule, FormErrorComponent, ReactiveFormsModule],
  templateUrl: "./role-permissions.component.html",
  styleUrls: ["./role-permissions.component.scss"]
})
export class RolePermissionsComponent implements OnInit {

  readonly Right = Right;

  @Input({ required: true }) permissions!: FormGroup<{ rights: FormControl }>;

  selectedRights: Right[] = [];

  ngOnInit() {
    this.selectedRights = this.permissions.value.rights;
  }

  onRightChange(selectedRights: Right[]) {
    this.selectedRights = selectedRights;
    this.permissions.patchValue({ rights: this.selectedRights });
  }

  translateRight(right: Right) {
    return translateRight(right);
  }
}
