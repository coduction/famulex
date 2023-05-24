import { animate, keyframes, style, transition, trigger }                                           from "@angular/animations";
import { CommonModule }                                                                             from "@angular/common";
import { Component, DestroyRef, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from "@angular/core";
import { takeUntilDestroyed }                                                                       from "@angular/core/rxjs-interop";
import { FormsModule }                                                                              from "@angular/forms";
import { MessageService }                                                                           from "@coduction/primeng/api";
import { LazyLoadEvent }                                                                            from "@coduction/primeng/api/lazyloadevent";
import { ButtonModule }                                                                             from "@coduction/primeng/button";
import { CheckboxModule }                                                                           from "@coduction/primeng/checkbox";
import { InputTextModule }                                                                          from "@coduction/primeng/inputtext";
import { ListboxModule }                                                                            from "@coduction/primeng/listbox";
import { OverlayPanel, OverlayPanelModule }                                                         from "@coduction/primeng/overlaypanel";
import { RippleModule }                                                                             from "@coduction/primeng/ripple";
import { Table, TableModule }                                                                       from "@coduction/primeng/table";
import { TriStateCheckboxModule }                                                                   from "@coduction/primeng/tristatecheckbox";
import { debounce, delay, Observable, of, switchMap }                                               from "rxjs";
import { EntryAction, LoadDataEvent, SelectionAction, TableAction, TableColumn }                    from "./table.model";

@Component({
  selector: "web-table",
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    RippleModule,
    TableModule,
    TriStateCheckboxModule,
    FormsModule,
    OverlayPanelModule,
    CheckboxModule,
    ListboxModule,
    InputTextModule
  ],
  templateUrl: "./table.component.html",
  styleUrls: ["./table.component.scss"],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger("fadeAndGrow", [
      transition(":enter", [
        animate("300ms ease-out", keyframes([
            style({
              opacity: 0,
              width: 0,
              paddingLeft: 0,
              paddingRight: 0,
              whiteSpace: "nowrap",
              scale: 0
            }),
            style({
              width: "*",
              paddingLeft: "*",
              paddingRight: "*"
            }),
            style({
              opacity: 1,
              scale: 1
            })
          ])
        )
      ]),
      transition(":leave", [
        animate("300ms ease-in", keyframes([
            style({
              opacity: 1,
              scale: 1,
              width: "*",
              paddingLeft: "*",
              paddingRight: "*",
              whiteSpace: "nowrap"
            }),
            style({
              scale: 0,
              opacity: 0
            }),
            style({
              width: 0,
              paddingLeft: 0,
              paddingRight: 0
            })
          ])
        )
      ])
    ])
  ]
})
export class TableComponent<K, D> implements OnInit {

  @Input() heading?: string;
  @Input() description?: string;
  @Input() showSearch = false;

  @Input({ required: true }) columns: TableColumn<D>[] = [];
  @Input() keyField = "key";

  @Input() tableActions: TableAction[] = [];
  @Input() entryActions: EntryAction<D>[] = [];
  @Input() selectionActions: SelectionAction<K, D>[] = [];

  @Input() textSelected?: string;
  @Input() textTotal?: string;

  /**
   * Caution!
   * This event always contains all selected keys. Those keys may be set programmatically or by the user.
   * If set programmatically, the full object may not be available in the selection map.
   */
  @Output() selection = new EventEmitter<Map<K, D | null>>();
  @Output() selectedKeysChange = new EventEmitter<K[]>();
  @Output() loadData = new EventEmitter<LoadDataEvent>;

  @ViewChild("table") table!: Table;
  @ViewChild("entryActionsPanel") entryActionsPanel!: OverlayPanel;
  @ViewChild("selectActionsPanel") selectActionsPanel!: OverlayPanel;

  protected selectionState: boolean | null = null;
  protected selectedEntries = new Map<K, D>();
  protected selectedEntryKeys: K[] = [];
  protected globalFilter?: string;

  private _data: D[] = [];
  private _actionEntry?: D;

  private _selectedColumns: TableColumn<D>[] = [];
  private _loading = false;
  private _totalEntries = 0;
  private _pageSize = 10;
  private _sortedBy: string[] = [];

  constructor(private destroyRef: DestroyRef,
              private messageService: MessageService) {
  }

  ngOnInit(): void {
    this.selectedColumns = this.columns.filter(column => column.visibleByDefault);
  }

  /**************************************************************************
   * Data
   **************************************************************************/
  @Input({ required: true }) set data(data: D[] | null) {
    this._data = data ?? [];
  }

  getData(): D[] {
    return this._data;
  }

  getKey(entry: D): K {
    return (entry as Record<string, unknown>)[this.keyField] as K;
  }

  getKeyString(entry: D): string {
    return (entry as Record<string, unknown>)[this.keyField] as string;
  }

  /**************************************************************************
   * Columns
   **************************************************************************/
  resetColumns(): void {
    this.columns.forEach(column => column.visible = column.visibleByDefault);
    this.selectedColumns = this.columns.filter(column => column.visibleByDefault);
  }

  selectAllColumns(): void {
    this.columns.forEach(column => column.visible = true);
    this._selectedColumns = this.columns;
  }

  get selectedColumns(): TableColumn<D>[] {
    return this._selectedColumns;
  }

  set selectedColumns(selectedColumns: TableColumn<D>[]) {
    this._selectedColumns = selectedColumns;

    this.columns.forEach(column => {
      column.visible = selectedColumns.includes(column);
    });
  }

  /**************************************************************************
   * Pagination and Sorting
   **************************************************************************/
  @Input() set loading(loading: boolean | null) {
    this._loading = loading ?? false;
  }

  @Input() set loading$(isLoading$: Observable<boolean>) {
    // TODO Alex: Minimum spinner time is currently added after the request is finished. It should display at least for the given time but not longer if the request takes longer
    const MINIMUM_SPINNER_TIME_MS = 500;
    const DEBOUNCE_TIME_MS = 500;

    isLoading$.pipe(
      takeUntilDestroyed(this.destroyRef),
      debounce(isLoading => {
        if (isLoading) {
          return of(null).pipe(delay(DEBOUNCE_TIME_MS));
        }
        return of(null);
      }),
      switchMap(isLoading => {
        if (isLoading) {
          return of(true);
        }
        return of(false).pipe(delay(MINIMUM_SPINNER_TIME_MS));
      })
    ).subscribe(isLoading => {
      this.loading = isLoading;
    });
  }

  isLoading(): boolean {
    return this._loading;
  }

  @Input() set totalEntries(totalEntries: number | null) {
    this._totalEntries = totalEntries ?? 0;
  }

  get totalAmount(): number {
    return this._totalEntries;
  }

  @Input() set pageSize(pageSize: number | null) {
    this._pageSize = pageSize ?? 10;
  }

  getPgeSize(): number {
    return this._pageSize;
  }

  @Input() set sortedBy(sortedBy: string[] | null) {
    this._sortedBy = sortedBy ?? [];
  }

  getSortedBy(): string[] {
    return this._sortedBy;
  }

  onLoadData(event: LazyLoadEvent) {
    const page = event.first ? event.first / (event.rows ?? this.getPgeSize()) : 0;
    const pageSize = event.rows ?? this.getPgeSize();
    const sortField = event.sortField ?? this.sortField;
    const sortOrder = event.sortOrder ?? this.sortOrder;
    const globalFilter = event.globalFilter;

    this.loadData.emit({
      pageIndex: page,
      pageSize,
      sortedBy: [`${sortField},${sortOrder === 1 ? "asc" : "desc"}`],
      globalFilter
    });
  }

  onFilter(globalFilter?: string) {
    this.globalFilter = globalFilter;

    this.table.filterGlobal(globalFilter, "contains");
  }

  onFilterKeydown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      this.onFilter();
    }
  }

  get sortField(): string {
    return this.getSortedBy()[0]?.split(",")[0] || "";
  }

  get sortOrder(): number {
    return this.getSortedBy()[0]?.split(",")[1] === "asc" ? 1 : -1;
  }

  /**************************************************************************
   * Entry Actions
   **************************************************************************/
  showEntryActions(event: Event, entry: D, target?: HTMLElement) {
    // Check whether current target is the same
    this._actionEntry = entry;

    if (this.entryActionsPanel.overlayVisible) {
      this.entryActionsPanel.hide();
      // Timeout is necessary to prevent clashing of events which leads only to hide the overlay
      setTimeout(() => this.entryActionsPanel.show(event), 150);
    } else {
      this.entryActionsPanel.show(event, target);
    }
  }

  resetEntryActions() {
    this.entryActionsPanel.hide();
    this._actionEntry = undefined;
  }

  dispatchEntryAction(entryAction: EntryAction<D>) {
    if (this._actionEntry) {
      entryAction.onClick(this._actionEntry);
    }

    this.resetEntryActions();
  }

  /**************************************************************************
   * Selection Actions
   **************************************************************************/
  dispatchSelectionAction(selectionAction: SelectionAction<K, D>) {
    // If selectionAction returns a promise, wait for it to resolve
    const result = selectionAction.onClick(this.selectedEntries);

    if (selectionAction.resetSelection) {
      if (result instanceof Promise) {
        result.then(() => this.selectedKeys(null));
      } else {
        this.selectedKeys(null);
      }
    }
  }

  /**************************************************************************
   * Selection
   **************************************************************************/
  @Input() selectedKeys(selectedKeys: K[] | null) {
    this.selectedEntryKeys = selectedKeys ?? [];

    // Remove all entries which are not in the selected keys
    this.selectedEntries.forEach((entry, key) => {
      if (!this.selectedEntryKeys.includes(key)) {
        this.selectedEntries.delete(key);
      }
    });

    // Try to add all entries which are in the selected keys
    this.selectedEntryKeys.forEach(key => {
      if (!this.selectedEntries.has(key)) {
        const entry = this.getData().find(entry => this.getKey(entry) === key);
        if (entry) {
          this.selectedEntries.set(key, entry);
        }
      }
    });

    this.checkSelectionState();
  }

  onSelection(entry: D, selected: boolean) {
    this.checkEntrySelection(entry, selected);

    this.checkSelectionState();
    this.emitSelection();
  }

  onSelectPage(select: boolean) {
    const pageData = this.table.filteredValue as D[] || this.table.value as D[] || [];
    pageData.forEach(entry => this.checkEntrySelection(entry, select, true));

    this.checkSelectionState();
    this.emitSelection();

    this.selectActionsPanel.hide();
  }

  checkEntrySelection(entry: D, selected: boolean, modifyKeys = false) {
    if (!selected) {
      this.selectedEntries.delete(this.getKey(entry));

      if (modifyKeys) {
        this.selectedEntryKeys = this.selectedEntryKeys.filter(key => key !== this.getKey(entry));
      }
    } else {
      this.selectedEntries.set(this.getKey(entry), entry);

      if (modifyKeys && !this.selectedEntryKeys.includes(this.getKey(entry))) {
        this.selectedEntryKeys = [...this.selectedEntryKeys, this.getKey(entry)];
      }
    }
  }

  checkSelectionState() {
    if (this.selectedEntryKeys.length === 0) {
      this.selectionState = null;
    } else if (this.selectedEntryKeys.length < this.totalAmount) {
      this.selectionState = false;
    } else if (this.selectedEntryKeys.length === this.totalAmount) {
      this.selectionState = true;
    }
  }

  emitSelection() {
    this.selection.emit(this.selectedEntries);
    this.selectedKeysChange.emit(this.selectedEntryKeys);
  }

  get selectedAmount(): number {
    return this.selectedEntryKeys.length;
  }

  get isPageSelected(): boolean {
    let isPageSelected = true;

    for (const entry of this._data) {
      if (!this.selectedEntryKeys.includes(this.getKey(entry))) {
        isPageSelected = false;
        break;
      }
    }

    return isPageSelected;
  }

  getSelectionButtonLabel(action: SelectionAction<K, D>) {
    if (typeof action.label === "function") {
      return action.label(this.selectedAmount);
    }

    return action.label;
  }

  /**************************************************************************
   * Helper
   **************************************************************************/
  showMessage(message: string, detail?: string) {
    this.messageService.add({ severity: "info", summary: message, detail: detail });
  }
}
