import { CommonModule }                                                                             from "@angular/common";
import { Component, DestroyRef, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from "@angular/core";
import { takeUntilDestroyed }                                                                       from "@angular/core/rxjs-interop";
import { FormsModule }                                                                              from "@angular/forms";
import { MessageService }                                                                           from "@coduction/primeng/api";
import { LazyLoadEvent }                                                                            from "@coduction/primeng/api/lazyloadevent";
import { ButtonModule }                                                                             from "@coduction/primeng/button";
import { CheckboxModule }                                                                           from "@coduction/primeng/checkbox";
import { ListboxModule }                                                                            from "@coduction/primeng/listbox";
import { OverlayPanel, OverlayPanelModule }                                                         from "@coduction/primeng/overlaypanel";
import { RippleModule }                                                                             from "@coduction/primeng/ripple";
import { Table, TableModule }                                                                       from "@coduction/primeng/table";
import { TriStateCheckboxModule }                                                                   from "@coduction/primeng/tristatecheckbox";
import { debounce, delay, Observable, of, switchMap }                                               from "rxjs";
import { EntryAction, Pagination, SelectionAction, TableAction, TableColumn }                       from "./table.model";

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
    ListboxModule
  ],
  templateUrl: "./table.component.html",
  styleUrls: ["./table.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class TableComponent<D, K> implements OnInit {

  @Input() title?: string;
  @Input() description?: string;

  @Input({ required: true }) columns: TableColumn<D>[] = [];
  @Input() keyField = "key";

  @Input() tableActions: TableAction[] = [];
  @Input() entryActions: EntryAction<D>[] = [];
  @Input() selectionActions: SelectionAction<D>[] = [];

  @Input() selectedEntryKeys: K[] = [];

  @Output() pagination = new EventEmitter<Pagination>;
  @Output() selection = new EventEmitter<D[]>();
  @Output() selectionKeys = new EventEmitter<K[]>();

  @ViewChild("table") table!: Table;
  @ViewChild("entryActionsPanel") entryActionsPanel!: OverlayPanel;
  @ViewChild("selectActionsPanel") selectActionsPanel!: OverlayPanel;

  selectionState: boolean | null = null;
  selectedEntries: D[] = [];

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

  getTotalEntries(): number {
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

  onPagination(event: LazyLoadEvent) {
    const page = event.first ? event.first / (event.rows ?? this.getPgeSize()) : 0;
    const pageSize = event.rows ?? this.getPgeSize();
    const sortField = event.sortField ?? this.sortField;
    const sortOrder = event.sortOrder ?? this.sortOrder;

    this.pagination.emit({
      page,
      pageSize,
      sortedBy: [`${sortField},${sortOrder === 1 ? "asc" : "desc"}`]
    });
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
  showEntryActions(event: Event, entry: D) {
    // Check whether current target is the same
    this._actionEntry = entry;

    if (this.entryActionsPanel.overlayVisible) {
      this.entryActionsPanel.hide();
      // Timeout is necessary to prevent clashing of events which leads only to hide the overlay
      setTimeout(() => this.entryActionsPanel.show(event), 150);
    } else {
      this.entryActionsPanel.show(event);
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
   * Selection
   **************************************************************************/
  onSelection(selectedEntry: D) {
    if (this.selectedEntries.includes(selectedEntry)) {
      this.selectedEntries = this.selectedEntries.filter(entry => entry !== selectedEntry);
    } else {
      this.selectedEntries.push(selectedEntry);
    }

    this.checkSelectionState();

    this.selection.emit(this.selectedEntries);
    this.selectionKeys.emit(this.selectedEntryKeys);
  }

  onSelectPage(first: number, rows: number) {
    this.selectedEntries = this.getData().slice(first, first + rows);
    this.selectedEntryKeys = this.selectedEntries.map(entry => this.getKey(entry));

    this.checkSelectionState();

    this.selection.emit(this.selectedEntries);
    this.selectionKeys.emit(this.selectedEntryKeys);

    this.selectActionsPanel.hide();
  }

  checkSelectionState() {
    if (this.selectedEntries.length === 0) {
      this.selectionState = null;
    } else if (this.selectedEntries.length < this.getTotalEntries()) {
      this.selectionState = false;
    } else if (this.selectedEntries.length === this.getTotalEntries()) {
      this.selectionState = true;
    }
  }

  /**************************************************************************
   * Helper
   **************************************************************************/
  showMessage(message: string) {
    this.messageService.add({ severity: "info", summary: message });
  }
}
