import { CommonModule }         from "@angular/common";
import { Component, Input }     from "@angular/core";
import { FormControl }          from "@angular/forms";
import { GroupSearchComponent } from "@famulex/web/shared/group-search";
import { UserSearchComponent }  from "@famulex/web/shared/user-search";

@Component({
  selector: "security-role-assignments-group-edit",
  standalone: true,
  imports: [CommonModule, GroupSearchComponent, UserSearchComponent],
  templateUrl: "./role-assignments-group-edit.component.html",
  styleUrls: ["./role-assignments-group-edit.component.scss"]
})
export class RoleAssignmentsGroupEditComponent {

  @Input({ required: true }) groupKeysForm!: FormControl<string[]>;

  onGroupSelection(groupKeys: string[]) {
    this.groupKeysForm.setValue(groupKeys);
  }
}
