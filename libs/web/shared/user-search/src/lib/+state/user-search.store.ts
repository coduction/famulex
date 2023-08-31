import { Injectable }                                    from "@angular/core";
import { PageUser, UserService }                         from "@famulex/shared/famulex-api-client";
import { LoadDataEvent, TableMetaData }                  from "@famulex/web/shared/table";
import { ComponentStore }                                from "@ngrx/component-store";
import { concatLatestFrom }                              from "@ngrx/effects";
import { produce }                                       from "immer";
import { catchError, EMPTY, Observable, switchMap, tap } from "rxjs";

export interface UserSearchState {
  loading: boolean;
  actionInProgress: boolean;

  pageIndex: number;
  pageSize: number;
  sortedBy: string[];
  search: string | undefined;

  page: PageUser | undefined;
}

const initialState: UserSearchState = {
  loading: false,
  actionInProgress: false,

  pageIndex: 0,
  pageSize: 5,
  sortedBy: ["firstName,asc"],
  search: undefined,

  page: undefined
};

@Injectable()
export class UserSearchStore extends ComponentStore<UserSearchState> {

  readonly loading$ = this.select(state => state.loading);
  readonly users$ = this.select(state => state.page?.content);
  readonly tableMetaData$ = this.select(state => ({
    loading: state.loading,
    totalEntries: state.page?.totalElements || null,
    pageIndex: state.pageIndex,
    pageSize: state.pageSize,
    sortedBy: state.sortedBy,
    search: state.search,
    actionInProgress: state.actionInProgress
  } as TableMetaData));


  constructor(private userService: UserService) {
    super(initialState);
  }

  loadUsers = this.effect((loadDataEvent$: Observable<LoadDataEvent | void>) => {
    return loadDataEvent$.pipe(
      tap(event => {
        if (event) {
          this._updateTableMetaData(event);
        }
      }),
      concatLatestFrom(() => this.tableMetaData$),
      switchMap(([_, metaData]) => this.userService.loadUsers(metaData.pageIndex, metaData.pageSize, metaData.sortedBy, metaData.search).pipe(
        tap(page => this._setUsers(page)),
        catchError(error => {
          console.error(error);
          return EMPTY;
        })
      ))
    );
  });

  private _setUsers = this.updater((state, page: PageUser) => {
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
      draft.search = loadDataEvent.search;
    });
  });
}
