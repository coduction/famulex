import { CommonModule }        from "@angular/common";
import { Component, Input }    from "@angular/core";
import { FormControl }         from "@angular/forms";
import { UserSearchComponent } from "@famulex/web/shared/user-search";

@Component({
  selector: "security-role-assignments-user-edit",
  standalone: true,
  imports: [CommonModule, UserSearchComponent],
  templateUrl: "./role-assignments-user-edit.component.html",
  styleUrls: ["./role-assignments-user-edit.component.scss"]
})
export class RoleAssignmentsUserEditComponent {

  @Input({ required: true }) userKeysForm!: FormControl<string[]>;

  onUserSelection(userKeys: string[]) {
    this.userKeysForm.setValue(userKeys);
  }
}
