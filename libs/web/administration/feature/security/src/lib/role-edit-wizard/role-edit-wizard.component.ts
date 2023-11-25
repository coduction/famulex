import { CommonModule }                                from "@angular/common";
import { Component, OnInit }                           from "@angular/core";
import { FormBuilder, Validators }                     from "@angular/forms";
import { DynamicDialogConfig }                         from "primeng/dynamicdialog";
import { Right, Role, RoleRequest, SecurityService }   from "@famulex/shared/famulex-api-client";
import { validateForm }                                from "@famulex/shared/util";
import { ROLE_EDIT_WIZARD_ID, RoleActions }            from "@famulex/web/administration/data-access/role-state";
import { WizardStepComponent, WizardWrapperComponent } from "@famulex/web/shared/wizard";
import { Store }                                       from "@ngrx/store";
import { RoleDetailsComponent }                        from "../role-details/role-details.component";
import { RolePermissionsComponent }                    from "../role-permissions/role-permissions.component";
import { SecurityHelper }                              from "../security.helper";

@Component({
  selector: "security-role-edit-wizard",
  standalone: true,
  imports: [CommonModule, WizardWrapperComponent, WizardStepComponent, RoleDetailsComponent, RolePermissionsComponent],
  templateUrl: "./role-edit-wizard.component.html",
  styleUrls: ["./role-edit-wizard.component.scss"]
})
export class RoleEditWizardComponent implements OnInit {

  protected readonly ROLE_EDIT_WIZARD_ID = ROLE_EDIT_WIZARD_ID;

  roleEditForm = this.formBuilder.nonNullable.group({
    details: this.formBuilder.nonNullable.group({
      name: ["", [Validators.required], [this.securityHelper.validateRoleName(this.config.data!.name)]],
      defaultRole: [false],
      description: [""]
    }),
    permissions: this.formBuilder.nonNullable.group({
      rights: this.formBuilder.nonNullable.control<Right[]>([], Validators.required)
    })
  });

  constructor(private store: Store,
              private formBuilder: FormBuilder,
              private securityService: SecurityService,
              private securityHelper: SecurityHelper,
              private config: DynamicDialogConfig<Role>) {

  }

  ngOnInit(): void {
    this.roleEditForm.controls.details.patchValue(this.config.data!);
    this.roleEditForm.controls.permissions.patchValue(this.config.data!);
  }

  onUpdateRole = async () => {
    if (await validateForm(this.roleEditForm)) {
      const request: RoleRequest = {
        name: this.roleEditForm.value.details!.name!,
        description: this.roleEditForm.value.details!.description,
        defaultRole: this.roleEditForm.value.details!.defaultRole!,
        rights: this.roleEditForm.value.permissions!.rights!
      };

      this.store.dispatch(RoleActions.update({ key: this.config.data!.key, request }));
      return null;
    }

    return false;
  };

  onValidateDetails = () => validateForm(this.roleEditForm.controls.details);

  onValidatePermissions = () => validateForm(this.roleEditForm.controls.permissions);
}
