export interface TableAction {
  icon?: string;
  label: string;
  primary?: boolean;
  onClick: () => void;
}

export interface SelectionAction<K, D> {
  icon?: string;
  label: string | ((amount: number) => string);
  primary?: boolean;
  resetSelection?: boolean;
  onClick: (entries: Map<K, D>) => void | Promise<any>;
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

  field: (object: T) => V | V[] | null | undefined;

  constructor(key: string, name: string, visibleByDefault: boolean, field: (object: T) => V | V[] | null | undefined) {
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

export interface LoadDataEvent {
  pageIndex: number;
  pageSize: number;
  sortedBy: string[];

  globalFilter?: string;
  filters?: { [s: string]: any };
}
