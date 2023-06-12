import { Injectable }                                    from "@angular/core";
import { GroupService, PageGroup }                       from "@famulex/shared/famulex-api-client";
import { LoadDataEvent, TableMetaData }                  from "@famulex/web/shared/table";
import { ComponentStore }                                from "@ngrx/component-store";
import { concatLatestFrom }                              from "@ngrx/effects";
import { produce }                                       from "immer";
import { catchError, EMPTY, Observable, switchMap, tap } from "rxjs";

export interface GroupSearchState {
  loading: boolean;
  actionInProgress: boolean;

  pageIndex: number;
  pageSize: number;
  sortedBy: string[];
  globalFilter: string | undefined;

  page: PageGroup | undefined;
}

const initialState: GroupSearchState = {
  loading: false,
  actionInProgress: false,

  pageIndex: 0,
  pageSize: 10,
  sortedBy: ["name,asc"],
  globalFilter: undefined,

  page: undefined
};

@Injectable()
export class GroupSearchStore extends ComponentStore<GroupSearchState> {

  readonly loading$ = this.select(state => state.loading);
  readonly groups$ = this.select(state => state.page?.content);
  readonly tableMetaData$ = this.select(state => ({
    loading: state.loading,
    totalEntries: state.page?.totalElements || null,
    pageIndex: state.pageIndex,
    pageSize: state.pageSize,
    sortedBy: state.sortedBy,
    globalFilter: state.globalFilter,
    actionInProgress: state.actionInProgress
  } as TableMetaData));


  constructor(private groupService: GroupService) {
    super(initialState);
  }

  loadGroups = this.effect((loadDataEvent$: Observable<LoadDataEvent | void>) => {
    return loadDataEvent$.pipe(
      tap(event => {
        if (event) {
          this._updateTableMetaData(event);
        }
      }),
      concatLatestFrom(() => this.tableMetaData$),
      switchMap(([_, metaData]) => this.groupService.loadGroups(metaData.pageIndex, metaData.pageSize, metaData.sortedBy, metaData.globalFilter).pipe(
        tap(page => this._setGroups(page)),
        catchError(error => {
          console.error(error);
          return EMPTY;
        })
      ))
    );
  });

  private _setGroups = this.updater((state, page: PageGroup) => {
    return produce(state, draft => {
      draft.page = page;
      draft.loading = false;
    });
  });

  private _updateTableMetaData = this.updater((state, loadDataEvent: LoadDataEvent) => {
    return produce(state, draft => {
      draft.loading = true;
      draft.pageIndex = loadDataEvent.pageIndex;
      draft.pageSize = loadDataEvent.pageSize;
      draft.sortedBy = loadDataEvent.sortedBy;
      draft.globalFilter = loadDataEvent.globalFilter;
    });
  });
}
