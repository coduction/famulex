export interface TableAction {
  icon?: string;
  label: string;
  primary?: boolean;
  onClick: () => void;
}

export interface SelectionAction<D> {
  icon?: string;
  label: string;
  primary?: boolean;
  onClick: (entries: D[]) => void;
}

export interface EntryAction<D> {
  icon?: string;
  label: string;
  onClick: (entry: D) => void;
}

export class TableColumn<T, V = string> {

  key: string;
  name: string;
  visible: boolean;
  visibleByDefault: boolean;

  field: (object: T) => V;

  constructor(key: string, name: string, visibleByDefault: boolean, field: (object: T) => V) {
    this.key = key;
    this.name = name;
    this.visible = visibleByDefault;
    this.visibleByDefault = visibleByDefault;

    this.field = field;
  }

  resetVisibility() {
    this.visible = this.visibleByDefault;
  }
}

export interface Pagination {
  page: number;
  pageSize: number;
  sortedBy: string[];
}
