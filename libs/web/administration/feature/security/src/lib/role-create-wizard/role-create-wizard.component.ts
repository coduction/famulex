import { CommonModule }                                from "@angular/common";
import { Component }                                   from "@angular/core";
import { FormBuilder, Validators }                     from "@angular/forms";
import { Right, RoleRequest, SecurityService }         from "@famulex/shared/famulex-api-client";
import { validateForm }                                from "@famulex/shared/util";
import { ROLE_CREATE_WIZARD_ID, RoleActions }          from "@famulex/web/administration/data-access/role-state";
import { WizardStepComponent, WizardWrapperComponent } from "@famulex/web/shared/wizard";
import { Store }                                       from "@ngrx/store";
import { RoleAssignmentsGroupEditComponent }           from "../role-assignments-group-edit/role-assignments-group-edit.component";
import { RoleAssignmentsUserEditComponent }            from "../role-assignments-user-edit/role-assignments-user-edit.component";
import { RoleDetailsComponent }                        from "../role-details/role-details.component";
import { RolePermissionsComponent }                    from "../role-permissions/role-permissions.component";
import { SecurityHelper }                              from "../security.helper";

@Component({
  selector: "security-role-create-wizard",
  standalone: true,
  imports: [CommonModule, WizardWrapperComponent, WizardStepComponent, RoleAssignmentsUserEditComponent, RoleAssignmentsGroupEditComponent, RolePermissionsComponent, RoleDetailsComponent],
  templateUrl: "./role-create-wizard.component.html",
  styleUrls: ["./role-create-wizard.component.scss"]
})
export class RoleCreateWizardComponent {

  protected readonly ROLE_CREATE_WIZARD_ID = ROLE_CREATE_WIZARD_ID;

  roleCreateForm = this.formBuilder.nonNullable.group({
    details: this.formBuilder.nonNullable.group({
      name: ["", [Validators.required], [this.securityHelper.validateRoleName()]],
      defaultRole: [false],
      description: [""]
    }),
    permissions: this.formBuilder.nonNullable.group({
      rights: this.formBuilder.nonNullable.control<Right[]>([], Validators.required)
    }),
    assignments: this.formBuilder.nonNullable.group({
      userKeys: this.formBuilder.nonNullable.control<string[]>([]),
      groupKeys: this.formBuilder.nonNullable.control<string[]>([])
    })
  });

  constructor(private store: Store,
              private formBuilder: FormBuilder,
              private securityService: SecurityService,
              private securityHelper: SecurityHelper) {
  }

  /**************************************************************************
   * Create Role
   **************************************************************************/
  onCreateRole = async () => {
    if (await validateForm(this.roleCreateForm)) {
      const request: RoleRequest = {
        name: this.detailsForm.controls.name.value,
        description: this.detailsForm.controls.description.value,
        defaultRole: this.detailsForm.controls.defaultRole.value,
        rights: this.permissionsForm.controls.rights.value,
        userKeys: this.userKeysForm.value,
        groupKeys: this.groupKeysForm.value
      };

      this.store.dispatch(RoleActions.create({ request }));
      return null;
    }

    return false;
  };

  /**************************************************************************
   * Role Details
   **************************************************************************/
  get detailsForm() {
    return this.roleCreateForm.controls.details;
  }

  onValidateDetails = () => validateForm(this.detailsForm);

  /**************************************************************************
   * Role Permissions
   **************************************************************************/
  get permissionsForm() {
    return this.roleCreateForm.controls.permissions;
  }

  onValidatePermissions = () => validateForm(this.permissionsForm);

  /**************************************************************************
   * Role Assignments
   **************************************************************************/
  get userKeysForm() {
    return this.roleCreateForm.controls.assignments.controls.userKeys;
  }

  get groupKeysForm() {
    return this.roleCreateForm.controls.assignments.controls.groupKeys;
  }

}
