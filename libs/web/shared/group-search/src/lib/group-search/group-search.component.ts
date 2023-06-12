import { CommonModule }                                   from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Group }                                          from "@famulex/shared/famulex-api-client";
import { ColumnAction, TableColumn, TableComponent }      from "@famulex/web/shared/table";
import { GroupSearchStore }                               from "../+state/group-search.store";

@Component({
  selector: "group-search",
  standalone: true,
  imports: [CommonModule, TableComponent],
  templateUrl: "./group-search.component.html",
  styleUrls: ["./group-search.component.scss"],
  providers: [GroupSearchStore]
})
export class GroupSearchComponent implements OnInit {

  groupSearchColumns: TableColumn<Group>[] = [
    new TableColumn({ key: "key", name: $localize`Key`, field: group => group.key, visibleByDefault: false }),
    new TableColumn({ key: "name", name: $localize`Name`, field: group => group.name }),
    new TableColumn({ key: "description", name: $localize`Description`, field: group => group.description }),
    new TableColumn({ key: "type", name: $localize`Type`, field: group => group.type, visibleByDefault: false })
  ];

  columnActions: ColumnAction<Group>[] = [];

  @Input() heading?: string;
  @Input() headingSmall?: string;
  @Input() onSingleSelect?: (group: Group) => Promise<void | boolean> | void | boolean;

  @Output() groupSelection = new EventEmitter<string[]>();

  constructor(public groupSearchStore: GroupSearchStore) {
  }

  ngOnInit(): void {
    if (this.onSingleSelect) {
      this.columnActions = [{
        label: $localize`Select`, icon: "fa fa-hand-pointer", onClick: group => this.onSingleSelect?.(group)
      }];
    }

    this.groupSearchStore.loadGroups();
  }
}
