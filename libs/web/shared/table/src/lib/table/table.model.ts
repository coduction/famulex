import { Type }         from "@angular/core";
import { MenuItem }     from "@coduction/primeng/api";
import { CellRenderer } from "../renderer/cell-renderer/cell-renderer.component";

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
  onClick: (entries: Map<K, D>) => Promise<boolean | void> | boolean | void | any;
}

export interface EntryAction<D> {
  icon?: string;
  label: string;
  onClick: (entry: D) => void;
}

export interface ColumnAction<D> {
  icon?: string;
  label?: string;
  onClick: (entry: D) => void;
}

export class TableColumn<T, V = any> {
  key: string;
  name: string;
  sortable: boolean;

  visible: boolean;
  visibleByDefault: boolean;

  cellRenderer?: Type<CellRenderer<V>>;

  field: (object: T) => V | null | undefined;

  constructor(config: {
    key: string,
    name: string,
    field: (object: T) => V | null | undefined,
    visibleByDefault?: boolean,
    sortable?: boolean,
    customRenderer?: Type<CellRenderer<V>>
  }) {
    this.key = config.key;
    this.name = config.name;
    this.field = config.field;

    this.sortable = config.sortable ?? true;
    this.visibleByDefault = config.visibleByDefault ?? true;
    this.visible = this.visibleByDefault;

    this.cellRenderer = config.customRenderer;
  }

  resetVisibility() {
    this.visible = this.visibleByDefault;
  }
}

export interface LoadDataEvent {
  pageIndex: number;
  pageSize: number;
  sortedBy: string[];

  search?: string;
}

export interface TableMetaData {
  loading: boolean;
  totalEntries: number | null;
  pageIndex: number;
  pageSize: number;
  sortedBy: string[];
  search?: string;
  actionInProgress?: boolean;
  activeTabKey?: string | number;
}

export interface TableTab extends MenuItem {
  key: number | string,
  label: string,
  icon?: string,
  // onActivate: () => void,
}

export enum TableTabVisibility {
  ALWAYS,
  NEVER,
  IF_MORE_THAN_ONE
}
