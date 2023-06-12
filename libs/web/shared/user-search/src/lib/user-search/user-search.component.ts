import { CommonModule }                                               from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Optional, Output }   from "@angular/core";
import { CardModule }                                                 from "@coduction/primeng/card";
import { DynamicDialogConfig, DynamicDialogRef }                      from "@coduction/primeng/dynamicdialog";
import { User }                                                       from "@famulex/shared/famulex-api-client";
import { ColumnAction, SelectionAction, TableColumn, TableComponent } from "@famulex/web/shared/table";
import { UserSearchStore }                                            from "../+state/user-search.store";

export interface UserSearchConfig {
  heading?: string;
  headingSmall?: string;
  onSingleSelect?: (user: User) => Promise<void | boolean> | void | boolean;
  onMultiSelect?: (userKeys: string[]) => Promise<void | boolean> | void | boolean;
}

@Component({
  selector: "user-search",
  standalone: true,
  imports: [CommonModule, CardModule, TableComponent],
  templateUrl: "./user-search.component.html",
  styleUrls: ["./user-search.component.scss"],
  providers: [UserSearchStore]
})
export class UserSearchComponent implements OnInit {

  userSearchColumns: TableColumn<User>[] = [
    new TableColumn({ key: "key", name: $localize`Key`, field: user => user.key, visibleByDefault: false }),
    new TableColumn({ key: "firstName", name: $localize`First Name`, field: user => user.firstName }),
    new TableColumn({ key: "lastName", name: $localize`Last Name`, field: user => user.lastName }),
    new TableColumn({ key: "username", name: $localize`Username`, field: user => user.username, visibleByDefault: false }),
    new TableColumn({ key: "email", name: $localize`E-Mail`, field: user => user.email, visibleByDefault: false })
  ];

  selectionActions: SelectionAction<string, User>[] = [];
  columnActions: ColumnAction<User>[] = [];

  @Input() heading?: string;
  @Input() headingSmall?: string;

  @Output() userSelection = new EventEmitter<string[]>();

  private _onSingleSelect?: (user: User) => Promise<void | boolean> | void | boolean;
  private _onMultiSelect?: (userKeys: string[]) => Promise<void | boolean> | void | boolean;

  constructor(public userSearchStore: UserSearchStore,
              @Optional() private config: DynamicDialogConfig<UserSearchConfig>,
              @Optional() private dialogRef: DynamicDialogRef) {
  }

  ngOnInit(): void {
    this.userSearchStore.loadUsers();

    if (this.config?.data) {
      this.heading = this.config.data.heading;
      this.headingSmall = this.config.data.headingSmall;

      if (this.config.data.onSingleSelect) {
        this.onSingleSelect = this.config.data.onSingleSelect;
      }

      if (this.config.data.onMultiSelect) {
        this.onMultiSelect = this.config.data.onMultiSelect;
      }
    }
  }

  @Input() set onSingleSelect(onSingleSelect: (user: User) => Promise<void | boolean> | void | boolean) {
    this._onSingleSelect = onSingleSelect;
    this.columnActions = [{
      label: $localize`Select`,
      icon: "fa fa-hand-pointer",
      onClick: user => {
        this._onSingleSelect?.(user);
        this.dialogRef?.close();
      }
    }];
  }

  @Input() set onMultiSelect(onMultiSelect: (userKeys: string[]) => Promise<void | boolean> | void | boolean) {
    this._onMultiSelect = onMultiSelect;
    this.selectionActions = [{
      label: (amount) => {
        if (amount === 1) {
          return $localize`Select 1 User`;
        }

        return $localize`Select ${amount} Users`;
      },
      icon: "fa fa-hand-pointer",
      primary: true,
      onClick: users => {
        this._onMultiSelect?.(Array.from(users.keys()));
        this.dialogRef?.close();
      }
    }];
  }
}
